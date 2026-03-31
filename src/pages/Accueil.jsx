import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjetCard from '../components/ProjetCard';
import '../styles/Accueil.css';
import Footer from '../components/Footer';

const API_URL = 'http://localhost:8080/api';

const FAKE_PROJETS = [
  { id: 1, titre: 'Portfolio Web',            description: 'Mon portfolio en React et TailwindCSS, avec animations GSAP et mode sombre.',                    matiere: 'WEB',        likes: 12, commentCount: 3, auteur: { pseudo: 'lucas_d' },  urlMedia: null, datePublication: '2025-03-01' },
  { id: 2, titre: 'Redesign App Fitness',      description: 'Maquette UI/UX complète d\'une app fitness — user flows, wireframes et prototype Figma.',         matiere: 'UI',         likes: 8,  commentCount: 1, auteur: { pseudo: 'emma_r' },   urlMedia: null, datePublication: '2025-02-18' },
  { id: 3, titre: 'Brand Identity MMI',        description: 'Identité visuelle complète pour une startup locale, logo, charte et supports print.',             matiere: 'DESIGN',     likes: 21, commentCount: 5, auteur: { pseudo: 'thomas_v' }, urlMedia: null, datePublication: '2025-02-10' },
  { id: 4, titre: 'Expérience 3D WebGL',       description: 'Scene Three.js interactive avec shaders custom et post-processing bloom.',                        matiere: 'TROIS_D',    likes: 15, commentCount: 2, auteur: { pseudo: 'sarah_k' },  urlMedia: null, datePublication: '2025-01-28' },
  { id: 5, titre: 'Podcast Platform UX',       description: 'Recherche utilisateur approfondie et refonte de l\'experience d\'ecoute sur mobile.',              matiere: 'UX',         likes: 6,  commentCount: 0, auteur: { pseudo: 'alex_m' },   urlMedia: null, datePublication: '2025-01-15' },
  { id: 6, titre: 'Court-metrage Stop Motion', description: 'Court-metrage en stop motion de 3 minutes avec OST originale.',                                   matiere: 'MULTIMEDIA', likes: 18, commentCount: 4, auteur: { pseudo: 'chloe_b' },  urlMedia: null, datePublication: '2024-12-20' },
  { id: 7, titre: 'Dashboard Analytics',       description: 'Interface data-driven avec graphiques interactifs D3.js et filtres dynamiques.',                   matiere: 'WEB',        likes: 9,  commentCount: 2, auteur: { pseudo: 'lucas_d' },  urlMedia: null, datePublication: '2024-12-05' },
  { id: 8, titre: 'Typographie Experimentale', description: 'Exploration de la typographie cinetique pour une campagne d\'affichage urbain.',                   matiere: 'DESIGN',     likes: 13, commentCount: 1, auteur: { pseudo: 'nina_p' },   urlMedia: null, datePublication: '2024-11-18' },
];

const MATIERES_PREVIEW = [
  { code: 'WEB',        label: 'Developpement Web',     icon: '</>' },
  { code: 'UI',         label: "Design d'Interface",    icon: '◻'  },
  { code: 'UX',         label: 'Experience Utilisateur',icon: '⬡'  },
  { code: 'TROIS_D',    label: 'Modelisation 3D',       icon: '◈'  },
  { code: 'DESIGN',     label: 'Design Graphique',      icon: '✦'  },
  { code: 'MULTIMEDIA', label: 'Multimedia et Video',   icon: '▶'  },
];

export default function Accueil() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/projets`)
      .then(r => r.json())
      .then(data => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.datePublication) - new Date(a.datePublication)
        );
        setProjets(sorted);
        setLoading(false);
      })
      .catch(() => {
        setProjets(FAKE_PROJETS);
        setLoading(false);
      });
  }, []);

  const projetsAffiches = projets.slice(0, 8);

  return (
    <div className="accueil">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg-grid" aria-hidden="true" />
        <div className="hero__glow hero__glow--1" aria-hidden="true" />
        <div className="hero__glow hero__glow--2" aria-hidden="true" />

        <div className="container hero__inner">
          <div className="hero__eyebrow">
            <span className="tag tag--accent">MMI · IUT Marne-la-Vallee</span>
          </div>
          <h1 className="hero__title">
            Les projets<br />
            <em>des etudiants</em>
          </h1>
          <p className="hero__subtitle">
            Decouvrez les creations Web, Design, UX, 3D et Multimedia
            des etudiants du departement MMI.
          </p>
          <div className="hero__ctas">
            <Link to="/projets" className="hero__cta-primary">
              Explorer tous les projets
            </Link>
            <a href="#formation" className="hero__cta-secondary">
              Decouvrir la formation
            </a>
          </div>
        </div>
      </section>

      {/* ── Projets recents ──────────────────────────────── */}
      <section className="section-projets container">
        <div className="section-head">
          <div className="section-head__left">
            <span className="tag">Dernieres publications</span>
            <h2 className="section-title">Projets recents</h2>
          </div>
          <Link to="/projets" className="voir-tous">
            Voir tous les projets &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="projets__state">
            <span className="projets__spinner" />
            <p>Chargement des projets...</p>
          </div>
        ) : projetsAffiches.length === 0 ? (
          <div className="projets__state">
            <p>Aucun projet publie pour l'instant.</p>
          </div>
        ) : (
          <>
            <div className="projets__grid">
              {projetsAffiches.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projets/${p.id}`)}
                  className="projets__grid-item"
                >
                  <ProjetCard projet={p} />
                </div>
              ))}
            </div>

            {projets.length > 8 && (
              <div className="projets__more">
                <Link to="/projets" className="btn-voir-tous">
                  Voir les {projets.length} projets
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Section Formation ─────────────────────────────── */}
      <section className="section-formation" id="formation">
        <div className="container formation-inner">

          <div className="formation-text">
            <span className="tag">BUT · 3 ans</span>
            <h2 className="section-title formation-title">
              La formation<br /><em>MMI</em>
            </h2>
            <p className="formation-text__desc">
              Le departement MMI forme des creatifs et techniciens du numerique en
              <strong> 3 ans</strong>. Design, code, video, 3D : une formation
              polyvalente tournee vers les metiers de demain.
            </p>
            <ul className="formation-points">
              <li>
                <span className="point-icon">✦</span>
                6 specialites : Web, UI, UX, 3D, Design, Multimedia
              </li>
              <li>
                <span className="point-icon">✦</span>
                Projets reels avec des partenaires professionnels
              </li>
              <li>
                <span className="point-icon">✦</span>
                85 % d'insertion pro a 6 mois apres le diplome
              </li>
            </ul>
            <Link to="/formation" className="hero__cta-primary">
              Decouvrir la formation &rarr;
            </Link>
          </div>

          <div className="formation-grid">
            {MATIERES_PREVIEW.map(m => (
              <Link to="/formation" key={m.code} className="formation-cell">
                <span className="formation-cell__icon">{m.icon}</span>
                <span className="formation-cell__label">{m.label}</span>
                <span className="formation-cell__code">{m.code}</span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}