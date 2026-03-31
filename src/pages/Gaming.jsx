import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/EspaceIUT.css';

const MATERIEL = [
  {
    id: 1,
    nom: 'PC Gaming MSI Titan',
    categorie: 'Stations de jeu',
    description: "Station haute performance équipée d'un Intel Core i9, RTX 4090 et 64 Go de RAM. Tourne tous les jeux en Ultra 4K avec ray tracing activé.",
    specs: ['Intel Core i9-13900K', 'RTX 4090 24 Go', '64 Go DDR5', 'SSD NVMe 2 To'],
    icon: '🖥️',
    dispo: true,
  },
  {
    id: 2,
    nom: 'Écran Samsung Odyssey G9',
    categorie: 'Affichage',
    description: "Écran ultra-large incurvé 49 pouces DQHD 240Hz. Offre un champ de vision immersif idéal pour les simulations de racing et les FPS.",
    specs: ['49 pouces DQHD', '240Hz', '1ms GtG', 'HDR2000'],
    icon: '🖥️',
    dispo: true,
  },
  {
    id: 3,
    nom: 'Console PS5',
    categorie: 'Consoles',
    description: "PlayStation 5 avec DualSense et bibliothèque de jeux. Utilisée pour les études UX gaming, le test de gameplay et les projets interactifs.",
    specs: ['SSD 825 Go', 'CPU AMD Zen 2 8 cœurs', 'GPU 10.3 TFLOPS', 'DualSense haptique'],
    icon: '🎮',
    dispo: false,
  },
  {
    id: 4,
    nom: 'Meta Quest 3',
    categorie: 'Réalité virtuelle',
    description: "Casque VR/MR autonome pour explorer les espaces de réalité mixte. Indispensable pour les projets d'expériences interactives et d'UX immersif.",
    specs: ['Résolution 2064×2208 par œil', 'Processeur Snapdragon XR2 Gen 2', 'Passthrough couleur', 'Autonomie 2h30'],
    icon: '🥽',
    dispo: true,
  },
  {
    id: 5,
    nom: 'Capture Card Elgato 4K60',
    categorie: 'Streaming',
    description: "Carte de capture 4K60 FPS pour enregistrer et streamer depuis consoles ou PC secondaire. Utilisée pour les projets de contenu vidéo gaming.",
    specs: ['4K60 FPS HDR', 'Latence ultra-faible', 'Compatible OBS', 'Entrée/sortie HDMI 2.0'],
    icon: '📹',
    dispo: true,
  },
  {
    id: 6,
    nom: 'Setup Stream Complet',
    categorie: 'Streaming',
    description: "Station de streaming complète avec micro Blue Yeti, ring light, webcam 4K et interface audio. Pour produire des contenus gaming professionnels.",
    specs: ['Micro Blue Yeti', 'Webcam 4K Logitech Brio', 'Interface Focusrite', 'Ring light 18 pouces'],
    icon: '🎙️',
    dispo: true,
  },
];

const PHOTOS = [
  { id: 1, label: 'Vue générale',   icon: '🎮' },
  { id: 2, label: 'Stations PC',    icon: '🖥️' },
  { id: 3, label: 'Zone VR',        icon: '🥽' },
  { id: 4, label: 'Coin streaming', icon: '📹' },
];

export default function Gaming() {
  const [selected, setSelected]       = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="espace-page">
      <Navbar />

      <section className="espace-hero espace-hero--gaming">
        <div className="espace-hero__grid" aria-hidden="true" />
        <div className="espace-hero__accent" aria-hidden="true" />
        <div className="container espace-hero__inner">
          <span className="tag tag--accent">Gaming · MMI</span>
          <h1 className="espace-hero__title">La Salle<br />Gaming</h1>
          <p className="espace-hero__sub">
            Un laboratoire dédié au jeu vidéo, à la VR et au streaming —
            <br />pour explorer l'interactivité et l'UX immersif.
          </p>
          <div className="espace-hero__stats">
            <div className="espace-stat">
              <span className="espace-stat__num">12</span>
              <span className="espace-stat__unit">postes</span>
              <span className="espace-stat__label">PC Gaming</span>
            </div>
            <div className="espace-stat__sep" />
            <div className="espace-stat">
              <span className="espace-stat__num">4K</span>
              <span className="espace-stat__unit">240Hz</span>
              <span className="espace-stat__label">Affichage</span>
            </div>
            <div className="espace-stat__sep" />
            <div className="espace-stat">
              <span className="espace-stat__num">VR</span>
              <span className="espace-stat__unit">MR</span>
              <span className="espace-stat__label">Réalité mixte</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Présentation ─────────────────────────────────── */}
      <section className="espace-pres container">
        <div className="espace-pres__layout">
          <div className="espace-pres__text">
            <span className="tag">À propos</span>
            <h2 className="espace-section-title">Un labo<br /><em>interactif</em></h2>
            <p>
              La salle gaming du département MMI va bien au-delà du simple espace de jeu.
              Elle constitue un véritable laboratoire d'expériences interactives où les
              étudiants explorent l'UX gaming, le design de jeu, la réalité virtuelle
              et la production de contenus numériques.
            </p>
            <p>
              Équipée de stations haute performance, d'un espace VR dédié et d'un setup
              de streaming complet, elle permet de travailler sur des projets concrets
              allant du serious game au contenu créateur.
            </p>
            <div className="espace-pres__chips">
              {['UX Gaming', 'Réalité virtuelle', 'Streaming', 'Game Design', 'Serious Game'].map(t => (
                <span key={t} className="chip chip--gaming">{t}</span>
              ))}
            </div>
          </div>

          <div className="espace-galerie espace-galerie--gaming">
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
      <section className="espace-materiel espace-materiel--gaming">
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