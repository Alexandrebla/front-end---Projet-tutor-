import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUpload from '../components/FileUpload';
import '../styles/Profil.css';

const API_URL = 'http://localhost:8080/api';
const MATIERES = ['WEB','UI','UX','TROIS_D','DESIGN','MULTIMEDIA','AUTRE'];

const STATUT_STYLES = {
  VALIDE:     { bg: 'rgba(77,255,180,0.1)', color: '#22c55e', label: 'Validé' },
  EN_ATTENTE: { bg: 'rgba(255,208,77,0.1)', color: '#fbbf24', label: 'En attente' },
  REJETE:     { bg: 'rgba(255,77,109,0.1)', color: '#ef4444', label: 'Rejeté' },
};
const ROLE_LABEL = { USER: 'Étudiant', PROF: 'Professeur', ADMIN: 'Administrateur' };

const EMPTY_FORM = {
  titre: '', description: '', matiere: 'WEB',
  competition: null,
  thumbnailUrl: '',
  fichiers: ['','',''],
  liens: ['','',''],
  equipe: [],
};

/* ── Titres prédéfinis pour les liens profil ─────────────── */
const LIEN_PRESETS = [
  { label: 'Portfolio',  icon: '🌐' },
  { label: 'GitHub',     icon: '🐙' },
  { label: 'LinkedIn',   icon: '💼' },
  { label: 'Behance',    icon: '🎨' },
  { label: 'Instagram',  icon: '📸' },
  { label: 'Dribbble',   icon: '🏀' },
  { label: 'YouTube',    icon: '▶️' },
  { label: 'Twitter',    icon: '🐦' },
  { label: 'Autre',      icon: '🔗' },
];

function getLienIcon(titre) {
  if (!titre) return '🔗';
  const t = titre.toLowerCase();
  if (t.includes('github'))    return '🐙';
  if (t.includes('linkedin'))  return '💼';
  if (t.includes('behance'))   return '🎨';
  if (t.includes('instagram')) return '📸';
  if (t.includes('dribbble'))  return '🏀';
  if (t.includes('youtube'))   return '▶️';
  if (t.includes('twitter') || t.includes('x.com')) return '🐦';
  if (t.includes('portfolio') || t.includes('site')) return '🌐';
  if (t.includes('figma'))     return '🖼️';
  if (t.includes('notion'))    return '📝';
  return '🔗';
}

const EMPTY_LIEN_PROFIL = { titre: '', url: '' };


/* ── Avatars par défaut ──────────────────────────────── */
const AVATAR_PRESETS = [
  { id: 'cat',     emoji: '🐱' },
  { id: 'fox',     emoji: '🦊' },
  { id: 'bear',    emoji: '🐻' },
  { id: 'wolf',    emoji: '🐺' },
  { id: 'owl',     emoji: '🦉' },
  { id: 'penguin', emoji: '🐧' },
  { id: 'tiger',   emoji: '🐯' },
  { id: 'lion',    emoji: '🦁' },
  { id: 'frog',    emoji: '🐸' },
  { id: 'koala',   emoji: '🐨' },
  { id: 'panda',   emoji: '🐼' },
  { id: 'bunny',   emoji: '🐰' },
];

const AVATAR_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const AVATAR_MAX_SIZE   = 2 * 1024 * 1024; // 2 Mo

/* ── Steps ───────────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: 'Infos'    },
  { num: 2, label: 'Médias'   },
  { num: 3, label: 'Liens'    },
  { num: 4, label: 'Équipe'   },
  { num: 5, label: 'Récap'    },
];

/* ── StepIndicator ───────────────────────────────────────── */
function StepIndicator({ step }) {
  return (
    <div className="wizard-steps">
      {STEPS.map((s, i) => (
        <div key={s.num} className={`wizard-step ${step === s.num ? 'wizard-step--active' : ''} ${step > s.num ? 'wizard-step--done' : ''}`}>
          <div className="wizard-step__bubble">
            {step > s.num
              ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
              : s.num}
          </div>
          <span className="wizard-step__label">{s.label}</span>
          {i < STEPS.length - 1 && <div className="wizard-step__line" />}
        </div>
      ))}
    </div>
  );
}

/* ── RecapRow ────────────────────────────────────────────── */
function RecapRow({ label, value, muted }) {
  if (!value) return null;
  return (
    <div className="recap-row">
      <span className="recap-row__label">{label}</span>
      <span className={`recap-row__value${muted ? ' recap-row__value--muted' : ''}`}>{value}</span>
    </div>
  );
}


function AvatarDisplay({ user, initiales, size = 'md' }) {
  const cls = `profil-avatar profil-avatar--${size}`;
  if (user?.avatarType === 'image' && user?.avatarValue) {
    return (
      <div className={cls + ' profil-avatar--img'}>
        <img src={user.avatarValue.startsWith('http') ? user.avatarValue : `http://localhost:8080${user.avatarValue}`}
          alt="avatar" />
      </div>
    );
  }
  if (user?.avatarType === 'emoji' && user?.avatarValue) {
    return <div className={cls + ' profil-avatar--emoji'}>{user.avatarValue}</div>;
  }
  return <div className={cls}>{initiales}</div>;
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════════════ */
export default function Profil() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const myId     = localStorage.getItem('userId');

  const [user, setUser]         = useState(null);
  const [projets, setProjets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [formUser, setFormUser] = useState({});
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState('');

  /* Modal */
  const [showModal, setShowModal]       = useState(false);
  const [editProjet, setEditProjet]     = useState(null);
  const [projetForm, setProjetForm]     = useState(EMPTY_FORM);
  const [projetSaving, setProjetSaving] = useState(false);
  const [wizardStep, setWizardStep]     = useState(1);

  /* Avatar */
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarSaving, setAvatarSaving]         = useState(false);
  const [avatarError, setAvatarError]           = useState('');

  /* Liens profil */
  const [liensProfilEdit, setLiensProfilEdit] = useState(false);
  const [liensProfilForm, setLiensProfilForm] = useState([]);
  const [liensProfilSaving, setLiensProfilSaving] = useState(false);

  /* Recherche équipe */
  const [equipeSearch, setEquipeSearch]   = useState('');
  const [equipeResults, setEquipeResults] = useState([]);
  const [equipeSearching, setEquipeSearching] = useState(false);

  /* Archives */
  const [archives, setArchives]         = useState({ notifs: [], likes: [], commentaires: [] });
  const [archivesTab, setArchivesTab]   = useState('notifs');
  const [archivesLoading, setArchivesLoading] = useState(false);
  const [archivesLoaded, setArchivesLoaded]   = useState(false);

  /* -- Fetch data -- */
  const loadArchives = async () => {
    if (archivesLoaded) return;
    setArchivesLoading(true);
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [rNotifs, rLikes, rComms] = await Promise.all([
        fetch(`${API_URL}/notifications`,          { headers: h }),
        fetch(`${API_URL}/projets/mes-likes`,      { headers: h }),
        fetch(`${API_URL}/users/mes-commentaires`, { headers: h }),
      ]);
      setArchives({
        notifs:       rNotifs.ok ? await rNotifs.json() : [],
        likes:        rLikes.ok  ? await rLikes.json()  : [],
        commentaires: rComms.ok  ? await rComms.json()  : [],
      });
      setArchivesLoaded(true);
    } catch (err) { console.error('[Archives]', err); }
    finally { setArchivesLoading(false); }
  };

  const reloadProjets = async () => {
    try {
      const res = await fetch(`${API_URL}/projets/mes-projets`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setProjets(await res.json());
    } catch (err) { console.error('[Profil] Erreur rechargement projets :', err); }
  };

  useEffect(() => {
    if (!token) { navigate('/connexion'); return; }
    Promise.all([
      fetch(`${API_URL}/users/me`,            { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/projets/mes-projets`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([r1, r2]) => {
        if (!r1.ok) throw new Error(`/users/me => ${r1.status}`);
        const u = await r1.json();
        const p = r2.ok ? await r2.json() : [];
        setUser(u);
        setFormUser({ nom: u.nom, prenom: u.prenom, pseudo: u.pseudo, telephone: u.telephone || '', adresse: u.adresse || '' });
        setLiensProfilForm((u.liensProfilJson ? JSON.parse(u.liensProfilJson) : []).concat(
          Array(Math.max(0, 0)).fill(EMPTY_LIEN_PROFIL)
        ));
        setProjets(p);
      })
      .catch(err => { console.error('[Profil] Erreur chargement :', err); })
      .finally(() => setLoading(false));
  }, [token]);

  /* ── Save profile ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res     = await fetch(`${API_URL}/users/me`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formUser) });
      const updated = res.ok ? await res.json() : { ...user, ...formUser };
      setUser(updated); localStorage.setItem('pseudo', updated.pseudo);
      setSaveMsg('Profil mis à jour ✓'); setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Profil mis à jour ✓'); setEditing(false); setTimeout(() => setSaveMsg(''), 3000);
    } finally { setSaving(false); }
  };

  /* ── Avatar ── */
  const handleAvatarPreset = async (emoji) => {
    setAvatarSaving(true); setAvatarError('');
    try {
      const res = await fetch(`${API_URL}/users/me/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ avatarType: 'emoji', avatarValue: emoji }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setShowAvatarPicker(false);
      }
    } catch {}
    setAvatarSaving(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError('');
    e.target.value = '';

    const ext = file.name.split('.').pop().toLowerCase();
    if (!AVATAR_EXTENSIONS.includes(ext)) {
      setAvatarError(`Format non supporté. Utilisez : ${AVATAR_EXTENSIONS.join(', ')}`);
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      setAvatarError('Fichier trop lourd. Maximum 2 Mo.');
      return;
    }

    setAvatarSaving(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/upload/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) { setAvatarError('Erreur lors de lupload.'); return; }
      const { url } = await res.json();

      const res2 = await fetch(`${API_URL}/users/me/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ avatarType: 'image', avatarValue: url }),
      });
      if (res2.ok) {
        setUser(await res2.json());
        setShowAvatarPicker(false);
      }
    } catch { setAvatarError('Impossible de joindre le serveur.'); }
    setAvatarSaving(false);
  };

  /* ── Save liens profil ── */
  const handleSaveLiensProfil = async () => {
    setLiensProfilSaving(true);
    const liensValides = liensProfilForm.filter(l => l.titre && l.url);
    try {
      const res = await fetch(`${API_URL}/users/me/liens`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(liensValides),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setLiensProfilForm(liensValides);
      }
    } catch {}
    setLiensProfilEdit(false);
    setLiensProfilSaving(false);
  };

  const addLienProfil = () => {
    if (liensProfilForm.length < 4) setLiensProfilForm(f => [...f, { ...EMPTY_LIEN_PROFIL }]);
  };

  const removeLienProfil = (i) => {
    setLiensProfilForm(f => f.filter((_, idx) => idx !== i));
  };

  const updateLienProfil = (i, field, val) => {
    setLiensProfilForm(f => f.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  };

  /* ── Delete projet ── */
  const handleDeleteProjet = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    try {
      await fetch(`${API_URL}/projets/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      await reloadProjets();
    } catch { setProjets(prev => prev.filter(p => p.id !== id)); }
  };

  /* ── Submit projet ── */
  const handleProjetSubmit = async () => {
    setProjetSaving(true);
    try {
      const method = editProjet ? 'PUT' : 'POST';
      const url    = editProjet ? `${API_URL}/projets/${editProjet.id}` : `${API_URL}/projets`;

      // Construire le payload
      const payload = {
        titre:        projetForm.titre,
        description:  projetForm.description,
        matiere:      projetForm.matiere,
        competition:  projetForm.competition,
        thumbnailUrl: projetForm.thumbnailUrl,
        fichierUrl:   projetForm.fichiers.find(f => f) || '',      // premier fichier non vide (compat backend)
        fichiersUrls: projetForm.fichiers.filter(f => f),          // tous les fichiers
        urlMedia:     projetForm.liens[0] || '',                   // premier lien (compat backend)
        liensUrls:    projetForm.liens.filter(l => l),             // tous les liens
        equipeIds:    projetForm.equipe.map(m => m.id),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { alert(`Erreur ${res.status}`); return; }

      // Notifier les membres de l'équipe ajoutés
      if (projetForm.equipe.length > 0) {
        const savedProjet = await res.clone().json().catch(() => null);
        if (savedProjet?.id) {
          projetForm.equipe.forEach(membre => {
            fetch(`${API_URL}/notifications/equipe`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ membreId: membre.id, projetId: savedProjet.id, projetTitre: projetForm.titre }),
            }).catch(() => {});
          });
        }
      }

      await reloadProjets();
      closeModal();
    } catch { alert('Impossible de joindre le serveur.'); }
    finally { setProjetSaving(false); }
  };

  /* ── Recherche étudiants ── */
  useEffect(() => {
    if (equipeSearch.trim().length < 2) { setEquipeResults([]); return; }
    setEquipeSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(equipeSearch)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const all = await res.json();
          // Exclure soi-même et déjà ajoutés
          const added = projetForm.equipe.map(m => m.id);
          setEquipeResults(all.filter(u => String(u.id) !== String(myId) && !added.includes(u.id)));
        }
      } catch {
        setEquipeResults([]);
      } finally { setEquipeSearching(false); }
    }, 350);
    return () => clearTimeout(timer);
  }, [equipeSearch, projetForm.equipe]);

  /* ── Helpers modal ── */
  const openEdit = (p) => {
    setEditProjet(p);
    setProjetForm({
      titre: p.titre, description: p.description || '', matiere: p.matiere || 'WEB',
      competition: p.competition ?? null,
      thumbnailUrl: p.thumbnailUrl || '',
      fichiers: [p.fichierUrl || '', '', ''],
      liens: [p.urlMedia || '', '', ''],
      equipe: p.equipe || [],
    });
    setWizardStep(1); setShowModal(true);
  };

  const openNew = () => {
    setEditProjet(null); setProjetForm(EMPTY_FORM);
    setWizardStep(1); setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); setEditProjet(null);
    setProjetForm(EMPTY_FORM); setWizardStep(1);
    setEquipeSearch(''); setEquipeResults([]);
  };

  /* ── Helpers fichiers/liens ── */
  const setFichier = (i, url) => {
    const next = [...projetForm.fichiers];
    next[i] = url;
    setProjetForm(f => ({ ...f, fichiers: next }));
  };

  const setLien = (i, val) => {
    const next = [...projetForm.liens];
    next[i] = val;
    setProjetForm(f => ({ ...f, liens: next }));
  };

  const addMembreEquipe = (membre) => {
    setProjetForm(f => ({ ...f, equipe: [...f.equipe, membre] }));
    setEquipeSearch(''); setEquipeResults([]);
  };

  const removeMembreEquipe = (id) => {
    setProjetForm(f => ({ ...f, equipe: f.equipe.filter(m => m.id !== id) }));
  };

  const canGoNext1 = projetForm.titre.trim().length > 0 && projetForm.competition !== null;
  const totalSteps = STEPS.length;

  /* ── Loading ── */
  if (loading) return (
    <div className="profil-page"><Navbar /><div className="profil-loading"><span className="spinner" /><p>Chargement…</p></div></div>
  );

  const initiales  = `${user?.prenom?.charAt(0) || ''}${user?.nom?.charAt(0) || ''}`;
  const totalLikes = projets.reduce((acc, p) => acc + (p.likes ?? 0), 0);
  const nbValides  = projets.filter(p => p.statut === 'VALIDE').length;

  return (
    <div className="profil-page">
      <Navbar />

      <div className="profil-wrap">
        <div className="profil-layout">

          {/* ══ SIDEBAR ══ */}
          <aside className="profil-sidebar">

            {/* Identité */}
            <div className="profil-card profil-card--identity">
              <div className="avatar-wrapper">
                <AvatarDisplay user={user} initiales={initiales} />
                <button className="avatar-edit-btn" onClick={() => { setShowAvatarPicker(true); setAvatarError(''); }} title="Changer la photo de profil">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </button>
              </div>
              <h1 className="profil-name">{user?.prenom} {user?.nom}</h1>
              <span className="profil-pseudo">@{user?.pseudo}</span>
              <div className="profil-badges">
                <span className="tag tag--role">{ROLE_LABEL[user?.role] || user?.role}</span>
                {user?.classePromo && <span className="tag">{user.classePromo}</span>}
              </div>
            </div>

            {/* Liens profil */}
            <div className="profil-card">
              <div className="profil-card__head">
                <h2 className="profil-card__title">Liens</h2>
                {!liensProfilEdit
                  ? <button className="btn-ghost btn-ghost--sm" onClick={() => { setLiensProfilEdit(true); if (liensProfilForm.length === 0) addLienProfil(); }}>
                      {liensProfilForm.filter(l=>l.titre&&l.url).length === 0 ? '+ Ajouter' : 'Modifier'}
                    </button>
                  : <button className="btn-ghost btn-ghost--sm" onClick={() => setLiensProfilEdit(false)}>Annuler</button>
                }
              </div>

              {/* Mode affichage */}
              {!liensProfilEdit && (
                liensProfilForm.filter(l => l.titre && l.url).length === 0 ? (
                  <p className="liens-profil__empty">Aucun lien ajouté — cliquez sur Ajouter</p>
                ) : (
                  <div className="liens-profil__list">
                    {liensProfilForm.filter(l => l.titre && l.url).map((lien, i) => (
                      <a key={i} href={lien.url} target="_blank" rel="noopener noreferrer" className="lien-profil-item">
                        <span className="lien-profil-item__icon">{getLienIcon(lien.titre)}</span>
                        <span className="lien-profil-item__label">{lien.titre}</span>
                        <svg className="lien-profil-item__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
                      </a>
                    ))}
                  </div>
                )
              )}

              {/* Mode édition */}
              {liensProfilEdit && (
                <div className="liens-profil__edit">
                  {liensProfilForm.map((lien, i) => (
                    <div key={i} className="lien-edit-row">
                      {/* Sélecteur titre avec icône auto */}
                      <div className="lien-edit-titre">
                        <span className="lien-edit-icon">{getLienIcon(lien.titre)}</span>
                        <select
                          className="form-input form-input--sm"
                          value={LIEN_PRESETS.some(p => p.label === lien.titre) ? lien.titre : 'Autre'}
                          onChange={e => updateLienProfil(i, 'titre', e.target.value)}
                        >
                          <option value="">— Choisir —</option>
                          {LIEN_PRESETS.map(p => (
                            <option key={p.label} value={p.label}>{p.icon} {p.label}</option>
                          ))}
                        </select>
                      </div>
                      {/* URL */}
                      <input
                        type="url"
                        className="form-input form-input--sm"
                        value={lien.url}
                        onChange={e => updateLienProfil(i, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                      <button type="button" className="lien-edit-remove" onClick={() => removeLienProfil(i)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}

                  <div className="liens-profil__footer">
                    {liensProfilForm.length < 4 && (
                      <button type="button" className="btn-ghost btn-ghost--sm" onClick={addLienProfil}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                        Ajouter un lien
                      </button>
                    )}
                    <button type="button" className="btn-accent" onClick={handleSaveLiensProfil} disabled={liensProfilSaving}>
                      {liensProfilSaving ? <span className="btn-spinner" /> : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="profil-card">
              <div className="profil-card__head">
                <h2 className="profil-card__title">Informations</h2>
                {!editing
                  ? <button className="btn-ghost btn-ghost--sm" onClick={() => setEditing(true)}>Modifier</button>
                  : <button className="btn-ghost btn-ghost--sm" onClick={() => { setEditing(false); setFormUser({ nom: user.nom, prenom: user.prenom, pseudo: user.pseudo, telephone: user.telephone||'', adresse: user.adresse||'' }); }}>Annuler</button>
                }
              </div>
              {saveMsg && <div className="profil-save-msg">{saveMsg}</div>}
              <div className="settings-form">
                <div className="settings-row">
                  <div className="form-group"><label className="form-label">Prénom</label><input type="text" className="form-input" value={formUser.prenom || ''} onChange={e => setFormUser({...formUser, prenom: e.target.value})} disabled={!editing} /></div>
                  <div className="form-group"><label className="form-label">Nom</label><input type="text" className="form-input" value={formUser.nom || ''} onChange={e => setFormUser({...formUser, nom: e.target.value})} disabled={!editing} /></div>
                </div>
                <div className="form-group"><label className="form-label">Pseudo</label><input type="text" className="form-input" value={formUser.pseudo || ''} onChange={e => setFormUser({...formUser, pseudo: e.target.value})} disabled={!editing} /></div>
                <div className="form-group"><label className="form-label">Email <span className="form-label--opt">(non modifiable)</span></label><input type="email" className="form-input" value={user?.email || ''} disabled /></div>
                <div className="form-group"><label className="form-label">Téléphone</label><input type="text" className="form-input" value={formUser.telephone || ''} onChange={e => setFormUser({...formUser, telephone: e.target.value})} disabled={!editing} placeholder="06 …" /></div>
                <div className="form-group"><label className="form-label">Adresse</label><input type="text" className="form-input" value={formUser.adresse || ''} onChange={e => setFormUser({...formUser, adresse: e.target.value})} disabled={!editing} placeholder="Ville…" /></div>
                {editing && <button className="btn-accent" onClick={handleSave} disabled={saving}>{saving ? <span className="btn-spinner" /> : 'Enregistrer'}</button>}
              </div>
            </div>
          </aside>

          {/* ══ MAIN PROJETS ══ */}
          <main className="profil-main">

            {/* Stats au-dessus des projets */}
            <div className="profil-stats-grid profil-stats-grid--main">
              <div className="profil-stat"><span className="profil-stat__num">{projets.length}</span><span className="profil-stat__label">Projets</span></div>
              <div className="profil-stat"><span className="profil-stat__num">{nbValides}</span><span className="profil-stat__label">Validés</span></div>
              <div className="profil-stat"><span className="profil-stat__num">{totalLikes}</span><span className="profil-stat__label">Likes reçus</span></div>
              <div className="profil-stat"><span className="profil-stat__num">{projets.filter(p=>p.competition).length}</span><span className="profil-stat__label">Compétitions</span></div>
            </div>

            <div className="profil-main__head">
              <h2 className="profil-main__title">Mes projets</h2>
              <button className="btn-accent" onClick={openNew}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Nouveau projet
              </button>
            </div>

            {projets.length === 0 ? (
              <div className="profil-empty"><div className="profil-empty__icon">📁</div><p>Vous n'avez pas encore de projets.</p><button className="btn-accent" onClick={openNew}>Créer mon premier projet</button></div>
            ) : (
              <ul className="mes-projets">
                {projets.map(p => {
                  const st    = STATUT_STYLES[p.statut] || STATUT_STYLES.EN_ATTENTE;
                  const thumb = p.thumbnailUrl ? `http://localhost:8080${p.thumbnailUrl}` : null;
                  return (
                    <li key={p.id} className="mes-projets__item">
                      <div className="mes-projets__thumb" onClick={() => navigate(`/projets/${p.id}`)}>
                        {thumb ? <img src={thumb} alt={p.titre} /> : <span>{p.titre.charAt(0)}</span>}
                      </div>
                      <div className="mes-projets__body">
                        <Link to={`/projets/${p.id}`} className="mes-projets__title">{p.titre}</Link>
                        <div className="mes-projets__meta">
                          <span className="tag">{p.matiere}</span>
                          <span className="mes-projets__statut" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                          {p.competition && <span className="tag tag--competition">🏆 Compétition</span>}
                        </div>
                      </div>
                      <div className="mes-projets__likes">♥ {p.likes ?? 0}</div>
                      <div className="mes-projets__actions">
                        <button className="icon-btn" onClick={() => openEdit(p)} title="Modifier">✎</button>
                        <button className="icon-btn icon-btn--danger" onClick={() => handleDeleteProjet(p.id)} title="Supprimer">✕</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* ══ ARCHIVES ══ */}
            <div className="archives-section">
              <button className="archives-toggle" onClick={loadArchives}>
                <div className="archives-toggle__left">
                  <span className="archives-toggle__icon">🗂</span>
                  <div>
                    <span className="archives-toggle__title">Archives personnelles</span>
                    <span className="archives-toggle__sub">Notifications · Projets likés · Commentaires</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={archivesLoaded ? 'archives-toggle__chevron archives-toggle__chevron--open' : 'archives-toggle__chevron'}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {archivesLoaded && (
                <div className="archives-body">
                  <div className="archives-tabs">
                    {[
                      { key: 'notifs',       label: 'Notifications', count: archives.notifs.length },
                      { key: 'likes',        label: 'Projets likés', count: archives.likes.length },
                      { key: 'commentaires', label: 'Commentaires',  count: archives.commentaires.length },
                    ].map(t => (
                      <button key={t.key}
                        className={`archives-tab ${archivesTab === t.key ? 'archives-tab--active' : ''}`}
                        onClick={() => setArchivesTab(t.key)}>
                        {t.label}
                        <span className="archives-tab__count">{t.count}</span>
                      </button>
                    ))}
                  </div>

                  {archivesLoading && <div className="archives-loading"><span className="spinner" /></div>}

                  {/* Notifications */}
                  {archivesTab === 'notifs' && !archivesLoading && (
                    archives.notifs.length === 0
                      ? <p className="archives-empty">Aucune notification.</p>
                      : <ul className="archives-list">
                          {archives.notifs.map(n => (
                            <li key={n.id} className={`archives-notif ${n.lu ? '' : 'archives-notif--unread'}`}>
                              <div className={`archives-notif__dot archives-notif__dot--${
                                n.type === 'PROJET_VALIDE' ? 'green' :
                                n.type === 'PROJET_REJETE' ? 'red'   :
                                n.type === 'EQUIPE'        ? 'lime'  :
                                n.type === 'SIGNALEMENT'   ? 'amber' : 'blue'
                              }`} />
                              <div className="archives-notif__body">
                                <span className="archives-notif__titre">{n.titre}</span>
                                <p className="archives-notif__msg">{n.message}</p>
                                <span className="archives-notif__date">
                                  {n.dateHeure ? new Date(n.dateHeure).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }) : ''}
                                </span>
                              </div>
                              {n.projetId && (
                                <Link to={`/projets/${n.projetId}`} className="archives-notif__link">Voir →</Link>
                              )}
                            </li>
                          ))}
                        </ul>
                  )}

                  {/* Projets likés */}
                  {archivesTab === 'likes' && !archivesLoading && (
                    archives.likes.length === 0
                      ? <p className="archives-empty">Vous n'avez encore liké aucun projet.</p>
                      : <ul className="archives-list">
                          {archives.likes.map(p => {
                            const thumb = p.thumbnailUrl ? `http://localhost:8080${p.thumbnailUrl}` : null;
                            return (
                              <li key={p.id} className="archives-like">
                                <div className="archives-like__thumb">
                                  {thumb ? <img src={thumb} alt={p.titre} /> : <span>{p.titre?.charAt(0)}</span>}
                                </div>
                                <div className="archives-like__body">
                                  <Link to={`/projets/${p.id}`} className="archives-like__title">{p.titre}</Link>
                                  <span className="archives-like__meta">{p.matiere} · @{p.auteur?.pseudo}</span>
                                </div>
                                <span className="archives-like__hearts">♥ {p.likes}</span>
                              </li>
                            );
                          })}
                        </ul>
                  )}

                  {/* Commentaires */}
                  {archivesTab === 'commentaires' && !archivesLoading && (
                    archives.commentaires.length === 0
                      ? <p className="archives-empty">Vous n'avez encore posté aucun commentaire.</p>
                      : <ul className="archives-list">
                          {archives.commentaires.map(com => (
                            <li key={com.id} className="archives-com">
                              <div className="archives-com__head">
                                <span className="archives-com__titre">{com.titre}</span>
                                {com.projet && (
                                  <Link to={`/projets/${com.projet.id}`} className="archives-com__projet">
                                    📁 {com.projet.titre}
                                  </Link>
                                )}
                                <span className="archives-com__date">
                                  {com.dateHeure ? new Date(com.dateHeure).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' }) : ''}
                                </span>
                              </div>
                              <p className="archives-com__contenu">{com.contenu}</p>
                            </li>
                          ))}
                        </ul>
                  )}
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {/* ══ MODAL AVATAR PICKER ══ */}
      {showAvatarPicker && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAvatarPicker(false)}>
          <div className="modal avatar-modal">
            <div className="modal__header">
              <div className="modal__header-left">
                <h2>Photo de profil</h2>
              </div>
              <button className="modal__close" onClick={() => setShowAvatarPicker(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="avatar-modal__body">
              {avatarError && <div className="avatar-error">{avatarError}</div>}

              {/* ── MODE SÉLECTION ── */}
              <>

                  {/* Avatar actuel — toujours affiché */}
                  <div className="avatar-current">
                    <p className="avatar-section__label">Avatar actuel</p>
                    <div className="avatar-current__wrap">
                      {user?.avatarType === 'image' && user?.avatarValue ? (
                        <div className="avatar-current__preview">
                          <img
                            src={user.avatarValue.startsWith('http') ? user.avatarValue : `http://localhost:8080${user.avatarValue}`}
                            alt="avatar actuel"
                          />
                        </div>
                      ) : user?.avatarType === 'emoji' && user?.avatarValue ? (
                        <div className="avatar-current__emoji">{user.avatarValue}</div>
                      ) : (
                        <div className="avatar-current__initiales">{initiales}</div>
                      )}
                      <div className="avatar-current__info">
                        <span className="avatar-current__type">
                          {user?.avatarType === 'image'  ? '📷 Photo personnalisée' :
                           user?.avatarType === 'emoji'  ? '🎨 Icône sélectionnée'  :
                                                           '✏️ Initiales (par défaut)'}
                        </span>
                        <span className="avatar-current__hint">Choisissez une nouvelle option ci-dessous</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload */}
                  <div className="avatar-section">
                    <p className="avatar-section__label">📤 Votre photo</p>
                    <label className="avatar-upload-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Importer une image
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" style={{ display:'none' }} onChange={handleAvatarUpload} />
                    </label>
                    <p className="avatar-hint">jpg, png, webp, gif · max 2 Mo</p>
                  </div>

                  <div className="avatar-divider"><span>ou choisissez une icône</span></div>

                  <div className="avatar-grid">
                    {AVATAR_PRESETS.map(p => (
                      <button
                        key={p.id}
                        className={`avatar-preset ${user?.avatarType === 'emoji' && user?.avatarValue === p.emoji ? 'avatar-preset--active' : ''}`}
                        onClick={() => handleAvatarPreset(p.emoji)}
                        disabled={avatarSaving}
                        title={p.id}
                      >
                        {p.emoji}
                      </button>
                    ))}
                  </div>

                  {(user?.avatarType === 'emoji' || user?.avatarType === 'image') && (
                    <button className="btn-ghost btn-ghost--sm avatar-reset" onClick={() => handleAvatarPreset('')}>
                      Revenir aux initiales
                    </button>
                  )}
              </>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL WIZARD 5 ÉTAPES
      ══════════════════════════════════════════ */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal modal--wizard">

            {/* Header */}
            <div className="modal__header">
              <div className="modal__header-left">
                <h2 className="modal__title">{editProjet ? 'Modifier le projet' : 'Nouveau projet'}</h2>
                <p className="modal__subtitle">
                  {wizardStep === 1 && 'Décrivez votre projet'}
                  {wizardStep === 2 && 'Ajoutez vos fichiers'}
                  {wizardStep === 3 && 'Ajoutez vos liens'}
                  {wizardStep === 4 && 'Constituez votre équipe'}
                  {wizardStep === 5 && 'Vérifiez avant de publier'}
                </p>
              </div>
              <button className="modal__close" onClick={closeModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Stepper */}
            <div className="modal__stepper"><StepIndicator step={wizardStep} /></div>

            {/* Body */}
            <div className="modal__body">

              {/* ── ÉTAPE 1 : Infos + compétition + miniature ── */}
              {wizardStep === 1 && (
                <div className="wizard-page" key="step1">

                  <div className="form-group">
                    <label className="form-label">Titre du projet <span className="form-label--required">*</span></label>
                    <input type="text" className="form-input form-input--lg" value={projetForm.titre}
                      onChange={e => setProjetForm({...projetForm, titre: e.target.value})}
                      placeholder="Ex : Portfolio interactif, Maquette UX…" autoFocus />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Matière</label>
                    <div className="matiere-grid">
                      {MATIERES.map(m => (
                        <button key={m} type="button"
                          className={`matiere-chip ${projetForm.matiere === m ? 'matiere-chip--active' : ''}`}
                          onClick={() => setProjetForm({...projetForm, matiere: m})}>{m}</button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description <span className="form-label--opt">(optionnel)</span></label>
                    <textarea className="form-input form-textarea" value={projetForm.description}
                      onChange={e => setProjetForm({...projetForm, description: e.target.value})}
                      rows={3} placeholder="Décrivez votre projet, les outils utilisés, la démarche…" />
                  </div>

                  {/* Compétition */}
                  <div className="form-group">
                    <label className="form-label">
                      Votre projet est-il en compétition ou le sera-t-il ?
                      <span className="form-label--required"> *</span>
                    </label>
                    <div className="competition-choice">
                      <button type="button"
                        className={`competition-btn ${projetForm.competition === true ? 'competition-btn--yes' : ''}`}
                        onClick={() => setProjetForm({...projetForm, competition: true})}>
                        <span className="competition-btn__icon">🏆</span>
                        <span className="competition-btn__label">Oui</span>
                        <span className="competition-btn__hint">Ce projet participe ou participera à une compétition</span>
                      </button>
                      <button type="button"
                        className={`competition-btn ${projetForm.competition === false ? 'competition-btn--no' : ''}`}
                        onClick={() => setProjetForm({...projetForm, competition: false})}>
                        <span className="competition-btn__icon">📚</span>
                        <span className="competition-btn__label">Non</span>
                        <span className="competition-btn__hint">Projet personnel ou scolaire hors compétition</span>
                      </button>
                    </div>
                  </div>

                  {/* Miniature */}
                  <div className="form-group">
                    <label className="form-label">
                      Miniature
                      <span className="form-label--opt"> jpg, png, webp · max 5 Mo</span>
                    </label>
                    <FileUpload type="thumbnail" token={token} currentUrl={projetForm.thumbnailUrl}
                      onUploaded={url => setProjetForm(f => ({ ...f, thumbnailUrl: url || '' }))}
                      disabled={projetSaving} />
                  </div>

                </div>
              )}

              {/* ── ÉTAPE 2 : Fichiers (3 max) ── */}
              {wizardStep === 2 && (
                <div className="wizard-page" key="step2">
                  <div className="step-intro">
                    <p className="step-intro__text">Ajoutez jusqu'à <strong>3 fichiers</strong> à votre projet (pdf, mp4, glb, gltf, png, jpg — max 50 Mo chacun).</p>
                  </div>
                  <div className="fichiers-list">
                    {projetForm.fichiers.map((f, i) => (
                      <div key={i} className={`fichier-slot ${!f && i > 0 && !projetForm.fichiers[i-1] ? 'fichier-slot--disabled' : ''}`}>
                        <div className="fichier-slot__head">
                          <div className="fichier-slot__num">{i + 1}</div>
                          <div>
                            <h3 className="fichier-slot__title">Fichier {i + 1}{i === 0 ? ' (principal)' : ' (optionnel)'}</h3>
                            <p className="fichier-slot__hint">pdf · mp4 · glb · gltf · png · jpg</p>
                          </div>
                          {f && (
                            <button type="button" className="fichier-slot__remove" onClick={() => setFichier(i, '')}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                          )}
                        </div>
                        <FileUpload type="fichier" token={token} currentUrl={f}
                          onUploaded={url => setFichier(i, url || '')}
                          disabled={projetSaving || (!f && i > 0 && !projetForm.fichiers[i-1])} />
                      </div>
                    ))}
                  </div>
                  <p className="media-skip-hint">Ces champs sont optionnels — vous pouvez les ajouter plus tard.</p>
                </div>
              )}

              {/* ── ÉTAPE 3 : Liens (3 max) ── */}
              {wizardStep === 3 && (
                <div className="wizard-page" key="step3">
                  <div className="step-intro">
                    <p className="step-intro__text">Ajoutez jusqu'à <strong>3 liens</strong> vers votre projet (site web, Figma, GitHub, Behance…).</p>
                  </div>
                  <div className="liens-list">
                    {projetForm.liens.map((lien, i) => (
                      <div key={i} className="lien-slot">
                        <div className="lien-slot__num">{i + 1}</div>
                        <div className="lien-slot__input">
                          <svg className="lien-slot__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                          </svg>
                          <input type="url" className="form-input form-input--icon"
                            value={lien}
                            onChange={e => setLien(i, e.target.value)}
                            placeholder={
                              i === 0 ? 'https://mon-projet.fr' :
                              i === 1 ? 'https://figma.com/...' :
                              'https://github.com/...'
                            }
                            disabled={i > 0 && !projetForm.liens[i-1]}
                          />
                          {lien && (
                            <button type="button" className="lien-slot__clear" onClick={() => setLien(i, '')}>✕</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="media-skip-hint">Ces champs sont optionnels.</p>
                </div>
              )}

              {/* ── ÉTAPE 4 : Équipe ── */}
              {wizardStep === 4 && (
                <div className="wizard-page" key="step4">
                  <div className="step-intro">
                    <p className="step-intro__text">Ce projet a-t-il été réalisé en équipe ? Recherchez et ajoutez vos coéquipiers — ils recevront une notification.</p>
                  </div>

                  {/* Membres déjà ajoutés */}
                  {projetForm.equipe.length > 0 && (
                    <div className="equipe-membres">
                      <p className="equipe-membres__label">Membres ajoutés</p>
                      <div className="equipe-tags">
                        {projetForm.equipe.map(m => (
                          <div key={m.id} className="equipe-tag">
                            <div className="equipe-tag__avatar">{m.prenom?.charAt(0)}{m.nom?.charAt(0)}</div>
                            <span className="equipe-tag__name">{m.prenom} {m.nom}</span>
                            <span className="equipe-tag__pseudo">@{m.pseudo}</span>
                            <button type="button" className="equipe-tag__remove" onClick={() => removeMembreEquipe(m.id)}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recherche */}
                  <div className="form-group">
                    <label className="form-label">Rechercher un étudiant</label>
                    <div className="equipe-search">
                      <svg className="input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                      <input type="text" className="form-input form-input--icon"
                        value={equipeSearch}
                        onChange={e => setEquipeSearch(e.target.value)}
                        placeholder="Nom, prénom ou pseudo…"
                      />
                      {equipeSearching && <span className="equipe-search__spinner" />}
                    </div>

                    {/* Résultats */}
                    {equipeResults.length > 0 && (
                      <ul className="equipe-results">
                        {equipeResults.map(u => (
                          <li key={u.id} className="equipe-result" onClick={() => addMembreEquipe(u)}>
                            <div className="equipe-result__avatar">{u.prenom?.charAt(0)}{u.nom?.charAt(0)}</div>
                            <div className="equipe-result__info">
                              <span className="equipe-result__name">{u.prenom} {u.nom}</span>
                              <span className="equipe-result__meta">@{u.pseudo}{u.classePromo ? ` · ${u.classePromo}` : ''}</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                          </li>
                        ))}
                      </ul>
                    )}
                    {equipeSearch.length >= 2 && !equipeSearching && equipeResults.length === 0 && (
                      <p className="equipe-noresult">Aucun étudiant trouvé pour « {equipeSearch} »</p>
                    )}
                  </div>

                  <p className="media-skip-hint">Optionnel — laissez vide si vous avez travaillé seul.</p>
                </div>
              )}

              {/* ── ÉTAPE 5 : Récap ── */}
              {wizardStep === 5 && (
                <div className="wizard-page" key="step5">
                  <div className="recap">
                    <div className="recap-preview">
                      {projetForm.thumbnailUrl ? (
                        <img src={`http://localhost:8080${projetForm.thumbnailUrl}`} alt="miniature" className="recap-preview__img" />
                      ) : (
                        <div className="recap-preview__placeholder"><span>{projetForm.titre?.charAt(0) || '?'}</span></div>
                      )}
                      <div className="recap-preview__badge">{projetForm.matiere}</div>
                    </div>

                    <div className="recap-details">
                      <h3 className="recap-titre">{projetForm.titre}</h3>
                      {projetForm.competition && <span className="recap-competition">🏆 En compétition</span>}
                      {projetForm.description && <p className="recap-desc">{projetForm.description}</p>}

                      <div className="recap-rows">
                        <RecapRow label="Matière"    value={projetForm.matiere} />
                        <RecapRow label="Compétition" value={projetForm.competition === true ? 'Oui' : projetForm.competition === false ? 'Non' : '—'} />
                        <RecapRow label="Miniature"  value={projetForm.thumbnailUrl ? '✓ Uploadée' : '—'} muted={!projetForm.thumbnailUrl} />
                        <RecapRow label="Fichiers"   value={projetForm.fichiers.filter(f=>f).length > 0 ? `${projetForm.fichiers.filter(f=>f).length} fichier(s)` : '—'} muted={projetForm.fichiers.filter(f=>f).length === 0} />
                        <RecapRow label="Liens"      value={projetForm.liens.filter(l=>l).length > 0 ? `${projetForm.liens.filter(l=>l).length} lien(s)` : '—'} muted={projetForm.liens.filter(l=>l).length === 0} />
                        <RecapRow label="Équipe"     value={projetForm.equipe.length > 0 ? projetForm.equipe.map(m => `@${m.pseudo}`).join(', ') : 'Projet solo'} muted={projetForm.equipe.length === 0} />
                      </div>

                      <div className="recap-status-info">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                        Votre projet sera soumis en attente de validation.
                        {projetForm.equipe.length > 0 && ' Les membres de votre équipe recevront une notification.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal__footer">
              <div className="modal__footer-left">
                {wizardStep > 1 && (
                  <button className="btn-ghost" onClick={() => setWizardStep(s => s - 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                    Retour
                  </button>
                )}
              </div>
              <div className="modal__footer-right">
                <button className="btn-ghost" onClick={closeModal}>Annuler</button>
                {wizardStep < totalSteps ? (
                  <button className="btn-accent"
                    onClick={() => setWizardStep(s => s + 1)}
                    disabled={wizardStep === 1 && !canGoNext1}>
                    Suivant
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                ) : (
                  <button className="btn-accent btn-accent--publish" onClick={handleProjetSubmit} disabled={projetSaving}>
                    {projetSaving ? <span className="btn-spinner" /> : (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>{editProjet ? 'Enregistrer' : 'Publier le projet'}</>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}