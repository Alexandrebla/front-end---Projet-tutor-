import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useSessionExpiry from './hooks/useSessionExpiry';
import Accueil       from './pages/Accueil';
import Projets       from './pages/Projets';
import ProjetDetail  from './pages/ProjetDetail';
import Connexion     from './pages/Connexion';
import Profil        from './pages/Profil';
import Formation     from './pages/Formation';
import Studio        from './pages/Studio';
import Gaming        from './pages/Gaming';
import Credits          from './pages/Credits';
import AdminValidation  from './pages/AdminValidation';
import AdminUsers       from './pages/AdminUsers';
import ProfilPublic     from './pages/ProfilPublic';

function VisiteVirtuelle() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
      <span style={{ fontSize: '3rem' }}>🥽</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text-primary)' }}>Visite Virtuelle</h1>
      <p>Cette page est en cours de construction.</p>
    </div>
  );
}

function SessionGuard() {
  useSessionExpiry();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionGuard />
      <Routes>
        <Route path="/"                  element={<Accueil />} />
        <Route path="/projets"           element={<Projets />} />
        <Route path="/projets/:id"       element={<ProjetDetail />} />
        <Route path="/connexion"         element={<Connexion />} />
        <Route path="/profil"            element={<Profil />} />
        <Route path="/formation"         element={<Formation />} />
        <Route path="/studio"            element={<Studio />} />
        <Route path="/gaming"            element={<Gaming />} />
        <Route path="/visite-virtuelle"  element={<VisiteVirtuelle />} />
        <Route path="/credits"           element={<Credits />} />
        <Route path="/admin/validation"  element={<AdminValidation />} />
        <Route path="/admin/users"       element={<AdminUsers />} />
        <Route path="/u/:pseudo"          element={<ProfilPublic />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}