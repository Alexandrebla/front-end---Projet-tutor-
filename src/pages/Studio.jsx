import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/EspaceIUT.css';

const MATERIEL = [
  {
    id: 1,
    nom: 'Canon EOS R5',
    categorie: 'Photo & Vidéo',
    description: "Appareil photo hybride plein format 45 MP, vidéo 8K RAW. Idéal pour les shootings produit, portraits et vidéos cinématiques.",
    specs: ['45 Mégapixels', 'Vidéo 8K RAW', 'Stabilisation IBIS 5 axes', 'Double slot CF/SD'],
    icon: '📷',
    dispo: true,
  },
  {
    id: 2,
    nom: 'Sony A7 III',
    categorie: 'Photo & Vidéo',
    description: "Hybride polyvalent 24 MP avec excellent rendu en basse lumière. Parfait pour les reportages et tournages en conditions difficiles.",
    specs: ['24 Mégapixels', 'ISO 51 200 natif', 'Autofocus Eye-AF', 'Vidéo 4K'],
    icon: '📷',
    dispo: true,
  },
  {
    id: 3,
    nom: 'DJI Ronin-S',
    categorie: 'Stabilisation',
    description: "Gimbal 3 axes motorisé pour reflex et hybrides. Assure des mouvements fluides en travelling et suivi de sujet.",
    specs: ['Charge max 3.6 kg', '3 axes motorisés', 'Autonomie 12h', 'Mode ActiveTrack'],
    icon: '🎬',
    dispo: true,
  },
  {
    id: 4,
    nom: 'Lumières Godox SL200II',
    categorie: 'Éclairage',
    description: "Panneau LED 200W à lumière continue, température de couleur réglable. Pour les interviews, packshots et ambiances maîtrisées.",
    specs: ['200W LED', '2800–6500K', 'CRI > 96', 'Télécommande DMX'],
    icon: '💡',
    dispo: false,
  },
  {
    id: 5,
    nom: 'Rode NTG3',
    categorie: 'Audio',
    description: "Micro canon directif professionnel. Capture un son directionnel précis, idéal pour les interviews et tournages en intérieur.",
    specs: ['Directivité supercardioid', '40Hz – 20kHz', 'Sortie XLR', "Résistant à l'humidité"],
    icon: '🎙️',
    dispo: true,
  },
  {
    id: 6,
    nom: 'Cyclorama blanc 4m',
    categorie: 'Studio',
    description: "Fond blanc courbé en vinyle sans couture, 4 mètres de large. Élimine les ombres de sol pour un rendu épuré en packshot et portrait.",
    specs: ['4m de large', 'Vinyle sans couture', 'Fond courbé', 'Nettoyage facile'],
    icon: '⬜',
    dispo: true,
  },
];

const PHOTOS = [
  { id: 1, label: 'Vue générale',  icon: '🎬' },
  { id: 2, label: 'Cyclorama',     icon: '⬜' },
  { id: 3, label: 'Régie',         icon: '🖥️' },
  { id: 4, label: 'Éclairage',     icon: '💡' },
];

export default function Studio() {
  const [selected, setSelected]   = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="espace-page">
      <Navbar />

      <section className="espace-hero espace-hero--studio">
        <div className="espace-hero__grid" aria-hidden="true" />
        <div className="espace-hero__accent" aria-hidden="true" />
        <div className="container espace-hero__inner">
          <span className="tag tag--accent">Studio · MMI</span>
          <h1 className="espace-hero__title">Le Studio</h1>
          <p className="espace-hero__sub">
            Un espace professionnel dédié à la photo, la vidéo<br />
            et la création de contenus — au cœur de l'IUT.
          </p>
          <div className="espace-hero__stats">
            <div className="espace-stat">
              <span className="espace-stat__num">80</span>
              <span className="espace-stat__unit">m²</span>
              <span className="espace-stat__label">Surface</span>
            </div>
            <div className="espace-stat__sep" />
            <div className="espace-stat">
              <span className="espace-stat__num">6</span>
              <span className="espace-stat__unit">équip.</span>
              <span className="espace-stat__label">Disponibles</span>
            </div>
            <div className="espace-stat__sep" />
            <div className="espace-stat">
              <span className="espace-stat__num">8K</span>
              <span className="espace-stat__unit">max</span>
              <span className="espace-stat__label">Résolution</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Présentation ─────────────────────────────────── */}
      <section className="espace-pres container">
        <div className="espace-pres__layout">
          <div className="espace-pres__text">
            <span className="tag">À propos</span>
            <h2 className="espace-section-title">Un studio<br /><em>professionnel</em></h2>
            <p>
              Le studio MMI est conçu pour accueillir tous les projets audiovisuels
              des étudiants. Entièrement équipé d'un cyclorama blanc, d'un système
              d'éclairage professionnel et d'une régie de contrôle, il permet de réaliser
              des tournages dans des conditions dignes d'une production professionnelle.
            </p>
            <p>
              Accessible sur réservation, il est utilisé pour les cours de production vidéo,
              les projets tutorés et les shootings photo en Design et Multimédia.
            </p>
            <div className="espace-pres__chips">
              {['Photographie', 'Vidéo', 'Podcast', 'Packshot', 'Interview'].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>

          <div className="espace-galerie">
            <div className="espace-galerie__main">
              <span className="espace-galerie__big-icon">{PHOTOS[activePhoto].icon}</span>
              <span className="espace-galerie__label">{PHOTOS[activePhoto].label}</span>
            </div>
            <div className="espace-galerie__strip">
              {PHOTOS.map((p, i) => (
                <button
                  key={p.id}
                  className={`espace-galerie__thumb ${activePhoto === i ? 'espace-galerie__thumb--active' : ''}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Matériel ──────────────────────────────────────── */}
      <section className="espace-materiel">
        <div className="container">
          <div className="espace-materiel__head">
            <div>
              <span className="tag">Inventaire</span>
              <h2 className="espace-section-title">Le matériel<br /><em>disponible</em></h2>
            </div>
            <p className="espace-materiel__hint">
              Cliquez sur un équipement pour voir ses caractéristiques.
            </p>
          </div>

          <div className="materiel-grid">
            {MATERIEL.map(item => (
              <button
                key={item.id}
                className={`materiel-card ${selected?.id === item.id ? 'materiel-card--active' : ''}`}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
              >
                <div className="materiel-card__top">
                  <span className="materiel-card__icon">{item.icon}</span>
                  <span className={`dispo-badge ${item.dispo ? 'dispo-badge--ok' : 'dispo-badge--busy'}`}>
                    {item.dispo ? 'Dispo' : 'Utilisé'}
                  </span>
                </div>
                <h3 className="materiel-card__nom">{item.nom}</h3>
                <span className="materiel-card__cat">{item.categorie}</span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="materiel-viewer">
              <div className="materiel-viewer__left">
                <div className="materiel-viewer__preview">
                  <span>{selected.icon}</span>
                </div>
                <span className={`dispo-badge ${selected.dispo ? 'dispo-badge--ok' : 'dispo-badge--busy'}`}>
                  {selected.dispo ? '✓ Disponible' : '⏳ En cours'}
                </span>
              </div>
              <div className="materiel-viewer__body">
                <div className="materiel-viewer__hd">
                  <div>
                    <span className="materiel-viewer__cat">{selected.categorie}</span>
                    <h3 className="materiel-viewer__nom">{selected.nom}</h3>
                  </div>
                  <button className="materiel-viewer__close" onClick={() => setSelected(null)}>✕</button>
                </div>
                <p className="materiel-viewer__desc">{selected.description}</p>
                <ul className="materiel-viewer__specs">
                  {selected.specs.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="espace-footer container">
        <span className="footer__logo">MMI</span>
        <span className="footer__copy">2025 · IUT Marne-la-Vallée · Projet Tutoré</span>
      </footer>
    </div>
  );
}