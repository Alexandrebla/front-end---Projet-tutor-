import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">

        {/* Colonne gauche — branding */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">MMI</Link>
          <p className="footer__tagline">
            Portfolio étudiant · IUT Marne-la-Vallée
          </p>
          <div className="footer__links">
            <Link to="/projets">Projets</Link>
            <Link to="/formation">Formation</Link>
            <Link to="/studio">Studio</Link>
            <Link to="/gaming">Gaming</Link>
          </div>
        </div>

        {/* Séparateur vertical */}
        <div className="footer__sep" aria-hidden="true" />

        {/* Colonne droite — infos + crédits */}
        <div className="footer__right">
          <div className="footer__meta">
            <span className="footer__year">2025</span>
            <span className="footer__dot" />
            <span>Projet Tutoré · Département MMI</span>
          </div>
          <Link to="/credits" className="footer__credits-link">
            <span className="footer__credits-icon">✦</span>
            Crédits &amp; équipe
          </Link>
        </div>

      </div>

      {/* Barre de bas de page */}
      <div className="footer__bar container">
        <span>Fait avec React + Vite</span>
        <span>IUT de Marne-la-Vallée · 2024–2025</span>
      </div>
    </footer>
  );
}