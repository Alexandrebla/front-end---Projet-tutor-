import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/NotificationBell.css';

const API_URL = 'http://localhost:8080/api';

const TYPE_META = {
  PROJET_VALIDE:      { icon: '✓', cls: 'notif--valide',  label: 'Validé'      },
  PROJET_REJETE:      { icon: '✕', cls: 'notif--rejete',  label: 'Refusé'      },
  NOUVEAU_COMMENTAIRE:{ icon: '💬', cls: 'notif--comment', label: 'Commentaire' },
};

function fmtRelative(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'À l\'instant';
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `Il y a ${d}j`;
}

export default function NotificationBell() {
  const navigate   = useNavigate();
  const panelRef   = useRef(null);
  const token      = localStorage.getItem('token');
  const isLogged   = !!token;

  const [open, setOpen]       = useState(false);
  const [notifs, setNotifs]   = useState([]);
  const [count, setCount]     = useState(0);
  const [loading, setLoading] = useState(false);

  // ── Polling du compteur toutes les 30s ──────────────────
  const fetchCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/notifications/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count ?? 0);
      }
    } catch {}
  }, [token]);

  useEffect(() => {
    if (!isLogged) return;
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [isLogged, fetchCount]);

  // ── Fermer le panneau en cliquant dehors ─────────────────
  useEffect(() => {
    const handler = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Ouvrir le panneau et charger les notifs ──────────────
  const handleOpen = async () => {
    if (!open) {
      setOpen(true);
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifs(Array.isArray(data) ? data : []);
        } else {
          const err = await res.text().catch(() => '');
          console.error(`[NotificationBell] GET /notifications → HTTP ${res.status}`, err);
        }
      } catch (e) {
        console.error('[NotificationBell] Erreur réseau :', e);
      } finally {
        setLoading(false);
      }
    } else {
      setOpen(false);
    }
  };

  const [modalNotif, setModalNotif] = useState(null);

  // ── Marquer toutes comme lues ────────────────────────────
  const marquerToutesLues = async () => {
    try {
      await fetch(`${API_URL}/notifications/lire-tout`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
      setCount(0);
    } catch {}
  };

  // ── Cliquer sur une notif → ouvre le popup ──────────────
  const handleNotifClick = async (notif) => {
    if (!notif.lu) {
      try {
        await fetch(`${API_URL}/notifications/${notif.id}/lire`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, lu: true } : n));
        setCount(c => Math.max(0, c - 1));
      } catch {}
    }
    setModalNotif({ ...notif, lu: true });
  };

  // ── Depuis le popup → naviguer vers le projet ────────────
  const handleGoToProjet = (notif) => {
    setModalNotif(null);
    setOpen(false);
    if (notif.projetId) navigate(`/projets/${notif.projetId}`);
  };

  if (!isLogged) return null;

  const nonLues = notifs.filter(n => !n.lu).length;

  return (
    <div className="nb-wrap" ref={panelRef}>

      {/* ── Cloche ── */}
      <button
        className={`nb-bell ${open ? 'nb-bell--open' : ''} ${count > 0 ? 'nb-bell--has-notif' : ''}`}
        onClick={handleOpen}
        title="Notifications"
        aria-label={`Notifications${count > 0 ? ` (${count} non lues)` : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {count > 0 && (
          <span className="nb-badge">{count > 9 ? '9+' : count}</span>
        )}
      </button>

      {/* ── Panneau ── */}
      {open && (
        <div className="nb-panel">
          {/* En-tête */}
          <div className="nb-panel__header">
            <div className="nb-panel__title">
              <span>Notifications</span>
              {nonLues > 0 && (
                <span className="nb-panel__unread">{nonLues} nouvelle{nonLues > 1 ? 's' : ''}</span>
              )}
            </div>
            {nonLues > 0 && (
              <button className="nb-panel__read-all" onClick={marquerToutesLues}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="nb-panel__list">
            {loading ? (
              <div className="nb-state">
                <span className="nb-spinner" />
              </div>
            ) : notifs.length === 0 ? (
              <div className="nb-state nb-state--empty">
                <span className="nb-state__icon">🔔</span>
                <p>Aucune notification</p>
              </div>
            ) : (
              notifs.map(notif => {
                const meta = TYPE_META[notif.type] || TYPE_META.NOUVEAU_COMMENTAIRE;
                return (
                  <button
                    key={notif.id}
                    className={`nb-notif ${!notif.lu ? 'nb-notif--unread' : ''} ${meta.cls}`}
                    onClick={() => handleNotifClick(notif)}
                  >
                    {/* Point non lu */}
                    {!notif.lu && <span className="nb-notif__dot" />}

                    {/* Icône type */}
                    <span className="nb-notif__icon">{meta.icon}</span>

                    {/* Contenu */}
                    <div className="nb-notif__content">
                      <span className="nb-notif__titre">{notif.titre}</span>
                      <span className="nb-notif__msg">{notif.message}</span>
                      <span className="nb-notif__time">{fmtRelative(notif.dateHeure)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── Popup détail notif (via portal pour éviter z-index navbar) ── */}
      {modalNotif && createPortal((() => {
        const meta = TYPE_META[modalNotif.type] || TYPE_META.NOUVEAU_COMMENTAIRE;
        // Séparer le message admin s'il y en a un
        const parts = (modalNotif.message || '').split('\n\nMessage de l\'administrateur :');
        const msgPrincipal = parts[0];
        const msgAdmin     = parts[1]?.trim();

        return (
          <div className="nb-modal-overlay" onClick={() => setModalNotif(null)}>
            <div className="nb-modal" onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className={`nb-modal__header nb-modal__header--${meta.cls.replace('notif--','')}`}>
                <span className="nb-modal__icon">{meta.icon}</span>
                <div className="nb-modal__head-text">
                  <span className="nb-modal__type">{meta.label}</span>
                  <h3 className="nb-modal__titre">{modalNotif.titre}</h3>
                </div>
                <button className="nb-modal__close" onClick={() => setModalNotif(null)}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 2l12 12M14 2L2 14"/>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="nb-modal__body">
                <p className="nb-modal__msg">{msgPrincipal}</p>

                {/* Message admin (refus uniquement) */}
                {msgAdmin && (
                  <div className="nb-modal__admin-msg">
                    <div className="nb-modal__admin-label">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z"/>
                      </svg>
                      Message de l'administrateur
                    </div>
                    <p className="nb-modal__admin-text">"{msgAdmin}"</p>
                  </div>
                )}

                <span className="nb-modal__time">{fmtRelative(modalNotif.dateHeure)}</span>
              </div>

              {/* Footer */}
              <div className="nb-modal__footer">
                <button className="nb-modal__btn-close" onClick={() => setModalNotif(null)}>
                  Fermer
                </button>
                {modalNotif.projetId && (
                  <button className="nb-modal__btn-go" onClick={() => handleGoToProjet(modalNotif)}>
                    Voir le projet →
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })(), document.body)}

    </div>
  );
}