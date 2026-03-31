import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Formation.css';

const MATIERES = [
  { code: 'WEB',       label: 'Développement Web',      icon: '⟨/⟩', desc: 'HTML, CSS, JavaScript, React, Node.js. Création de sites et dapplications web modernes et responsive.' },
  { code: 'UI',        label: 'Design d\'Interface',     icon: '◻',   desc: 'Figma, Adobe XD, design systems. Conception dinterfaces belles, cohérentes et accessibles.' },
  { code: 'UX',        label: 'Expérience Utilisateur',  icon: '⬡',   desc: 'Recherche utilisateur, personas, tests dutilisabilité, wireframing et prototypage.' },
  { code: 'TROIS_D',   label: 'Modélisation 3D',         icon: '◈',   desc: 'Blender, Cinema 4D, Three.js. Objets 3D, animations et expériences immersives temps réel.' },
  { code: 'DESIGN',    label: 'Design Graphique',        icon: '✦',   desc: 'Identité visuelle, typographie, mise en page, print et direction artistique.' },
  { code: 'MULTIMEDIA',label: 'Multimédia & Vidéo',      icon: '▶',   desc: 'Réalisation, montage vidéo, motion design, podcast et création de contenus numériques.' },
];

const PROFS = [
  { nom: 'Martin', prenom: 'Sophie', pseudo: 'prof_sophie', matiere: 'Web Design', id: 2, initiale: 'S' },
  { nom: 'Lefèvre', prenom: 'Marc',  pseudo: 'prof_marc',   matiere: 'Design Graphique', id: 10, initiale: 'M' },
  { nom: 'Huang',   prenom: 'Lin',   pseudo: 'prof_lin',    matiere: 'UX Research', id: 11, initiale: 'L' },
  { nom: 'Moreau',  prenom: 'Julie', pseudo: 'prof_julie',  matiere: '3D & Motion', id: 12, initiale: 'J' },
];

const STATS = [
  { num: '150+', label: 'Étudiants',      desc: 'en formation chaque année' },
  { num: '3',    label: 'Années',         desc: 'de formation BUT' },
  { num: '6',    label: 'Spécialités',    desc: 'couvertes par le programme' },
  { num: '85%',  label: 'Insertion pro',  desc: 'à 6 mois après diplôme' },
];

const DEBOUCHES = [
  { titre: 'Développeur Front-end / Full-stack', tags: ['WEB', 'UI'] },
  { titre: 'Designer UI/UX', tags: ['UI', 'UX'] },
  { titre: 'Directeur Artistique Digital', tags: ['DESIGN', 'UI'] },
  { titre: 'Motion Designer', tags: ['MULTIMEDIA', 'TROIS_D'] },
  { titre: 'Chargé de Projet Multimédia', tags: ['MULTIMEDIA', 'UX'] },
  { titre: 'Modélisateur 3D / AR/VR', tags: ['TROIS_D'] },
];

const SEMESTRES = [
  { num: 'S1', titre: 'Fondamentaux', items: ['Intro HTML/CSS', 'Bases du design', 'Culture numérique', 'Communication'] },
  { num: 'S2', titre: 'Approfondissement', items: ['JavaScript', 'Typographie', 'UX Research', 'Photo & Vidéo'] },
  { num: 'S3', titre: 'Spécialisation', items: ['Framework web', 'Design System', '3D temps réel', 'Motion design'] },
  { num: 'S4', titre: 'Professionnalisation', items: ['Stage 10 sem.', 'Projet tutoré', 'Portfolio', 'Soft skills'] },
  { num: 'S5', titre: 'Expertise', items: ['Projet avancé', 'SAÉ complexe', 'Veille tech', 'Gestion de projet'] },
  { num: 'S6', titre: 'Insertion', items: ['Stage long', 'Rapport pro', 'Portfolio final', 'Soutenance'] },
];

export default function Formation() {
  const [activeMatiere, setActiveMatiere] = useState(null);

  return (
    <div className="formation-page">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="formation-hero">
        <div className="formation-hero__bg" aria-hidden="true" />
        <div className="container formation-hero__inner">
          <span className="tag tag--accent">BUT · Métiers du Multimédia et de l'Internet</span>
          <h1 className="formation-hero__title">
            Formez-vous aux<br />
            <em>métiers du numérique</em>
          </h1>
          <p className="formation-hero__sub">
            Le département MMI de l'IUT de Marne-la-Vallée forme des créatifs<br />
            et des techniciens du web, du design et du multimédia.
          </p>
          <div className="formation-hero__ctas">
            <a href="https://www.iut-marne-la-vallee.fr" target="_blank" rel="noreferrer" className="cta-primary">
              Candidater sur Parcoursup ↗
            </a>
            <a href="#programme" className="cta-secondary">Voir le programme</a>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="formation-stats container">
        {STATS.map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="stat-card__num">{s.num}</span>
            <span className="stat-card__label">{s.label}</span>
            <span className="stat-card__desc">{s.desc}</span>
          </div>
        ))}
      </section>

      {/* ── Présentation ─────────────────────────────────── */}
      <section className="formation-about container">
        <div className="formation-about__text">
          <span className="tag">Le département</span>
          <h2 className="section-title">Qui sommes-nous ?</h2>
          <p>
            Le département MMI (Métiers du Multimédia et de l'Internet) de l'IUT de
            Marne-la-Vallée propose un <strong>BUT en 3 ans</strong> alliant créativité,
            technique et gestion de projet. La formation couvre le design d'interface, le
            développement web, la vidéo, le 3D et l'expérience utilisateur.
          </p>
          <p>
            Les étudiants travaillent sur des <strong>projets réels</strong> en collaboration
            avec des entreprises partenaires, et réalisent deux stages au cours de leur
            formation. Le BUT MMI ouvre les portes des agences web, des studios créatifs,
            des DSI et de l'entrepreneuriat.
          </p>
        </div>
        <div className="formation-about__visual">
          <div className="about-visual__grid">
            {['WEB','UI','UX','3D','DESIGN','MM'].map((l, i) => (
              <div key={i} className="about-visual__cell">{l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Matières ─────────────────────────────────────── */}
      <section className="formation-matieres container" id="matieres">
        <div className="section-head">
          <span className="tag">Programme</span>
          <h2 className="section-title">Les matières</h2>
          <p className="section-sub">Cliquez sur une matière pour en savoir plus.</p>
        </div>

        <div className="matieres-grid">
          {MATIERES.map(m => (
            <button
              key={m.code}
              className={`matiere-card ${activeMatiere === m.code ? 'matiere-card--active' : ''}`}
              onClick={() => setActiveMatiere(prev => prev === m.code ? null : m.code)}
            >
              <span className="matiere-card__icon">{m.icon}</span>
              <span className="matiere-card__label">{m.label}</span>
              <span className="matiere-card__code">{m.code}</span>
              {activeMatiere === m.code && (
                <p className="matiere-card__desc">{m.desc}</p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── Programme / Semestres ────────────────────────── */}
      <section className="formation-semestres container" id="programme">
        <div className="section-head">
          <span className="tag">Parcours</span>
          <h2 className="section-title">Les 6 semestres</h2>
          <p className="section-sub">Un parcours progressif de la découverte à l'expertise.</p>
        </div>

        <div className="semestres-timeline">
          {SEMESTRES.map((s, i) => (
            <div key={s.num} className="semestre-item">
              <div className="semestre-item__badge">{s.num}</div>
              <div className="semestre-item__content">
                <h3 className="semestre-item__titre">{s.titre}</h3>
                <ul className="semestre-item__list">
                  {s.items.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Profs ────────────────────────────────────────── */}
      <section className="formation-profs container">
        <div className="section-head">
          <span className="tag">L'équipe</span>
          <h2 className="section-title">Les enseignants</h2>
        </div>

        <div className="profs-grid">
          {PROFS.map(p => (
            <div key={p.id} className="prof-card">
              <div className="prof-card__avatar">{p.initiale}</div>
              <div className="prof-card__info">
                <span className="prof-card__name">{p.prenom} {p.nom}</span>
                <span className="prof-card__matiere">{p.matiere}</span>
                <span className="prof-card__pseudo">@{p.pseudo}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Débouchés ────────────────────────────────────── */}
      <section className="formation-debouches container">
        <div className="section-head">
          <span className="tag">Avenir</span>
          <h2 className="section-title">Débouchés & métiers</h2>
        </div>

        <div className="debouches-grid">
          {DEBOUCHES.map((d, i) => (
            <div key={i} className="debouche-card">
              <h3 className="debouche-card__titre">{d.titre}</h3>
              <div className="debouche-card__tags">
                {d.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────── */}
      <section className="formation-cta-section container">
        <div className="formation-cta-box">
          <h2>Rejoignez la prochaine promotion</h2>
          <p>Les candidatures sont ouvertes sur Parcoursup. Découvrez nos journées portes ouvertes.</p>
          <div className="formation-cta-box__btns">
            <a href="https://www.parcoursup.fr" target="_blank" rel="noreferrer" className="cta-primary">
              Candidater sur Parcoursup ↗
            </a>
          </div>
        </div>
      </section>

      <footer className="footer container">
        <span className="footer__logo">MMI</span>
        <span className="footer__copy">© 2025 · IUT Marne-la-Vallée · Projet Tutoré</span>
      </footer>
    </div>
  );
}