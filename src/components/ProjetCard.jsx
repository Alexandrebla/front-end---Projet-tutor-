import { Link } from 'react-router-dom';
import '../styles/ProjetCard.css';

function profilLink(pseudo) {
  const myPseudo = localStorage.getItem('pseudo');
  return myPseudo && myPseudo === pseudo ? '/profil' : `/u/${pseudo}`;
}


const MATIERE_COLORS = {
  WEB:        { bg: '#1a2a3a', text: '#4daaff' },
  UI:         { bg: '#2a1a3a', text: '#b47dff' },
  UX:         { bg: '#1a2a2a', text: '#4dffcf' },
  TROIS_D:    { bg: '#2a2a1a', text: '#ffd04d' },
  DESIGN:     { bg: '#3a1a2a', text: '#ff7db4' },
  MULTIMEDIA: { bg: '#1a2a1a', text: '#7dff8a' },
  AUTRE:      { bg: '#1e1e2a', text: '#8a8799' },
};

export default function ProjetCard({ projet }) {
  const { titre, description, matiere, likes, auteur, commentaires } = projet;
  const mColor       = MATIERE_COLORS[matiere] || MATIERE_COLORS.AUTRE;
  const commentCount = projet.commentCount ?? commentaires?.length ?? 0;

  // Priorité : miniature uploadée → urlMedia externe → placeholder initiale
  const thumbSrc = projet.thumbnailUrl
    ? `http://localhost:8080${projet.thumbnailUrl}`
    : projet.urlMedia || null;

  return (
    <article className="projet-card">
      {/* Thumbnail */}
      <div className="projet-card__thumb">
        {thumbSrc ? (
          <img src={thumbSrc} alt={titre} />
        ) : (
          <div className="projet-card__thumb-placeholder">
            <span>{titre.charAt(0)}</span>
          </div>
        )}
        <span
          className="projet-card__matiere"
          style={{ background: mColor.bg, color: mColor.text }}
        >
          {matiere}
        </span>
      </div>

      {/* Body */}
      <div className="projet-card__body">
        <h3 className="projet-card__title">{titre}</h3>
        {description && (
          <p className="projet-card__desc">
            {description}
          </p>
        )}

        <div className="projet-card__footer">
          <Link to={profilLink(auteur?.pseudo)} className="projet-card__author" onClick={e => e.stopPropagation()}>@{auteur?.pseudo || 'anonyme'}</Link>

          <div className="projet-card__stats">
            {/* Likes */}
            <span className="projet-card__stat projet-card__stat--likes">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {likes ?? 0}
            </span>

            {/* Comments */}
            <span className="projet-card__stat projet-card__stat--comments">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {commentCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}