import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjetCard from '../components/ProjetCard';
import '../styles/ProfilPublic.css';

const API_URL = 'http://localhost:8080/api';

const MATIERE_COLORS = {
  WEB: '#4daaff', UI: '#b47dff', UX: '#4dffcf',
  TROIS_D: '#ffd04d', DESIGN: '#ff7db4', MULTIMEDIA: '#7dff8a', AUTRE: '#8a8799',
};

const ROLE_LABEL = { USER: 'Étudiant', PROF: 'Professeur', ADMIN: 'Administrateur' };

function getLienIcon(titre) {
  if (!titre) return '🔗';
  const t = titre.toLowerCase();
  if (t.includes('github'))    return '🐙';
  if (t.includes('linkedin'))  return '💼';
  if (t.includes('behance'))   return '🎨';
  if (t.includes('instagram')) return '📸';
  if (t.includes('dribbble'))  return '🏀';
  if (t.includes('youtube'))   return '▶️';
  if (t.includes('twitter') || t.includes('x.com')) return '🐦';
  if (t.includes('portfolio') || t.includes('site')) return '🌐';
  if (t.includes('figma'))     return '🖼️';
  if (t.includes('notion'))    return '📝';
  return '🔗';
}

export default function ProfilPublic() {
  const { pseudo } = useParams();

  const [user, setUser]     = useState(null);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Chercher l'utilisateur par pseudo via l'endpoint de recherche public
    fetch(`${API_URL}/users/profil/${pseudo}`)
      .then(async r => {
        if (!r.ok) { setNotFound(true); return; }
        const u = await r.json();
        setUser(u);
        // Charger ses projets validés
        return fetch(`${API_URL}/projets/auteur/${u.id}`);
      })
      .then(async r => {
        if (r && r.ok) setProjets(await r.json());
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [pseudo]);

  if (loading) return (
    <div className="pp-page"><Navbar /><div className="pp-loading"><span className="spinner" /><p>Chargement…</p></div></div>
  );

  if (notFound || !user) return (
    <div className="pp-page">
      <Navbar />
      <div className="pp-notfound">
        <span className="pp-notfound__icon">👤</span>
        <h1>Profil introuvable</h1>
        <p>L'utilisateur @{pseudo} n'existe pas.</p>
        <Link to="/projets" className="pp-btn">Voir les projets</Link>
      </div>
      <Footer />
    </div>
  );

  const initiales = `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`;
  const liens = user.liensProfilJson ? JSON.parse(user.liensProfilJson) : [];
  const totalLikes = projets.reduce((acc, p) => acc + (p.likes ?? 0), 0);
  const nbCompet = projets.filter(p => p.competition).length;

  // Grouper projets par matière pour le graphique rapide
  const parMatiere = projets.reduce((acc, p) => {
    acc[p.matiere] = (acc[p.matiere] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="pp-page">
      <Navbar />

      <div className="pp-wrap">

        {/* ── HERO ── */}
        <div className="pp-hero">
          <div className="pp-hero__left">
            <div className={`pp-hero__avatar${user.avatarType === 'image' ? ' pp-hero__avatar--img' : user.avatarType === 'emoji' ? ' pp-hero__avatar--emoji' : ''}`}>
      {user.avatarType === 'image' && user.avatarValue
        ? <img src={user.avatarValue.startsWith('http') ? user.avatarValue : `http://localhost:8080${user.avatarValue}`} alt="avatar" />
        : user.avatarType === 'emoji' && user.avatarValue
          ? user.avatarValue
          : initiales
      }
    </div>
            <div className="pp-hero__info">
              <div className="pp-hero__name">{user.prenom} {user.nom}</div>
              <div className="pp-hero__pseudo">@{user.pseudo}</div>
              <div className="pp-hero__badges">
                <span className="pp-badge pp-badge--role">{ROLE_LABEL[user.role] || user.role}</span>
                {user.classePromo && <span className="pp-badge">{user.classePromo}</span>}
                {user.matiereEnseignee && <span className="pp-badge pp-badge--matiere">📚 {user.matiereEnseignee}</span>}
              </div>

              {/* Icônes liens rapides dans le hero */}
              {liens.length > 0 && (
                <div className="pp-hero__liens">
                  {liens.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                       className="pp-hero__lien-icon-btn" title={l.titre}>
                      {getLienIcon(l.titre)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="pp-hero__stats">
            <div className="pp-stat">
              <span className="pp-stat__num">{projets.length}</span>
              <span className="pp-stat__label">Projets</span>
            </div>
            <div className="pp-stat">
              <span className="pp-stat__num">{totalLikes}</span>
              <span className="pp-stat__label">Likes</span>
            </div>
            {nbCompet > 0 && (
              <div className="pp-stat">
                <span className="pp-stat__num">{nbCompet}</span>
                <span className="pp-stat__label">Compétitions</span>
              </div>
            )}
          </div>
        </div>

        <div className="pp-layout">

          {/* ── SIDEBAR ── */}
          <aside className="pp-sidebar">

            {/* Liens — vitrine principale */}
            {liens.length > 0 ? (
              <div className="pp-card pp-card--liens">
                <h2 className="pp-card__title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Liens
                </h2>
                <div className="pp-liens">
                  {liens.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="pp-lien">
                      <span className="pp-lien__icon">{getLienIcon(l.titre)}</span>
                      <span className="pp-lien__label">{l.titre}</span>
                      <svg className="pp-lien__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pp-card pp-card--liens-empty">
                <h2 className="pp-card__title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Liens
                </h2>
                <p className="pp-liens-empty">Aucun lien renseigné pour l'instant.</p>
              </div>
            )}

            {/* Matières */}
            {Object.keys(parMatiere).length > 0 && (
              <div className="pp-card">
                <h2 className="pp-card__title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  Compétences
                </h2>
                <div className="pp-matieres">
                  {Object.entries(parMatiere).sort((a,b) => b[1]-a[1]).map(([m, count]) => (
                    <div key={m} className="pp-matiere-row">
                      <span className="pp-matiere-label" style={{ color: MATIERE_COLORS[m] || '#888' }}>{m}</span>
                      <div className="pp-matiere-bar">
                        <div className="pp-matiere-bar__fill"
                          style={{ width: `${(count / projets.length) * 100}%`, background: MATIERE_COLORS[m] || '#888' }} />
                      </div>
                      <span className="pp-matiere-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>

          {/* ── PROJETS ── */}
          <main className="pp-main">
            <h2 className="pp-section-title">
              Projets
              <span className="pp-section-count">{projets.length}</span>
            </h2>

            {projets.length === 0 ? (
              <div className="pp-empty">
                <span>📁</span>
                <p>Aucun projet publié pour l'instant.</p>
              </div>
            ) : (
              <div className="pp-projets-grid">
                {projets.map(p => (
                  <Link key={p.id} to={`/projets/${p.id}`} style={{ textDecoration: 'none' }}>
                    <ProjetCard projet={p} />
                  </Link>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}