# MMI Portfolio — Frontend

Interface React de la plateforme portfolio étudiants du département MMI — IUT Marne-la-Vallée.

---

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| React | 18 | Framework UI |
| Vite | 7.3 | Bundler et serveur de développement |
| React Router DOM | 6 | Navigation SPA |
| CSS pur | — | Styles (pas de framework CSS) |
| DM Sans | — | Police corps de texte |
| Bebas Neue | — | Police titres |
| DM Mono | — | Police monospace (tags, pseudos) |

---

## Installation

```bash
npm install
npm run dev
```

Application disponible sur **http://localhost:5173**

### Build production

```bash
npm run build
# Dossier dist/ généré à déployer
```

---

## Structure des dossiers

```
src/
├── components/                   ← Composants réutilisables
│   ├── Navbar.jsx                  Navigation principale
│   ├── Footer.jsx                  Pied de page
│   ├── ProjetCard.jsx              Card projet (grille)
│   ├── FileUpload.jsx              Drag & drop upload
│   └── NotificationBell.jsx        Cloche + panneau notifications
│
├── hooks/
│   └── useSessionExpiry.js         Déconnexion automatique 2h
│
├── pages/
│   ├── Accueil.jsx                 Page d'accueil / vitrine
│   ├── Projets.jsx                 Grille tous les projets
│   ├── ProjetDetail.jsx            Détail d'un projet
│   ├── Profil.jsx                  Profil privé (connecté)
│   ├── ProfilPublic.jsx            Vitrine publique /u/:pseudo
│   ├── Connexion.jsx               Login + inscription
│   ├── Formation.jsx               Présentation formation MMI
│   ├── Studio.jsx                  Page Studio MMI
│   ├── Gaming.jsx                  Page Gaming MMI
│   ├── Credits.jsx                 Crédits du site
│   ├── AdminValidation.jsx         Validation projets (admin)
│   ├── AdminUsers.jsx              Gestion utilisateurs (admin)
│   └── AdminLogs.jsx               Journal d'activité (admin)
│
├── styles/
│   └── global.css                  Variables CSS, palette, animations globales
│
├── App.jsx                         Routes + SessionGuard
└── main.jsx                        Point d'entrée
```

---

## Pages et routes

| Route | Page | Accès | Description |
|---|---|---|---|
| `/` | Accueil | Public | Vitrine avec projets récents et présentation |
| `/projets` | Projets | Public | Grille filtrée par matière |
| `/projets/:id` | Détail projet | Public | Hero, fichiers, liens, équipe, commentaires |
| `/u/:pseudo` | Profil public | Public | Vitrine étudiant — liens, projets, compétences |
| `/connexion` | Connexion | Public | Login et inscription split-screen |
| `/profil` | Profil privé | ✅ Connecté | Gestion compte, projets, avatar, liens, archives |
| `/formation` | Formation | Public | Présentation de la formation MMI |
| `/studio` | Studio | Public | Page Studio MMI |
| `/gaming` | Gaming | Public | Page Gaming MMI |
| `/credits` | Crédits | Public | Équipe du site |
| `/admin/validation` | Validation | 🔒 ADMIN | Tableau projets EN_ATTENTE / VALIDE / REJETE |
| `/admin/users` | Utilisateurs | 🔒 ADMIN | CRUD utilisateurs |
| `/admin/logs` | Journal | 🔒 ADMIN | Historique des actions |

---

## Palette de couleurs (global.css)

```css
--accent:        #2563eb;   /* Bleu électrique — couleur principale */
--accent-bright: #3b82f6;   /* Bleu vif hover */
--accent-cyan:   #06b6d4;   /* Cyan */
--accent-violet: #7c3aed;   /* Violet froid */
--accent-alt:    #e11d48;   /* Rouge — erreurs / danger */
--accent-blue:   #0ea5e9;   /* Sky blue */
--accent-green:  #10b981;   /* Vert — confirmation */

--bg:            #ffffff;   /* Fond principal */
--bg-card:       #f4f6fb;   /* Fond des cards */
--bg-elevated:   #eaecf4;   /* Fond éléments surélevés */

--text-primary:   #0c0e1a;
--text-secondary: #424568;
--text-muted:     #8e91b0;
```

---

## Images de fond (heroes)

Placer les images dans **`public/images/`** :

| Fichier | Page |
|---|---|
| `hero-accueil.jpg` | Accueil |
| `hero-projet.jpg` | Projets |
| `hero-formation.jpg` | Formation |
| `hero-fond-vert.jpg` | Studio |
| `hero-gaming.jpg` | Gaming |

Chaque hero est recouvert d'un overlay blanc semi-transparent + teinte bleue froide via `::before` pour garder le texte lisible.

---

## Authentification et session

La connexion stocke dans `localStorage` :

```
token      → JWT Bearer
role       → USER | PROF | ADMIN
pseudo     → @pseudo de l'utilisateur
userId     → identifiant numérique
loginAt    → timestamp de connexion (pour la session 2h)
```

### Déconnexion automatique

Le hook `useSessionExpiry` est monté dans `App.jsx` via un composant `<SessionGuard />`. Il vérifie au chargement et toutes les minutes que `Date.now() - loginAt < 2h`. Si la session est expirée, il vide le localStorage et redirige vers `/connexion` avec un bandeau d'information.

```js
import { setLoginTimestamp } from '../hooks/useSessionExpiry';
// À appeler après chaque login/register réussi
setLoginTimestamp();
```

---

## Wizard création de projet (5 étapes)

Accessible depuis `/profil` → bouton **Nouveau projet**.

```
Étape 1 — Infos
  Titre (obligatoire), chips matière, description,
  compétition oui/non (2 gros boutons), miniature (jpg/png/webp, 5 Mo max)

Étape 2 — Fichiers
  Jusqu'à 3 fichiers — pdf, mp4, glb, gltf, png, jpg (50 Mo max chacun)
  Slots déblocables séquentiellement

Étape 3 — Liens
  Jusqu'à 3 URLs — site, Figma, GitHub, etc.

Étape 4 — Équipe
  Recherche d'étudiants (debounce 350ms, filtrée role=USER uniquement)
  Ajout avec tag cliquable ✕ pour retirer

Étape 5 — Récapitulatif
  Aperçu complet avant publication
  Bouton Publier → POST /api/projets
```

---

## Profil privé `/profil`

### Sidebar gauche
- **Avatar** — photo uploadée / icône emoji (12 choix) / initiales par défaut
  - Crayon d'édition → modal avec affichage de l'avatar actuel
  - Upload : jpg, png, webp, gif — max 2 Mo
- **Liens** — jusqu'à 4 liens avec titre prédéfini (GitHub, LinkedIn, Behance…) et icônes auto-détectées
- **Informations** — nom, prénom, pseudo, email, téléphone, adresse

### Contenu principal
- **Stats** — 4 colonnes : Projets / Validés / Likes reçus / Compétitions
- **Mes projets** — liste avec miniature, statut coloré, tag compétition, boutons modifier/supprimer
- **Archives** *(chargement lazy au clic)*
  - Notifications — couleur par type, lien vers le projet, date
  - Projets likés — miniature + auteur + compteur
  - Commentaires — titre + badge projet cliquable + 2 lignes de contenu

---

## Profil public `/u/:pseudo`

Vitrine accessible sans compte — idéale pour les recruteurs.

- Hero avec avatar, nom, promo, stats (projets, likes, compétitions)
- Icônes liens rapides dans le hero (au survol : tooltip avec le titre)
- **Sidebar** : carte Liens avec icônes auto (GitHub→🐙, LinkedIn→💼, Behance→🎨…)
- **Sidebar** : répartition des matières en barres proportionnelles colorées
- Grille des projets validés de l'étudiant

> Si l'utilisateur connecté clique sur son propre pseudo → redirigé vers `/profil` (privé) et non `/u/:pseudo`.
> Cette logique est gérée par le helper `profilLink(pseudo)` dans `ProjetCard.jsx` et `ProjetDetail.jsx`.

---

## Système de notifications

La cloche en navbar interroge le backend toutes les **30 secondes**.

| Type | Point | Déclencheur |
|---|---|---|
| `PROJET_VALIDE` | 🟢 Vert | Admin valide un projet |
| `PROJET_REJETE` | 🔴 Rouge | Admin refuse avec message |
| `NOUVEAU_COMMENTAIRE` | 🔵 Bleu | Commentaire sur son projet |
| `EQUIPE` | 🟣 Violet | Ajout en équipe d'un projet |
| `SUPPRESSION_COMMENTAIRE` | 🟠 Amber | Admin supprime un commentaire |
| `SIGNALEMENT` | 🟠 Amber | Signalement → tous les admins |

---

## Rôles utilisateurs

| Rôle | Ce qu'il peut faire |
|---|---|
| **USER** | Créer, modifier, supprimer ses projets · Liker · Commenter · Signaler |
| **PROF** | Tout USER + modifier/supprimer tous les projets + publication directe (VALIDE) |
| **ADMIN** | Tout PROF + valider/refuser projets + gérer utilisateurs + modérer commentaires |

---

## Connexion à l'API

L'URL de base est définie en haut de chaque page :

```js
const API_URL = 'http://localhost:8080/api';
```

Pour la production, remplacer par l'URL de ton serveur.

Toutes les requêtes authentifiées utilisent le header :
```
Authorization: Bearer <token>
```

---

## Variables d'environnement (optionnel)

Pour éviter de changer l'URL manuellement, créer un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:8080/api
```

Puis dans les pages :
```js
const API_URL = import.meta.env.VITE_API_URL;
```
