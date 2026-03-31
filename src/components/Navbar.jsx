import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './Notificationbell';
import '../styles/Navbar.css';

const IUT_LINKS = [
  { to: '/studio',          label: 'Le Studio',        icon: '🎬' },
  { to: '/gaming',          label: 'Salle Gaming',     icon: '🎮' },
  { to: '/visite-virtuelle',label: 'Visite virtuelle', icon: '🥽', soon: true },
];

const ADMIN_LINKS = [
  { to: '/admin/validation', label: 'Validation projets', icon: '✦' },
  { to: '/admin/users',      label: 'Utilisateurs',       icon: '👥' },
  { to: '/admin/logs',       label: 'Journal d\'activité', icon: '📋' },
];

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [dropdown, setDropdown]       = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const dropRef      = useRef(null);
  const adminDropRef = useRef(null);

  const pseudo   = localStorage.getItem('pseudo');
  const isLogged = !!localStorage.getItem('token');
  const role     = localStorage.getItem('role');

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const isActive = path =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const isIUTActive   = IUT_LINKS.some(l => isActive(l.to));
  const isAdminActive = ADMIN_LINKS.some(l => isActive(l.to));

  useEffect(() => {
    const handler = e => {
      if (dropRef.current      && !dropRef.current.contains(e.target))      setDropdown(false);
      if (adminDropRef.current && !adminDropRef.current.contains(e.target)) setAdminDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__inner container">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-mmi">MMI</span>
          <span className="navbar__logo-dot" />
          <span className="navbar__logo-sub">Meaux</span>
        </Link>

        {/* Nav links */}
        <nav className="navbar__links">
          <Link
            to="/projets"
            className={`navbar__link ${isActive('/projets') ? 'navbar__link--active' : ''}`}
          >
            Projets
          </Link>

          <Link
            to="/formation"
            className={`navbar__link ${isActive('/formation') ? 'navbar__link--active' : ''}`}
          >
            Formation
          </Link>

          {/* Dropdown L'IUT */}
          <div className="navbar__dropdown" ref={dropRef}>
            <button
              className={`navbar__link navbar__dropdown-toggle ${isIUTActive ? 'navbar__link--active' : ''} ${dropdown ? 'navbar__dropdown-toggle--open' : ''}`}
              onClick={() => setDropdown(v => !v)}
              aria-expanded={dropdown}
            >
              L'IUT
              <svg className="navbar__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6l4 4 4-4"/>
              </svg>
            </button>

            {dropdown && (
              <div className="navbar__dropdown-menu">
                <div className="navbar__dropdown-header">Espaces &amp; équipements</div>
                {IUT_LINKS.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`navbar__dropdown-item ${isActive(item.to) ? 'navbar__dropdown-item--active' : ''} ${item.soon ? 'navbar__dropdown-item--soon' : ''}`}
                    onClick={() => setDropdown(false)}
                  >
                    <span className="navbar__dropdown-icon">{item.icon}</span>
                    <span className="navbar__dropdown-label">
                      {item.label}
                      {item.soon && <span className="navbar__soon-badge">Bientôt</span>}
                    </span>
                    {!item.soon && (
                      <svg className="navbar__dropdown-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 8h8M9 5l3 3-3 3"/>
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {isLogged ? (
            <>
              {/* Menu admin déroulant */}
              {role === 'ADMIN' && (
                <div className="navbar__dropdown navbar__dropdown--admin" ref={adminDropRef}>
                  <button
                    className={`navbar__admin-link ${isAdminActive ? 'navbar__admin-link--active' : ''} ${adminDropdown ? 'navbar__admin-link--open' : ''}`}
                    onClick={() => setAdminDropdown(v => !v)}
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M3 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z"/>
                    </svg>
                    Admin
                    <svg className={`navbar__chevron ${adminDropdown ? 'navbar__chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 6l4 4 4-4"/>
                    </svg>
                  </button>
                  {adminDropdown && (
                    <div className="navbar__dropdown-menu navbar__dropdown-menu--right">
                      <div className="navbar__dropdown-header">Administration</div>
                      {ADMIN_LINKS.map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`navbar__dropdown-item ${isActive(item.to) ? 'navbar__dropdown-item--active' : ''}`}
                          onClick={() => setAdminDropdown(false)}
                        >
                          <span className="navbar__dropdown-icon">{item.icon}</span>
                          <span className="navbar__dropdown-label">{item.label}</span>
                          <svg className="navbar__dropdown-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 8h8M9 5l3 3-3 3"/>
                          </svg>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <NotificationBell />
              <Link to="/profil" className="navbar__pseudo">@{pseudo}</Link>
              <button className="navbar__btn navbar__btn--ghost" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/connexion" className="navbar__btn">Connexion</Link>
          )}
        </div>

      </div>
    </header>
  );
}