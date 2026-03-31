import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AdminValidation.css';

const API_URL = 'http://localhost:8080/api';

const FAKE_PROJETS = [
  { id: 1,  titre: 'Portfolio Web React',       statut: 'EN_ATTENTE', auteur: { pseudo: 'lucas_d',   nom: 'Lucas Dupont'    }, matiere: 'WEB',        datePublication: '2025-03-01T10:23:00', dateModification: '2025-03-01T10:23:00', description: 'Mon portfolio en React et TailwindCSS avec animations GSAP.' },
  { id: 2,  titre: 'Redesign App Fitness',       statut: 'EN_ATTENTE', auteur: { pseudo: 'emma_r',   nom: 'Emma Richard'    }, matiere: 'UI',         datePublication: '2025-02-28T14:05:00', dateModification: '2025-03-02T09:10:00', description: 'Maquette UI/UX complète d\'une app fitness avec wireframes Figma.' },
  { id: 3,  titre: 'Brand Identity Startup',     statut: 'VALIDE',     auteur: { pseudo: 'thomas_v', nom: 'Thomas Vidal'    }, matiere: 'DESIGN',     datePublication: '2025-02-10T08:00:00', dateModification: '2025-02-10T08:00:00', description: 'Identité visuelle complète pour une startup locale.' },
  { id: 4,  titre: 'Expérience 3D WebGL',        statut: 'EN_ATTENTE', auteur: { pseudo: 'sarah_k',  nom: 'Sarah Kaci'      }, matiere: 'TROIS_D',    datePublication: '2025-02-25T16:40:00', dateModification: '2025-02-25T16:40:00', description: 'Scène Three.js interactive avec shaders custom et bloom.' },
  { id: 5,  titre: 'Podcast Platform UX',        statut: 'REJETE',     auteur: { pseudo: 'alex_m',   nom: 'Alex Martin'     }, matiere: 'UX',         datePublication: '2025-01-15T11:20:00', dateModification: '2025-01-20T14:30:00', description: 'Refonte de l\'expérience d\'écoute podcast sur mobile.' },
  { id: 6,  titre: 'Stop Motion Court-métrage',  statut: 'EN_ATTENTE', auteur: { pseudo: 'chloe_b',  nom: 'Chloé Bernard'   }, matiere: 'MULTIMEDIA', datePublication: '2025-03-03T09:15:00', dateModification: '2025-03-03T09:15:00', description: 'Court-métrage stop motion de 3 minutes avec OST originale.' },
  { id: 7,  titre: 'Dashboard Analytics D3',     statut: 'VALIDE',     auteur: { pseudo: 'lucas_d',  nom: 'Lucas Dupont'    }, matiere: 'WEB',        datePublication: '2024-12-05T10:00:00', dateModification: '2024-12-05T10:00:00', description: 'Interface data-driven avec graphiques D3.js interactifs.' },
  { id: 8,  titre: 'Typographie Cinétique',       statut: 'EN_ATTENTE', auteur: { pseudo: 'nina_p',   nom: 'Nina Perron'     }, matiere: 'DESIGN',     datePublication: '2025-03-04T13:45:00', dateModification: '2025-03-04T13:45:00', description: 'Exploration typographique pour une campagne d\'affichage urbain.' },
];

const BADGE_STATUT = {
  EN_ATTENTE: { label: 'En attente', cls: 'badge--waiting' },
  VALIDE:     { label: 'Validé',     cls: 'badge--ok'      },
  REJETE:     { label: 'Refusé',     cls: 'badge--ko'      },
};

const MATIERE_COLORS = {
  WEB: '#1a8fff', UI: '#a855f7', UX: '#f59e0b',
  TROIS_D: '#10b981', DESIGN: '#e8344a', MULTIMEDIA: '#ec4899', AUTRE: '#6b7280',
};

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function fmtDatetime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ── Modal refus ─────────────────────────────────────────── */
function ModalRefus({ projet, onConfirm, onCancel, loading }) {
  const [commentaire, setCommentaire] = useState('');
  if (!projet) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <span className="modal__tag">Refus de projet</span>
            <h3 className="modal__title">"{projet.titre}"</h3>
            <p className="modal__by">par @{projet.auteur?.pseudo ?? '—'}</p>
          </div>
          <button className="modal__close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal__body">
          <label className="modal__label">
            Commentaire à l'étudiant
            <span className="modal__label-hint">Obligatoire — sera visible par l'élève</span>
          </label>
          <textarea
            className="modal__textarea"
            placeholder="Expliquez les raisons du refus et les améliorations attendues…"
            value={commentaire}
            onChange={e => setCommentaire(e.target.value)}
            rows={5}
            autoFocus
          />
          <p className="modal__chars">
            {commentaire.length} caractère{commentaire.length !== 1 ? 's' : ''}
            {commentaire.length < 20 && commentaire.length > 0 && (
              <span className="modal__chars--warn"> — au moins 20 caractères requis</span>
            )}
          </p>
        </div>

        <div className="modal__footer">
          <button className="modal__btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button
            className="modal__btn-refuse"
            onClick={() => onConfirm(commentaire)}
            disabled={loading || commentaire.trim().length < 20}
          >
            {loading ? <span className="btn-spin" /> : '✕  Confirmer le refus'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal détail ────────────────────────────────────────── */
function ModalDetail({ projet, onClose }) {
  if (!projet) return null;

  const auteurNom    = projet.auteur?.nom    ?? projet.auteur?.prenom ? `${projet.auteur.prenom} ${projet.auteur.nom}` : '—';
  const auteurPseudo = projet.auteur?.pseudo ?? '—';
  const matiereColor = MATIERE_COLORS[projet.matiere] ?? '#888888';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--detail" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <span
              className="modal__tag"
              style={{ background: matiereColor + '18', color: matiereColor, borderColor: matiereColor + '40' }}
            >
              {projet.matiere ?? '—'}
            </span>
            <h3 className="modal__title">{projet.titre}</h3>
            <p className="modal__by">par <strong>{auteurNom}</strong> — @{auteurPseudo}</p>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">
          <p className="modal__desc">{projet.description}</p>
          <div className="modal__meta-grid">
            <div className="modal__meta-item">
              <span className="modal__meta-label">Date de soumission</span>
              <span className="modal__meta-value">{fmtDatetime(projet.datePublication)}</span>
            </div>
            <div className="modal__meta-item">
              <span className="modal__meta-label">Dernière modification</span>
              <span className="modal__meta-value">{fmtDatetime(projet.dateModification)}</span>
            </div>
            <div className="modal__meta-item">
              <span className="modal__meta-label">Statut actuel</span>
              <span className={`statut-badge ${BADGE_STATUT[projet.statut].cls}`}>
                {BADGE_STATUT[projet.statut].label}
              </span>
            </div>
            <div className="modal__meta-item">
              <span className="modal__meta-label">Matière</span>
              <span className="modal__meta-value">{projet.matiere}</span>
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <button className="modal__btn-cancel" onClick={onClose}>Fermer</button>
          <Link to={`/projets/${projet.id}`} className="modal__btn-view" onClick={onClose}>
            Voir la page complète →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Page principale ─────────────────────────────────────── */
export default function AdminValidation() {
  const navigate = useNavigate();

  const [projets, setProjets]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [onglet, setOnglet]           = useState('EN_ATTENTE');
  const [actionLoading, setActionLoading] = useState(null);
  const [modalRefus, setModalRefus]   = useState(null);  // projet à refuser
  const [modalDetail, setModalDetail] = useState(null);  // projet à consulter
  const [toast, setToast]             = useState(null);  // { msg, type }

  // Vérif admin
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') { navigate('/'); return; }

    const token = localStorage.getItem('token');
    fetch(`${API_URL}/admin/projets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setProjets(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setProjets(FAKE_PROJETS); setLoading(false); });
  }, [navigate]);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const changerStatut = async (id, statut, commentaire = '') => {
    setActionLoading(id + statut);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/projets/${id}/statut?statut=${statut}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: commentaire ? JSON.stringify({ commentaire }) : undefined,
      });
      if (res.ok) {
        setProjets(prev => prev.map(p => p.id === id ? { ...p, statut } : p));
        showToast(
          statut === 'VALIDE' ? '✓  Projet validé et publié' : '✕  Projet refusé — élève notifié',
          statut === 'VALIDE' ? 'ok' : 'ko'
        );
      } else {
        // Fallback local si backend absent
        setProjets(prev => prev.map(p => p.id === id ? { ...p, statut } : p));
        showToast(statut === 'VALIDE' ? '✓  Projet validé (mode démo)' : '✕  Projet refusé (mode démo)', statut === 'VALIDE' ? 'ok' : 'ko');
      }
    } catch {
      setProjets(prev => prev.map(p => p.id === id ? { ...p, statut } : p));
      showToast(statut === 'VALIDE' ? '✓  Projet validé (mode démo)' : '✕  Projet refusé (mode démo)', statut === 'VALIDE' ? 'ok' : 'ko');
    } finally {
      setActionLoading(null);
      setModalRefus(null);
    }
  };

  const ONGLETS = [
    { key: 'TOUS',       label: 'Tous',       count: projets.length },
    { key: 'EN_ATTENTE', label: 'En attente', count: projets.filter(p => p.statut === 'EN_ATTENTE').length },
    { key: 'VALIDE',     label: 'Validés',    count: projets.filter(p => p.statut === 'VALIDE').length },
    { key: 'REJETE',     label: 'Refusés',    count: projets.filter(p => p.statut === 'REJETE').length },
  ];

  const filtered = onglet === 'TOUS'
    ? projets
    : projets.filter(p => p.statut === onglet);

  return (
    <div className="admin-page">
      <Navbar />

      {/* ── En-tête ────────────────────────────────────────── */}
      <section className="admin-hero">
        <div className="admin-hero__grid" aria-hidden="true" />
        <div className="container admin-hero__inner">
          <div className="admin-hero__left">
            <span className="tag tag--accent">Administration</span>
            <h1 className="admin-hero__title">Validation<br /><em>des projets</em></h1>
            <p className="admin-hero__sub">
              Examinez, validez ou refusez les soumissions des étudiants.
            </p>
          </div>
          <div className="admin-stats">
            <div className="admin-stat admin-stat--waiting">
              <span className="admin-stat__num">
                {projets.filter(p => p.statut === 'EN_ATTENTE').length}
              </span>
              <span className="admin-stat__label">En attente</span>
            </div>
            <div className="admin-stat admin-stat--ok">
              <span className="admin-stat__num">
                {projets.filter(p => p.statut === 'VALIDE').length}
              </span>
              <span className="admin-stat__label">Validés</span>
            </div>
            <div className="admin-stat admin-stat--ko">
              <span className="admin-stat__num">
                {projets.filter(p => p.statut === 'REJETE').length}
              </span>
              <span className="admin-stat__label">Refusés</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenu ───────────────────────────────────────── */}
      <main className="admin-main container">

        {/* Onglets */}
        <div className="admin-tabs">
          {ONGLETS.map(o => (
            <button
              key={o.key}
              className={`admin-tab ${onglet === o.key ? 'admin-tab--active' : ''}`}
              onClick={() => setOnglet(o.key)}
            >
              {o.label}
              <span className={`admin-tab__count ${onglet === o.key ? 'admin-tab__count--active' : ''}`}>
                {o.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tableau */}
        {loading ? (
          <div className="admin-state">
            <span className="admin-spinner" />
            <p>Chargement des projets…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-state">
            <span className="admin-state__icon">📭</span>
            <p>Aucun projet dans cette catégorie.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Élève</th>
                  <th>Matière</th>
                  <th>Date de soumission</th>
                  <th>Date de publication</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className={`admin-row admin-row--${p.statut.toLowerCase()}`}>

                    {/* Titre */}
                    <td className="admin-cell admin-cell--titre">
                      <span className="admin-titre">{p.titre}</span>
                    </td>

                    {/* Élève */}
                    <td className="admin-cell">
                      <div className="admin-eleve">
                        <span className="admin-eleve__nom">{p.auteur?.nom || '—'}</span>
                        <span className="admin-eleve__pseudo">@{p.auteur?.pseudo}</span>
                      </div>
                    </td>

                    {/* Matière */}
                    <td className="admin-cell">
                      <span
                        className="matiere-tag"
                        style={{
                          background: (MATIERE_COLORS[p.matiere] || '#888') + '15',
                          color: MATIERE_COLORS[p.matiere] || '#888',
                          borderColor: (MATIERE_COLORS[p.matiere] || '#888') + '35',
                        }}
                      >
                        {p.matiere}
                      </span>
                    </td>

                    {/* Date soumission */}
                    <td className="admin-cell admin-cell--date">
                      {fmtDate(p.datePublication)}
                    </td>

                    {/* Date publication */}
                    <td className="admin-cell admin-cell--date">
                      {p.statut === 'VALIDE' ? fmtDate(p.dateModification) : '—'}
                    </td>

                    {/* Statut */}
                    <td className="admin-cell">
                      <span className={`statut-badge ${BADGE_STATUT[p.statut].cls}`}>
                        {BADGE_STATUT[p.statut].label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="admin-cell admin-cell--actions">
                      {/* Consulter */}
                      <button
                        className="action-btn action-btn--view"
                        onClick={() => setModalDetail(p)}
                        title="Consulter le projet"
                      >
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/>
                          <circle cx="10" cy="10" r="2.5"/>
                        </svg>
                        Consulter
                      </button>

                      {/* Valider — seulement si pas déjà validé */}
                      {p.statut !== 'VALIDE' && (
                        <button
                          className="action-btn action-btn--validate"
                          onClick={() => changerStatut(p.id, 'VALIDE')}
                          disabled={actionLoading === p.id + 'VALIDE'}
                          title="Valider et publier"
                        >
                          {actionLoading === p.id + 'VALIDE' ? (
                            <span className="btn-spin" />
                          ) : (
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M4 10l4.5 4.5L16 6"/>
                            </svg>
                          )}
                          Valider
                        </button>
                      )}

                      {/* Refuser — seulement si pas déjà refusé */}
                      {p.statut !== 'REJETE' && (
                        <button
                          className="action-btn action-btn--refuse"
                          onClick={() => setModalRefus(p)}
                          title="Refuser le projet"
                        >
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M5 5l10 10M15 5L5 15"/>
                          </svg>
                          Refuser
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />

      {/* ── Modal refus ─────────────────────────────────────── */}
      {modalRefus && (
        <ModalRefus
          projet={modalRefus}
          loading={actionLoading === modalRefus.id + 'REJETE'}
          onConfirm={commentaire => changerStatut(modalRefus.id, 'REJETE', commentaire)}
          onCancel={() => setModalRefus(null)}
        />
      )}

      {/* ── Modal détail ────────────────────────────────────── */}
      {modalDetail && (
        <ModalDetail
          projet={modalDetail}
          onClose={() => setModalDetail(null)}
        />
      )}

      {/* ── Toast notification ──────────────────────────────── */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}