import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ProjetDetail.css';

function profilLink(pseudo) {
  const myPseudo = localStorage.getItem('pseudo');
  return myPseudo && myPseudo === pseudo ? '/profil' : `/u/${pseudo}`;
}


const API_URL = 'http://localhost:8080/api';

const MATIERE_COLORS = {
  WEB:        { bg: '#1a2a3a', text: '#4daaff' },
  UI:         { bg: '#2a1a3a', text: '#b47dff' },
  UX:         { bg: '#1a2a2a', text: '#4dffcf' },
  TROIS_D:    { bg: '#2a2a1a', text: '#ffd04d' },
  DESIGN:     { bg: '#3a1a2a', text: '#ff7db4' },
  MULTIMEDIA: { bg: '#1a2a1a', text: '#7dff8a' },
  AUTRE:      { bg: '#1e1e2a', text: '#8a8799' },
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── FichierViewer ───────────────────────────────────────── */
function FichierViewer({ url, titre, index }) {
  const ext = url.split('.').pop().toLowerCase();

  if (['jpg','jpeg','png','webp'].includes(ext)) return (
    <div className="fv-wrap fv-wrap--image">
      <img src={url} alt={`${titre} — fichier ${index + 1}`} className="fv-image" />
    </div>
  );

  if (ext === 'mp4') return (
    <div className="fv-wrap">
      <div className="fv-header">
        <span className="fv-label">🎬 Vidéo</span>
      </div>
      <video controls className="fv-video" preload="metadata">
        <source src={url} type="video/mp4" />
      </video>
    </div>
  );

  if (ext === 'pdf') return (
    <div className="fv-wrap">
      <div className="fv-header">
        <span className="fv-label">📄 Document PDF</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="fv-dl-btn">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 2v9M4 8l4 4 4-4"/><path d="M2 14h12"/></svg>
          Télécharger
        </a>
      </div>
      <iframe src={url} className="fv-pdf" title={titre} />
    </div>
  );

  const labels = { glb: '🧊 Modèle 3D (.glb)', gltf: '🧊 Modèle 3D (.gltf)' };
  return (
    <div className="fv-wrap fv-wrap--dl">
      <div className="fv-header">
        <span className="fv-label">{labels[ext] || '📎 Fichier joint'}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="fv-dl-btn fv-dl-btn--full">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 2v9M4 8l4 4 4-4"/><path d="M2 14h12"/></svg>
          Télécharger
        </a>
      </div>
    </div>
  );
}

/* ── Modal confirmation ──────────────────────────────────── */
function ConfirmModal({ onConfirm, onCancel, title, text, confirmLabel, confirmClass, requireMessage, messagePlaceholder }) {
  const [msg, setMsg] = useState('');
  const canConfirm = !requireMessage || msg.trim().length >= 10;
  return (
    <div className="cm-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="cm-box">
        <div className="cm-header">
          <h3 className="cm-title">{title}</h3>
          <button className="cm-close" onClick={onCancel}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>
        <div className="cm-body">
          <p className="cm-text">{text}</p>
          {requireMessage && (
            <div className="cm-field">
              <label className="cm-label">{messagePlaceholder} <span className="cm-required">(min. 10 car.)</span></label>
              <textarea className="cm-textarea" value={msg} onChange={e => setMsg(e.target.value)} rows={3} autoFocus />
              <span className="cm-count">{msg.length} / 10 min</span>
            </div>
          )}
        </div>
        <div className="cm-footer">
          <button className="cm-btn cm-btn--cancel" onClick={onCancel}>Annuler</button>
          <button className={`cm-btn ${confirmClass || 'cm-btn--danger'}`} onClick={() => onConfirm(msg)} disabled={!canConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════════════════════════════ */
export default function ProjetDetail() {
  const { id } = useParams();

  const [projet, setProjet]     = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [liked, setLiked]       = useState(false);
  const [likes, setLikes]       = useState(0);
  const [newComment, setNewComment] = useState({ titre: '', contenu: '' });
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [signalModal, setSignalModal] = useState(null);

  const token    = localStorage.getItem('token');
  const isLogged = !!token;
  const myPseudo = localStorage.getItem('pseudo');
  const isAdmin  = localStorage.getItem('role') === 'ADMIN';

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    Promise.all([
      fetch(`${API_URL}/projets/${id}`),
      fetch(`${API_URL}/projets/${id}/commentaires`),
      token ? fetch(`${API_URL}/projets/${id}/liked`, { headers }) : Promise.resolve(null),
    ])
      .then(async ([r1, r2, r3]) => {
        if (!r1.ok) throw new Error();
        const p = await r1.json();
        const c = r2.ok ? await r2.json() : [];
        setProjet(p); setLikes(p.likes ?? 0); setComments(c);
        if (r3 && r3.ok) {
          const likedData = await r3.json();
          setLiked(likedData.liked === true);
        }
      })
      .catch(() => setProjet(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!isLogged) return;
    try {
      const res = await fetch(`${API_URL}/projets/${id}/like`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const updated = await res.json();
        setLiked(!liked);
        setLikes(updated.likes ?? (liked ? likes - 1 : likes + 1));
      }
    } catch {}
  };

  const handleComment = async e => {
    e.preventDefault();
    if (!newComment.titre || !newComment.contenu) return;
    setSending(true); setError('');
    try {
      const res = await fetch(`${API_URL}/projets/${id}/commentaires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setComments(prev => [...prev, saved]);
      setNewComment({ titre: '', contenu: '' });
    } catch {
      setComments(prev => [...prev, { id: Date.now(), ...newComment, dateHeure: new Date().toISOString(), auteur: { pseudo: myPseudo || 'moi' } }]);
      setNewComment({ titre: '', contenu: '' });
    } finally { setSending(false); }
  };

  const confirmDelete = async (message) => {
    const cId = deleteModal.id;
    setDeleteModal(null);
    try {
      if (isAdmin && message) {
        fetch(`${API_URL}/notifications/admin-message`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ commentaireId: cId, message }),
        }).catch(() => {});
      }
      await fetch(`${API_URL}/projets/${id}/commentaires/${cId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    } catch {}
    setComments(prev => prev.filter(c => c.id !== cId));
  };

  const confirmSignal = async (message) => {
    const { id: cId, pseudo: cPseudo } = signalModal;
    setSignalModal(null);
    try {
      await fetch(`${API_URL}/notifications/signalement`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ commentaireId: cId, projetId: id, auteurCommentaire: cPseudo, message }),
      });
    } catch {}
    setComments(prev => prev.map(c => c.id === cId ? { ...c, signale: true } : c));
  };

  if (loading) return <div className="detail-page"><Navbar /><div className="detail-loading"><span className="spinner" /><p>Chargement…</p></div></div>;
  if (!projet) return <div className="detail-page"><Navbar /><div className="detail-loading"><p>Projet introuvable.</p></div></div>;

  const mColor  = MATIERE_COLORS[projet.matiere] || MATIERE_COLORS.AUTRE;
  const thumb   = projet.thumbnailUrl ? `http://localhost:8080${projet.thumbnailUrl}` : projet.urlMedia || null;
  const fichiers = (projet.fichiersUrls || (projet.fichierUrl ? [projet.fichierUrl] : []))
    .filter(Boolean)
    .map(f => f.startsWith('http') ? f : `http://localhost:8080${f}`);
  const liens   = (projet.liensUrls || (projet.urlMedia ? [projet.urlMedia] : []))
    .filter(Boolean);
  const equipe  = projet.equipe || [];

  return (
    <div className="detail-page">
      <Navbar />

      <div className="detail-wrap">

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section className="detail-hero">
          {/* Image gauche */}
          <div className="detail-hero__media">
            {thumb ? (
              <img src={thumb} alt={projet.titre} />
            ) : (
              <div className="detail-hero__placeholder">
                <span>{projet.titre.charAt(0)}</span>
              </div>
            )}
            <span className="detail-hero__matiere" style={{ background: mColor.bg, color: mColor.text }}>
              {projet.matiere}
            </span>
          </div>

          {/* Infos droite */}
          <div className="detail-hero__info">
            <h1 className="detail-hero__title">{projet.titre}</h1>

            <Link to={profilLink(projet.auteur?.pseudo)} className="detail-hero__author">
              <div className="detail-hero__avatar">
                {(projet.auteur?.prenom || 'A').charAt(0)}
              </div>
              <div>
                <span className="detail-hero__pseudo">@{projet.auteur?.pseudo}</span>
                {projet.auteur?.classePromo && (
                  <span className="detail-hero__promo"> · {projet.auteur.classePromo}</span>
                )}
              </div>
            </Link>

            <div className="detail-hero__stats">
              <div className="detail-hero__stat">
                <button
                  className={`hero-like-btn ${liked ? 'hero-like-btn--liked' : ''} ${!isLogged ? 'hero-like-btn--disabled' : ''}`}
                  onClick={handleLike}
                  title={!isLogged ? 'Connectez-vous pour liker' : liked ? 'Retirer mon like' : 'Liker ce projet'}
                >
                  <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>{likes}</span>
                  <span className="detail-hero__stat-label">like{likes !== 1 ? 's' : ''}</span>
                </button>
              </div>
              <div className="detail-hero__stat detail-hero__stat--comments">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{comments.length}</span>
                <span className="detail-hero__stat-label">commentaire{comments.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="detail-hero__date">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Publié le {formatDate(projet.datePublication)}
            </div>

            {projet.competition && (
              <div className="detail-hero__competition-badge">
                🏆 En compétition
              </div>
            )}

            <nav className="detail-breadcrumb detail-breadcrumb--hero">
              <Link to="/projets">← Retour aux projets</Link>
            </nav>
          </div>
        </section>

        {/* ══ BANNIÈRE COMPÉTITION ══════════════════════════════ */}
        {projet.competition && (
          <div className="competition-banner">
            <div className="competition-banner__track">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="competition-banner__item">
                  🏆 Ce projet est en compétition
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="detail-content">

          {/* ══ DESCRIPTION ══════════════════════════════════════ */}
          <section className="detail-section">
            <h2 className="detail-section__title">Description</h2>
            <div className="detail-description">
              <p>{projet.description || 'Aucune description disponible.'}</p>
            </div>
          </section>

          {/* ══ PIÈCES JOINTES ═══════════════════════════════════ */}
          {fichiers.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section__title">
                Pièces jointes
                <span className="detail-section__count">{fichiers.length}</span>
              </h2>
              <div className="detail-fichiers">
                {fichiers.map((f, i) => (
                  <FichierViewer key={i} url={f} titre={projet.titre} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ══ LIENS ════════════════════════════════════════════ */}
          {liens.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section__title">Liens</h2>
              <div className="detail-liens">
                {liens.map((lien, i) => (
                  <a key={i} href={lien} target="_blank" rel="noopener noreferrer" className="detail-lien">
                    <div className="detail-lien__icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </div>
                    <span className="detail-lien__url">{lien.replace(/^https?:\/\//, '')}</span>
                    <svg className="detail-lien__arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M7 7h10v10"/>
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ══ ÉQUIPE ═══════════════════════════════════════════ */}
          {equipe.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section__title">
                Équipe
                <span className="detail-section__count">{equipe.length + 1}</span>
              </h2>
              <div className="detail-equipe">
                {/* Auteur */}
                <Link to={profilLink(projet.auteur?.pseudo)} className="equipe-card equipe-card--auteur" style={{textDecoration:'none'}}>
                  <div className="equipe-card__avatar">
                    {(projet.auteur?.prenom || 'A').charAt(0)}
                  </div>
                  <div className="equipe-card__info">
                    <span className="equipe-card__name">{projet.auteur?.prenom} {projet.auteur?.nom}</span>
                    <span className="equipe-card__pseudo">@{projet.auteur?.pseudo}</span>
                    {projet.auteur?.classePromo && <span className="equipe-card__promo">{projet.auteur.classePromo}</span>}
                  </div>
                  <span className="equipe-card__role">Auteur</span>
                </Link>

                {/* Membres */}
                {equipe.map(m => (
                  <Link key={m.id} to={profilLink(m.pseudo)} className="equipe-card" style={{textDecoration:'none'}}>
                    <div className="equipe-card__avatar">
                      {(m.prenom || 'M').charAt(0)}
                    </div>
                    <div className="equipe-card__info">
                      <span className="equipe-card__name">{m.prenom} {m.nom}</span>
                      <span className="equipe-card__pseudo">@{m.pseudo}</span>
                      {m.classePromo && <span className="equipe-card__promo">{m.classePromo}</span>}
                    </div>
                    <span className="equipe-card__role">Membre</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ══ COMMENTAIRES ═════════════════════════════════════ */}
          <section className="detail-section detail-comments">
            <h2 className="detail-section__title">
              Commentaires
              <span className="detail-section__count">{comments.length}</span>
            </h2>

            {comments.length === 0 ? (
              <p className="comments-empty">Aucun commentaire pour l'instant.</p>
            ) : (
              <ul className="comments-list">
                {comments.map(c => {
                  const canDelete = myPseudo === c.auteur?.pseudo || isAdmin;
                  const canSignal = isLogged && myPseudo !== c.auteur?.pseudo && !isAdmin;
                  return (
                    <li key={c.id} className={`comment-item ${c.signale ? 'comment-item--signale' : ''}`}>
                      <div className="comment-top">
                        <Link to={profilLink(c.auteur?.pseudo)} className="comment-pseudo">@{c.auteur?.pseudo}</Link>
                        <span className="comment-date">{formatDate(c.dateHeure)}</span>
                        <div className="comment-actions">
                          {canSignal && !c.signale && (
                            <button className="comment-action comment-action--signal" onClick={() => setSignalModal({ id: c.id, pseudo: c.auteur?.pseudo })}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                              Signaler
                            </button>
                          )}
                          {c.signale && <span className="comment-signale-badge">⚑ Signalé</span>}
                          {canDelete && (
                            <button className="comment-action comment-action--delete" onClick={() => setDeleteModal({ id: c.id, pseudo: c.auteur?.pseudo })}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                              Supprimer
                            </button>
                          )}
                        </div>
                      </div>
                      <strong className="comment-titre">{c.titre}</strong>
                      <p className="comment-contenu">{c.contenu}</p>
                    </li>
                  );
                })}
              </ul>
            )}

            {isLogged ? (
              <form className="comment-form" onSubmit={handleComment}>
                <h3 className="comment-form__title">Ajouter un commentaire</h3>
                {error && <div className="form-error">{error}</div>}
                <input type="text" className="form-input" placeholder="Titre du commentaire" value={newComment.titre} onChange={e => setNewComment({ ...newComment, titre: e.target.value })} required />
                <textarea className="form-input form-textarea" placeholder="Votre commentaire…" value={newComment.contenu} onChange={e => setNewComment({ ...newComment, contenu: e.target.value })} rows={4} required />
                <button type="submit" className="form-submit" disabled={sending}>
                  {sending ? <span className="btn-spinner" /> : 'Publier'}
                </button>
              </form>
            ) : (
              <div className="comment-cta">
                <Link to="/connexion" className="form-submit" style={{ display:'inline-flex', justifyContent:'center' }}>
                  Se connecter pour commenter
                </Link>
              </div>
            )}
          </section>

        </div>
      </div>

      {deleteModal && (
        <ConfirmModal
          title={isAdmin ? 'Supprimer ce commentaire' : 'Supprimer ce commentaire ?'}
          text={isAdmin ? `Suppression du commentaire de @${deleteModal.pseudo}. Vous pouvez laisser un message à l'auteur.` : 'Cette action est irréversible.'}
          confirmLabel="Supprimer" confirmClass="cm-btn--danger"
          requireMessage={isAdmin} messagePlaceholder="Message à l'auteur"
          onConfirm={confirmDelete} onCancel={() => setDeleteModal(null)}
        />
      )}
      {signalModal && (
        <ConfirmModal
          title="Signaler ce commentaire"
          text={`Signaler le commentaire de @${signalModal.pseudo} aux administrateurs.`}
          confirmLabel="Envoyer le signalement" confirmClass="cm-btn--signal"
          requireMessage={true} messagePlaceholder="Raison du signalement"
          onConfirm={confirmSignal} onCancel={() => setSignalModal(null)}
        />
      )}

      <Footer />
    </div>
  );
}