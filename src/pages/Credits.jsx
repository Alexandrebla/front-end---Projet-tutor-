import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Credits.css';

/* ── Icônes SVG ─────────────────────────────────────────── */
const IconGithub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const IconLinkedin = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconBehance = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.69.756-.63.155-1.3.233-1.99.233H0V4.503h6.938zm-.588 5.63c.588 0 1.07-.14 1.44-.42.37-.28.555-.7.555-1.27 0-.31-.056-.572-.165-.786-.11-.21-.264-.383-.46-.51-.197-.127-.43-.214-.694-.265-.264-.05-.547-.075-.85-.075H3.93v3.326h2.42zm.172 5.858c.337 0 .65-.03.944-.1.294-.07.55-.18.77-.33.22-.16.395-.36.52-.618.124-.257.19-.583.19-.977 0-.78-.22-1.33-.65-1.66-.43-.33-1-.495-1.72-.495H3.93v4.18h2.592zm10.39-5.176c-.52 0-.975.164-1.363.493-.388.33-.617.83-.69 1.503h4.078c-.074-.68-.296-1.183-.67-1.507-.374-.324-.838-.49-1.355-.49zm3.995 5.697c-.57.566-1.39.848-2.46.848-.67 0-1.26-.12-1.77-.357-.51-.238-.94-.565-1.29-.98-.35-.42-.617-.915-.79-1.49-.173-.573-.26-1.19-.26-1.85v-.44c0-.64.09-1.24.275-1.8.185-.56.457-1.05.817-1.47.36-.42.8-.75 1.33-.98.53-.23 1.14-.34 1.83-.34.76 0 1.41.14 1.95.42.54.28.99.66 1.33 1.14.35.48.6 1.05.755 1.7.155.656.213 1.35.17 2.09H19.27c.06.82.302 1.43.73 1.84.425.4 1.01.6 1.75.6.48 0 .9-.12 1.24-.36.34-.24.567-.51.675-.8h2.48c-.388 1.17-1.01 2.04-1.867 2.61zm-4.28-8.58h5.014v1.32h-5.014v-1.32z"/>
  </svg>
);

const IconPortfolio = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ICONES_LIENS = {
  github:    { icon: <IconGithub />,    label: 'GitHub',    color: '#24292e' },
  linkedin:  { icon: <IconLinkedin />,  label: 'LinkedIn',  color: '#0a66c2' },
  behance:   { icon: <IconBehance />,   label: 'Behance',   color: '#1769ff' },
  portfolio: { icon: <IconPortfolio />, label: 'Portfolio', color: '#b3cc00' },
};

/* ── Données membres ─────────────────────────────────────── */
const MEMBRES = [
  {
    id: 1,
    nom: 'Alexandre Moreau',
    age: 20,
    mail: 'alexandre.moreau@etudiant.iut-mlv.fr',
    telephone: '06 12 34 56 78',
    role: 'Développeur Frontend',
    promo: 'MMI2 · 2024–2025',
    initiales: 'AM',
    couleur: '#b3cc00',
    liens: [
      { type: 'github',    url: 'https://github.com/' },
      { type: 'linkedin',  url: 'https://linkedin.com/' },
      { type: 'portfolio', url: 'https://exemple.fr' },
    ],
  },
  {
    id: 2,
    nom: 'Léa Fontaine',
    age: 19,
    mail: 'lea.fontaine@etudiant.iut-mlv.fr',
    telephone: '06 23 45 67 89',
    role: 'Designer UI/UX',
    promo: 'MMI2 · 2024–2025',
    initiales: 'LF',
    couleur: '#1a8fff',
    liens: [
      { type: 'behance',   url: 'https://behance.net/' },
      { type: 'linkedin',  url: 'https://linkedin.com/' },
      { type: 'portfolio', url: 'https://exemple.fr' },
    ],
  },
  {
    id: 3,
    nom: 'Nathan Dubois',
    age: 21,
    mail: 'nathan.dubois@etudiant.iut-mlv.fr',
    telephone: '06 34 56 78 90',
    role: 'Développeur Backend',
    promo: 'MMI2 · 2024–2025',
    initiales: 'ND',
    couleur: '#e8344a',
    liens: [
      { type: 'github',   url: 'https://github.com/' },
      { type: 'linkedin', url: 'https://linkedin.com/' },
      { type: 'portfolio', url: 'https://exemple.fr' },
    ],
  },
  {
    id: 4,
    nom: 'Camille Petit',
    age: 20,
    mail: 'camille.petit@etudiant.iut-mlv.fr',
    telephone: '06 45 67 89 01',
    role: 'Graphiste & Motion',
    promo: 'MMI2 · 2024–2025',
    initiales: 'CP',
    couleur: '#a855f7',
    liens: [
      { type: 'behance',   url: 'https://behance.net/' },
      { type: 'linkedin',  url: 'https://linkedin.com/' },
      { type: 'portfolio', url: 'https://exemple.fr' },
    ],
  },
];

/* ── Composant card ─────────────────────────────────────── */
function MemberCard({ membre, index }) {
  return (
    <article
      className="credit-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* ── Panneau gauche : avatar + liens ── */}
      <div className="credit-card__photo" style={{ '--member-color': membre.couleur }}>
        <div className="credit-card__photo-bg" aria-hidden="true" />

        <div className="credit-card__avatar">
          <span className="credit-card__initiales">{membre.initiales}</span>
        </div>

        {/* Liens sociaux */}
        <div className="credit-card__liens">
          {membre.liens.map((lien, i) => {
            const meta = ICONES_LIENS[lien.type];
            return (
              <a
                key={i}
                href={lien.url}
                target="_blank"
                rel="noopener noreferrer"
                className="credit-lien"
                style={{ '--lien-color': meta.color }}
                title={meta.label}
              >
                <span className="credit-lien__icon">{meta.icon}</span>
                <span className="credit-lien__label">{meta.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Panneau droit : infos ── */}
      <div className="credit-card__body">
        <div className="credit-card__header">
          <div>
            <span className="credit-card__role">{membre.role}</span>
            <h2 className="credit-card__nom">{membre.nom}</h2>
            <span className="credit-card__promo">{membre.promo}</span>
          </div>
          <div className="credit-card__num">0{index + 1}</div>
        </div>

        <div className="credit-card__sep" />

        <dl className="credit-card__infos">
          <div className="credit-info">
            <dt>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="7" r="3"/>
                <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6"/>
              </svg>
              Âge
            </dt>
            <dd>{membre.age} ans</dd>
          </div>

          <div className="credit-info">
            <dt>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.5 6.5A2 2 0 0 1 4.5 4.5h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-7z"/>
                <path d="m2.5 7 7.5 5 7.5-5"/>
              </svg>
              Mail
            </dt>
            <dd>
              <a href={`mailto:${membre.mail}`} className="credit-info__link">
                {membre.mail}
              </a>
            </dd>
          </div>

          <div className="credit-info">
            <dt>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5a2 2 0 0 1 2-2h1.5l2 4.5-1.5 1.5a11 11 0 0 0 4 4l1.5-1.5L17 13.5V15a2 2 0 0 1-2 2A12 12 0 0 1 3 5z"/>
              </svg>
              Téléphone
            </dt>
            <dd>
              <a href={`tel:${membre.telephone.replace(/\s/g, '')}`} className="credit-info__link">
                {membre.telephone}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function Credits() {
  return (
    <div className="credits-page">
      <Navbar />

      <section className="credits-hero">
        <div className="credits-hero__grid" aria-hidden="true" />
        <div className="container credits-hero__inner">
          <span className="tag">Projet Tutoré · MMI2</span>
          <h1 className="credits-hero__title">L'équipe</h1>
          <p className="credits-hero__sub">
            Les étudiants derrière ce projet — promotion MMI 2024–2025.
          </p>
        </div>
      </section>

      <main className="credits-main container">
        {MEMBRES.map((m, i) => (
          <MemberCard key={m.id} membre={m} index={i} />
        ))}
      </main>

      <Footer />
    </div>
  );
}