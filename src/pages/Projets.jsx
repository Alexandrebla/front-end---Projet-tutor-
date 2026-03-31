import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjetCard from '../components/ProjetCard';
import '../styles/Projets.css';

const API_URL = 'http://localhost:8080/api';
const MATIERES = ['Tous', 'WEB', 'UI', 'UX', 'TROIS_D', 'DESIGN', 'MULTIMEDIA', 'AUTRE'];
const PROMOS   = ['Toutes', 'MMI1', 'MMI2', 'MMI3'];
const ANNEES   = ['Toutes', '2025', '2024', '2023'];

const FAKE_PROJETS = [
  { id: 1, titre: 'Portfolio Web', description: 'Mon portfolio en React et TailwindCSS, avec animations GSAP et mode sombre.', matiere: 'WEB',       likes: 12, commentCount: 3, auteur: { id: 3, pseudo: 'lucas_d',  classePromo: 'MMI2' }, urlMedia: null, datePublication: '2025-01-10' },
  { id: 2, titre: 'Redesign App Fitness', description: 'Maquette UI/UX complète dune app fitness — user flows, wireframes & prototype Figma.', matiere: 'UI',  likes: 8,  commentCount: 1, auteur: { id: 4, pseudo: 'emma_r',   classePromo: 'MMI1' }, urlMedia: null, datePublication: '2024-10-22' },
  { id: 3, titre: 'Brand Identity MMI', description: 'Identité visuelle complète pour une startup locale, logo, charte et supports print.', matiere: 'DESIGN',   likes: 21, commentCount: 5, auteur: { id: 5, pseudo: 'thomas_v', classePromo: 'MMI3' }, urlMedia: null, datePublication: '2024-09-05' },
  { id: 4, titre: 'Expérience 3D WebGL', description: 'Scène Three.js interactive avec shaders custom et post-processing bloom.', matiere: 'TROIS_D',            likes: 15, commentCount: 2, auteur: { id: 6, pseudo: 'sarah_k',  classePromo: 'MMI2' }, urlMedia: null, datePublication: '2025-01-18' },
  { id: 5, titre: 'Podcast Platform UX', description: 'Recherche utilisateur approfondie et refonte de lexpérience découte sur mobile.', matiere: 'UX',        likes: 6,  commentCount: 0, auteur: { id: 7, pseudo: 'alex_m',   classePromo: 'MMI1' }, urlMedia: null, datePublication: '2025-02-03' },
  { id: 6, titre: 'Court-métrage Stop Motion', description: 'Court-métrage en stop motion de 3 minutes avec OST originale.', matiere: 'MULTIMEDIA',              likes: 18, commentCount: 4, auteur: { id: 8, pseudo: 'chloe_b',  classePromo: 'MMI3' }, urlMedia: null, datePublication: '2024-12-14' },
  { id: 7, titre: 'Dashboard Analytics', description: 'Interface data-driven avec graphiques interactifs D3.js.', matiere: 'WEB',                                likes: 9,  commentCount: 2, auteur: { id: 3, pseudo: 'lucas_d',  classePromo: 'MMI2' }, urlMedia: null, datePublication: '2025-03-01' },
  { id: 8, titre: 'Typographie Expérimentale', description: 'Exploration de la typographie cinétique pour une campagne daffichage urbain.', matiere: 'DESIGN',   likes: 13, commentCount: 1, auteur: { id: 9, pseudo: 'nina_p',   classePromo: 'MMI1' }, urlMedia: null, datePublication: '2023-11-28' },
];

const SORTS = [
  { label: 'Plus récents', value: 'recent' },
  { label: 'Plus likés',   value: 'likes'  },
  { label: 'Alphabétique', value: 'alpha'  },
];

export default function Projets() {
  const [projets, setProjets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtre, setFiltre]     = useState('Tous');
  const [promo, setPromo]       = useState('Toutes');
  const [annee, setAnnee]       = useState('Toutes');
  const [search, setSearch]     = useState('');
  const [sort, setSort]         = useState('recent');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/projets`)
      .then(r => r.json())
      .then(data => { setProjets(data); setLoading(false); })
      .catch(() => { setProjets(FAKE_PROJETS); setLoading(false); });
  }, []);

  const activeFiltersCount = [
    promo !== 'Toutes',
    annee !== 'Toutes',
  ].filter(Boolean).length;

  const filtered = projets
    .filter(p => filtre === 'Tous' || p.matiere === filtre)
    .filter(p => promo === 'Toutes' || p.auteur?.classePromo === promo)
    .filter(p => {
      if (annee === 'Toutes') return true;
      const year = new Date(p.datePublication).getFullYear().toString();
      return year === annee;
    })
    .filter(p =>
      p.titre.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.auteur?.pseudo || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'likes') return (b.likes ?? 0) - (a.likes ?? 0);
      if (sort === 'alpha') return a.titre.localeCompare(b.titre);
      return new Date(b.datePublication) - new Date(a.datePublication);
    });

  const isLogged = !!localStorage.getItem('token');

  const resetFilters = () => { setFiltre('Tous'); setPromo('Toutes'); setAnnee('Toutes'); setSearch(''); };

  return (
    <div className="projets-page">
      <Navbar />

      {/* ── Banner ─────────────────────────────────────────── */}
      <section className="projets-banner">
        <div className="projets-banner__bg" aria-hidden="true" />
        <div className="container projets-banner__inner">
          <span className="tag">Tous les projets</span>
          <h1 className="projets-banner__title">Galerie<br /><em>des créations</em></h1>
          <p className="projets-banner__sub">
            {projets.length} projet{projets.length !== 1 ? 's' : ''} publiés par les étudiants MMI
          </p>
        </div>
      </section>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="projets-toolbar container">
        {/* Search */}
        <div className="projets-toolbar__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Titre, description, auteur…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Sort */}
        <div className="projets-toolbar__sort">
          {SORTS.map(s => (
            <button
              key={s.value}
              className={`sort-btn ${sort === s.value ? 'sort-btn--active' : ''}`}
              onClick={() => setSort(s.value)}
            >{s.label}</button>
          ))}
        </div>

        {/* Advanced filters toggle */}
        <button
          className={`btn-advanced ${showAdvanced ? 'btn-advanced--open' : ''}`}
          onClick={() => setShowAdvanced(v => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6"  x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filtres avancés
          {activeFiltersCount > 0 && <span className="btn-advanced__badge">{activeFiltersCount}</span>}
        </button>

        {/* Add projet CTA */}
        {isLogged && (
          <button className="projets-toolbar__add" onClick={() => navigate('/profil')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Ajouter
          </button>
        )}
      </div>

      {/* ── Advanced filters panel ─────────────────────────── */}
      {showAdvanced && (
        <div className="advanced-panel container">
          <div className="advanced-panel__inner">
            {/* Promo filter */}
            <div className="advanced-group">
              <span className="advanced-group__label">Promotion</span>
              <div className="advanced-group__btns">
                {PROMOS.map(p => (
                  <button
                    key={p}
                    className={`filter-chip ${promo === p ? 'filter-chip--active' : ''}`}
                    onClick={() => setPromo(p)}
                  >{p}</button>
                ))}
              </div>
            </div>

            {/* Year filter */}
            <div className="advanced-group">
              <span className="advanced-group__label">Année</span>
              <div className="advanced-group__btns">
                {ANNEES.map(a => (
                  <button
                    key={a}
                    className={`filter-chip ${annee === a ? 'filter-chip--active' : ''}`}
                    onClick={() => setAnnee(a)}
                  >{a}</button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {(activeFiltersCount > 0 || filtre !== 'Tous' || search) && (
              <button className="advanced-reset" onClick={resetFilters}>
                Réinitialiser tous les filtres
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Matière filters ────────────────────────────────── */}
      <div className="projets-filtres container">
        <div className="projets-filtres__list">
          {MATIERES.map(m => (
            <button
              key={m}
              className={`filtres__btn ${filtre === m ? 'filtres__btn--active' : ''}`}
              onClick={() => setFiltre(m)}
            >{m}</button>
          ))}
        </div>
        <span className="filtres__count">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Grid ───────────────────────────────────────────── */}
      <main className="projets-grid-wrap container">
        {loading ? (
          <div className="state-center">
            <span className="spinner" />
            <p>Chargement…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-center">
            <p>Aucun projet ne correspond à ces filtres.</p>
            <button className="btn-reset-sm" onClick={resetFilters}>Effacer les filtres</button>
          </div>
        ) : (
          <div className="projets-grid">
            {filtered.map(p => (
              <div key={p.id} onClick={() => navigate(`/projets/${p.id}`)} style={{ cursor: 'pointer' }}>
                <ProjetCard projet={p} />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="footer container">
        <span className="footer__logo">MMI</span>
        <span className="footer__copy">© 2025 · IUT Marne-la-Vallée · Projet Tutoré</span>
      </footer>
    </div>
  );
}