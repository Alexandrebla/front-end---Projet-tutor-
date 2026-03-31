import { useState } from 'react';
import { setLoginTimestamp } from '../hooks/useSessionExpiry';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Connexion.css';

const API_URL = 'http://localhost:8080/api';

export default function Connexion() {
  const navigate = useNavigate();
  const location  = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const [mode, setMode]       = useState('login');

  // Détection expiration session
  const sessionExpired = sessionStorage.getItem('session_expired') === '1';
  if (sessionExpired) sessionStorage.removeItem('session_expired');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [loginData, setLoginData] = useState({ identifiant: '', password: '' });
  const [regData, setRegData]     = useState({
    nom: '', prenom: '', pseudo: '', email: '', password: '', classePromo: ''
  });

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
      localStorage.setItem('token',  data.token);
      localStorage.setItem('role',   data.role);
      localStorage.setItem('pseudo', data.pseudo);
      localStorage.setItem('userId', data.userId);
      setLoginTimestamp();
      navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'inscription");
      localStorage.setItem('token',  data.token);
      localStorage.setItem('role',   data.role);
      localStorage.setItem('pseudo', data.pseudo);
      localStorage.setItem('userId', data.userId);
      setLoginTimestamp();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cnx">

      {/* ── Panneau gauche décoratif ── */}
      <div className="cnx__deco" aria-hidden="true">
        <div className="cnx__deco-grid" />
        <div className="cnx__deco-glow" />
        <div className="cnx__deco-content">
          <Link to="/" className="cnx__deco-logo">MMI</Link>
          <blockquote className="cnx__deco-quote">
            "Créer, c'est vivre deux fois."
            <cite>Albert Camus</cite>
          </blockquote>
          <ul className="cnx__deco-dots">
            <li className={mode === 'login'    ? 'cnx__dot cnx__dot--active' : 'cnx__dot'} onClick={() => setMode('login')} />
            <li className={mode === 'register' ? 'cnx__dot cnx__dot--active' : 'cnx__dot'} onClick={() => setMode('register')} />
          </ul>
        </div>
      </div>

      {/* ── Panneau droit formulaire ── */}
      <div className="cnx__panel">
        {sessionExpired && (
          <div className="session-expired-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
            Votre session a expiré après 2 heures — veuillez vous reconnecter.
          </div>
        )}
        <div className="cnx__wrap">

          <div className="cnx__header">
            <h1 className="cnx__title">
              {mode === 'login' ? 'Bon retour 👋' : 'Créer un compte'}
            </h1>
            <p className="cnx__subtitle">
              {mode === 'login'
                ? 'Connectez-vous à votre espace MMI.'
                : 'Rejoignez la communauté MMI.'}
            </p>
          </div>

          <div className="cnx__toggle">
            <button
              className={`cnx__toggle-btn ${mode === 'login' ? 'cnx__toggle-btn--active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >Connexion</button>
            <button
              className={`cnx__toggle-btn ${mode === 'register' ? 'cnx__toggle-btn--active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >Inscription</button>
          </div>

          {error && <div className="cnx__error">{error}</div>}

          {/* ── Formulaire connexion ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="cnx__form" key="login">
              <div className="cnx__field">
                <label className="cnx__label">Email ou pseudo</label>
                <input
                  type="text"
                  className="cnx__input"
                  placeholder="lucas_d ou lucas@etudiant.fr"
                  value={loginData.identifiant}
                  onChange={e => setLoginData({ ...loginData, identifiant: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="cnx__field">
                <label className="cnx__label">Mot de passe</label>
                <input
                  type="password"
                  className="cnx__input"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="cnx__submit" disabled={loading}>
                {loading ? <span className="cnx__spinner" /> : 'Se connecter'}
              </button>
            </form>
          )}

          {/* ── Formulaire inscription ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="cnx__form" key="register">
              <div className="cnx__row">
                <div className="cnx__field">
                  <label className="cnx__label">Nom</label>
                  <input type="text" className="cnx__input" placeholder="Dupont"
                    value={regData.nom}
                    onChange={e => setRegData({ ...regData, nom: e.target.value })}
                    required />
                </div>
                <div className="cnx__field">
                  <label className="cnx__label">Prénom</label>
                  <input type="text" className="cnx__input" placeholder="Lucas"
                    value={regData.prenom}
                    onChange={e => setRegData({ ...regData, prenom: e.target.value })}
                    required />
                </div>
              </div>
              <div className="cnx__field">
                <label className="cnx__label">Pseudo</label>
                <input type="text" className="cnx__input" placeholder="lucas_d"
                  value={regData.pseudo}
                  onChange={e => setRegData({ ...regData, pseudo: e.target.value })}
                  required />
              </div>
              <div className="cnx__field">
                <label className="cnx__label">Email</label>
                <input type="email" className="cnx__input" placeholder="lucas@etudiant.fr"
                  value={regData.email}
                  onChange={e => setRegData({ ...regData, email: e.target.value })}
                  required />
              </div>
              <div className="cnx__field">
                <label className="cnx__label">Mot de passe</label>
                <input type="password" className="cnx__input" placeholder="••••••••"
                  value={regData.password}
                  onChange={e => setRegData({ ...regData, password: e.target.value })}
                  required />
              </div>
              <div className="cnx__field">
                <label className="cnx__label">
                  Classe / Promo <span className="cnx__label--opt">(optionnel)</span>
                </label>
                <input type="text" className="cnx__input" placeholder="MMI2"
                  value={regData.classePromo}
                  onChange={e => setRegData({ ...regData, classePromo: e.target.value })} />
              </div>
              <button type="submit" className="cnx__submit" disabled={loading}>
                {loading ? <span className="cnx__spinner" /> : 'Créer mon compte'}
              </button>
            </form>
          )}

          <p className="cnx__back">
            <Link to="/">← Retour à l'accueil</Link>
          </p>

        </div>
      </div>
    </div>
  );
}