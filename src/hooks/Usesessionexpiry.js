import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 heures
const CHECK_INTERVAL_MS   = 60 * 1000;           // vérification toutes les minutes

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('pseudo');
  localStorage.removeItem('userId');
  localStorage.removeItem('loginAt');
}

export function setLoginTimestamp() {
  localStorage.setItem('loginAt', Date.now().toString());
}

export function isSessionExpired() {
  const token   = localStorage.getItem('token');
  const loginAt = localStorage.getItem('loginAt');
  if (!token) return false;                  // pas connecté, rien à faire
  if (!loginAt) return true;                 // token sans timestamp → invalide
  return Date.now() - parseInt(loginAt, 10) > SESSION_DURATION_MS;
}

export default function useSessionExpiry() {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearSession();
    sessionStorage.setItem('session_expired', '1');
    navigate('/connexion');
  }, [navigate]);

  useEffect(() => {
    // Vérification immédiate au montage
    if (isSessionExpired()) {
      logout();
      return;
    }

    // Vérification périodique toutes les minutes
    const interval = setInterval(() => {
      if (isSessionExpired()) logout();
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [logout]);
}