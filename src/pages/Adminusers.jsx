import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AdminUsers.css';

const API_URL = 'http://localhost:8080/api';

const ROLES = ['USER', 'PROF', 'ADMIN'];

const ROLE_META = {
  USER:  { label: 'Étudiant', color: '#1a8fff' },
  PROF:  { label: 'Prof',     color: '#a855f7' },
  ADMIN: { label: 'Admin',    color: '#f59e0b' },
};

const FAKE_USERS = [
  { id: 1, nom: 'Admin',   prenom: 'Super',  pseudo: 'admin',       email: 'admin@mmi.fr',             role: 'ADMIN', classePromo: '',     matiereEnseignee: '', specialisation: 'Gestion',   telephone: '' },
  { id: 2, nom: 'Martin',  prenom: 'Sophie', pseudo: 'prof_sophie', email: 'sophie.martin@mmi.fr',     role: 'PROF',  classePromo: '',     matiereEnseignee: 'Web Design', specialisation: '', telephone: '' },
  { id: 3, nom: 'Dupont',  prenom: 'Lucas',  pseudo: 'lucas_d',     email: 'lucas@etudiant.fr',        role: 'USER',  classePromo: 'MMI2', matiereEnseignee: '', specialisation: '',          telephone: '' },
  { id: 4, nom: 'Richard', prenom: 'Emma',   pseudo: 'emma_r',      email: 'emma.richard@etudiant.fr', role: 'USER',  classePromo: 'MMI1', matiereEnseignee: '', specialisation: '',          telephone: '06 00 00 00 01' },
  { id: 5, nom: 'Vidal',   prenom: 'Thomas', pseudo: 'thomas_v',    email: 'thomas.vidal@etudiant.fr', role: 'USER',  classePromo: 'MMI2', matiereEnseignee: '', specialisation: '',          telephone: '' },
];

const EMPTY_FORM = {
  nom: '', prenom: '', pseudo: '', email: '', password: '',
  role: 'USER', classePromo: '', telephone: '',
  matiereEnseignee: '', specialisation: '',
};

/* ── Toast ───────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`au-toast au-toast--${toast.type}`}>
      {toast.type === 'ok'
        ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10l4.5 4.5L16 6"/></svg>
        : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15"/></svg>
      }
      {toast.msg}
    </div>
  );
}

/* ── Modal utilisateur (créer / modifier) ────────────────── */
function ModalUser({ user, onClose, onSave, saving }) {
  const isEdit = !!user?.id;
  const [form, setForm] = useState(
    isEdit
      ? { nom: user.nom, prenom: user.prenom, pseudo: user.pseudo, email: user.email,
          password: '', role: user.role, classePromo: user.classePromo || '',
          telephone: user.telephone || '', matiereEnseignee: user.matiereEnseignee || '',
          specialisation: user.specialisation || '' }
      : { ...EMPTY_FORM }
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="au-overlay" onClick={onClose}>
      <div className="au-modal" onClick={e => e.stopPropagation()}>

        <div className="au-modal__header">
          <div>
            <span className="au-modal__tag">{isEdit ? 'Modifier' : 'Nouvel utilisateur'}</span>
            {isEdit && <p className="au-modal__sub">@{user.pseudo}</p>}
          </div>
          <button className="au-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="au-modal__body">
          <div className="au-form-row">
            <div className="au-form-group">
              <label>Prénom *</label>
              <input value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Lucas" required />
            </div>
            <div className="au-form-group">
              <label>Nom *</label>
              <input value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Dupont" required />
            </div>
          </div>

          <div className="au-form-row">
            <div className="au-form-group">
              <label>Pseudo *</label>
              <input value={form.pseudo} onChange={e => set('pseudo', e.target.value)} placeholder="lucas_d" required />
            </div>
            <div className="au-form-group">
              <label>Rôle *</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r].label} ({r})</option>)}
              </select>
            </div>
          </div>

          <div className="au-form-group">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="lucas@etudiant.fr" required />
          </div>

          <div className="au-form-group">
            <label>{isEdit ? 'Nouveau mot de passe' : 'Mot de passe *'} {isEdit && <span className="au-form-opt">(laisser vide = inchangé)</span>}</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          </div>

          <div className="au-form-row">
            <div className="au-form-group" key="telephone">
              <label>Téléphone</label>
              <input value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="06 00 00 00 00" />
            </div>
            {form.role === 'USER' && (
              <div className="au-form-group" key="classePromo">
                <label>Classe / Promo</label>
                <input value={form.classePromo} onChange={e => set('classePromo', e.target.value)} placeholder="MMI2" />
              </div>
            )}
            {form.role === 'PROF' && (
              <div className="au-form-group" key="matiere">
                <label>Matière enseignée</label>
                <input value={form.matiereEnseignee} onChange={e => set('matiereEnseignee', e.target.value)} placeholder="Web Design" />
              </div>
            )}
            {form.role === 'ADMIN' && (
              <div className="au-form-group" key="specialisation">
                <label>Spécialisation</label>
                <input value={form.specialisation} onChange={e => set('specialisation', e.target.value)} placeholder="Gestion" />
              </div>
            )}
          </div>
        </div>

        <div className="au-modal__footer">
          <button className="au-btn-cancel" onClick={onClose}>Annuler</button>
          <button
            className="au-btn-save"
            onClick={() => onSave(form, isEdit ? user.id : null)}
            disabled={saving || !form.prenom || !form.nom || !form.pseudo || !form.email || (!isEdit && !form.password)}
          >
            {saving
              ? <span className="au-spin" />
              : isEdit ? '✓ Enregistrer' : '+ Créer l\'utilisateur'
            }
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Modal confirmation suppression ─────────────────────── */
function ModalConfirmDelete({ user, onConfirm, onCancel, loading }) {
  if (!user) return null;
  return (
    <div className="au-overlay" onClick={onCancel}>
      <div className="au-modal au-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="au-modal__header">
          <div>
            <span className="au-modal__tag au-modal__tag--danger">Suppression</span>
            <p className="au-modal__sub">Cette action est irréversible</p>
          </div>
          <button className="au-modal__close" onClick={onCancel}>✕</button>
        </div>
        <div className="au-modal__body">
          <p className="au-confirm__text">
            Supprimer l'utilisateur <strong>{user.prenom} {user.nom}</strong> (@{user.pseudo}) ?<br />
            Tous ses projets et commentaires seront également supprimés.
          </p>
        </div>
        <div className="au-modal__footer">
          <button className="au-btn-cancel" onClick={onCancel}>Annuler</button>
          <button className="au-btn-delete" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="au-spin" /> : '✕ Supprimer définitivement'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page principale ─────────────────────────────────────── */
export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);

  // Filtres
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('TOUS');

  // Modals
  const [modalUser, setModalUser]     = useState(null);   // null | {} | user
  const [modalDelete, setModalDelete] = useState(null);   // null | user
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const token = localStorage.getItem('token');

  /* Vérif admin */
  useEffect(() => {
    if (localStorage.getItem('role') !== 'ADMIN') { navigate('/'); return; }
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers(FAKE_USERS))
      .finally(() => setLoading(false));
  };

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Créer / Modifier ── */
  const handleSave = async (form, userId) => {
    setSaving(true);
    const isEdit = !!userId;
    try {
      const url    = isEdit ? `${API_URL}/admin/users/${userId}` : `${API_URL}/admin/users`;
      const method = isEdit ? 'PUT' : 'POST';
      // Si edit et password vide, on le retire
      const body = { ...form };
      if (isEdit && !body.password) delete body.password;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const saved = await res.json().catch(() => null);
        if (isEdit) {
          setUsers(prev => prev.map(u => u.id === userId ? (saved || { ...u, ...form }) : u));
        } else {
          setUsers(prev => [...prev, saved || { id: Date.now(), ...form }]);
        }
        showToast(isEdit ? `✓ ${form.prenom} ${form.nom} mis à jour` : `✓ ${form.prenom} ${form.nom} créé`);
      } else {
        const err = await res.text().catch(() => '');
        showToast(`Erreur ${res.status} : ${err || 'impossible de sauvegarder'}`, 'ko');
      }
    } catch {
      showToast('Serveur inaccessible — mode démo', 'ko');
      // Démo local
      if (isEdit) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...form } : u));
      } else {
        setUsers(prev => [...prev, { id: Date.now(), ...form }]);
      }
      showToast(isEdit ? `✓ ${form.prenom} mis à jour (démo)` : `✓ ${form.prenom} créé (démo)`);
    } finally {
      setSaving(false);
      setModalUser(null);
    }
  };

  /* ── Supprimer ── */
  const handleDelete = async () => {
    if (!modalDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/admin/users/${modalDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setUsers(prev => prev.filter(u => u.id !== modalDelete.id));
        showToast(`✓ ${modalDelete.prenom} ${modalDelete.nom} supprimé`);
      } else {
        showToast(`Erreur ${res.status} lors de la suppression`, 'ko');
      }
    } catch {
      // Démo
      setUsers(prev => prev.filter(u => u.id !== modalDelete.id));
      showToast(`✓ ${modalDelete.prenom} supprimé (démo)`);
    } finally {
      setDeleting(false);
      setModalDelete(null);
    }
  };

  /* ── Filtrage ── */
  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'TOUS' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || u.nom.toLowerCase().includes(q)
      || u.prenom.toLowerCase().includes(q)
      || u.pseudo.toLowerCase().includes(q)
      || u.email.toLowerCase().includes(q)
      || (u.classePromo || '').toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const counts = {
    TOUS: users.length,
    USER:  users.filter(u => u.role === 'USER').length,
    PROF:  users.filter(u => u.role === 'PROF').length,
    ADMIN: users.filter(u => u.role === 'ADMIN').length,
  };

  return (
    <div className="au-page">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="au-hero">
        <div className="au-hero__grid" aria-hidden="true" />
        <div className="container au-hero__inner">
          <div className="au-hero__left">
            <span className="tag tag--accent">Administration</span>
            <h1 className="au-hero__title">Gestion des<br /><em>utilisateurs</em></h1>
            <p className="au-hero__sub">Créez, modifiez ou supprimez les comptes étudiants, profs et admins.</p>
          </div>
          <div className="au-stats">
            {[['TOUS','Total'], ['USER','Étudiants'], ['PROF','Profs'], ['ADMIN','Admins']].map(([k, label]) => (
              <div key={k} className={`au-stat au-stat--${k.toLowerCase()}`}>
                <span className="au-stat__num">{counts[k] ?? 0}</span>
                <span className="au-stat__label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contenu ───────────────────────────────────────── */}
      <main className="au-main container">

        {/* Barre : filtres + bouton créer */}
        <div className="au-toolbar">
          <div className="au-tabs">
            {['TOUS','USER','PROF','ADMIN'].map(k => (
              <button
                key={k}
                className={`au-tab ${roleFilter === k ? 'au-tab--active' : ''}`}
                onClick={() => setRoleFilter(k)}
              >
                {k === 'TOUS' ? 'Tous' : ROLE_META[k].label}
                <span className={`au-tab__count ${roleFilter === k ? 'au-tab__count--active' : ''}`}>
                  {counts[k]}
                </span>
              </button>
            ))}
          </div>
          <button className="au-btn-create" onClick={() => setModalUser({})}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 4v12M4 10h12"/>
            </svg>
            Créer un utilisateur
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="au-state"><span className="au-spinner" /><p>Chargement…</p></div>
        ) : (
          <div className="au-table-wrap">
            <table className="au-table">
              <thead>
                <tr>
                  {/* Colonnes filtrables */}
                  <th>
                    <span className="au-th-label">Nom</span>
                    <input
                      className="au-th-filter"
                      placeholder="Filtrer…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </th>
                  <th><span className="au-th-label">Pseudo</span></th>
                  <th><span className="au-th-label">Email</span></th>
                  <th><span className="au-th-label">Rôle</span></th>
                  <th><span className="au-th-label">Classe / Infos</span></th>
                  <th><span className="au-th-label">Téléphone</span></th>
                  <th className="au-th-actions"><span className="au-th-label">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="au-empty">
                      <span>📭</span> Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className="au-row">

                    {/* Nom + prénom */}
                    <td className="au-cell">
                      <div className="au-user-name">
                        <div
                          className="au-user-avatar"
                          style={{ background: ROLE_META[u.role]?.color + '22', color: ROLE_META[u.role]?.color }}
                        >
                          {u.prenom?.charAt(0)}{u.nom?.charAt(0)}
                        </div>
                        <div>
                          <span className="au-user-full">{u.prenom} {u.nom}</span>
                        </div>
                      </div>
                    </td>

                    {/* Pseudo */}
                    <td className="au-cell">
                      <span className="au-pseudo">@{u.pseudo}</span>
                    </td>

                    {/* Email */}
                    <td className="au-cell">
                      <a href={`mailto:${u.email}`} className="au-email">{u.email}</a>
                    </td>

                    {/* Rôle */}
                    <td className="au-cell">
                      <span
                        className="au-role-badge"
                        style={{
                          background: (ROLE_META[u.role]?.color ?? '#888') + '15',
                          color: ROLE_META[u.role]?.color ?? '#888',
                          borderColor: (ROLE_META[u.role]?.color ?? '#888') + '35',
                        }}
                      >
                        {ROLE_META[u.role]?.label ?? u.role}
                      </span>
                    </td>

                    {/* Infos contextuelles */}
                    <td className="au-cell au-cell--info">
                      {u.role === 'USER'  ? (u.classePromo      || <span className="au-muted">—</span>)
                     : u.role === 'PROF'  ? (u.matiereEnseignee || <span className="au-muted">—</span>)
                     : u.role === 'ADMIN' ? (u.specialisation   || <span className="au-muted">—</span>)
                     : <span className="au-muted">—</span>}
                    </td>

                    {/* Téléphone */}
                    <td className="au-cell au-cell--mono">
                      {u.telephone || <span className="au-muted">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="au-cell au-cell--actions">
                      <button
                        className="au-action au-action--edit"
                        onClick={() => setModalUser(u)}
                        title="Modifier"
                      >
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M13.5 3.5a2.12 2.12 0 0 1 3 3L6 17l-4 1 1-4 10.5-10.5z"/>
                        </svg>
                        Modifier
                      </button>
                      <button
                        className="au-action au-action--delete"
                        onClick={() => setModalDelete(u)}
                        title="Supprimer"
                      >
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12"/>
                        </svg>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Compteur résultats */}
        {!loading && (
          <p className="au-results">
            {filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
            {search && ` pour "${search}"`}
          </p>
        )}
      </main>

      <Footer />

      {/* ── Modals ──────────────────────────────────────────── */}
      {modalUser !== null && (
        <ModalUser
          user={modalUser?.id ? modalUser : null}
          onClose={() => setModalUser(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {modalDelete && (
        <ModalConfirmDelete
          user={modalDelete}
          onConfirm={handleDelete}
          onCancel={() => setModalDelete(null)}
          loading={deleting}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}