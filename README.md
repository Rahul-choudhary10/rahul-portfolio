# Rahul Kumar Choudhary — Portfolio & Admin Dashboard

A premium developer portfolio with a full admin dashboard, built with **React + Tailwind CSS + Firebase**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Then edit `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Firestore Database** (start in test mode for now)
3. Enable **Authentication** → Sign-in method → Email/Password
4. Create an admin user via **Authentication** → Users → Add user
5. Copy the config values into `.env`

### 4. Firestore Security Rules

In Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for portfolio data
    match /personalInfo/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /skills/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /experience/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /projects/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /certifications/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /socialLinks/{doc} { allow read: if true; allow write: if request.auth != null; }
    // Messages: anyone can write, only admin can read/delete
    match /messages/{doc} { allow create: if true; allow read, update, delete: if request.auth != null; }
  }
}
```

### 5. Run development server
```bash
npm run dev
```

- **Portfolio:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin

---

## 📁 Project Structure

```
src/
├── components/          # Portfolio sections
│   ├── Navbar.jsx
│   ├── Hero.jsx         # Typing animation, CTA buttons
│   ├── About.jsx        # Code-style info card
│   ├── Skills.jsx       # Animated progress bars
│   ├── Experience.jsx   # Timeline UI
│   ├── Projects.jsx     # Card grid
│   ├── Certifications.jsx
│   ├── Contact.jsx      # Form → Firestore messages
│   ├── Footer.jsx
│   └── LoadingScreen.jsx
├── admin/
│   ├── Login.jsx        # Firebase Auth login
│   ├── Dashboard.jsx    # Main admin shell
│   ├── PrivateRoute.jsx
│   └── components/
│       ├── Sidebar.jsx
│       ├── StatsOverview.jsx
│       ├── PersonalInfoManager.jsx
│       ├── SkillsManager.jsx
│       ├── ExperienceManager.jsx
│       ├── ProjectsManager.jsx
│       ├── CertificationsManager.jsx
│       ├── SocialLinksManager.jsx
│       └── MessagesManager.jsx
├── context/
│   ├── ThemeContext.jsx  # Dark/light toggle
│   └── AuthContext.jsx   # Firebase auth state
├── firebase/
│   └── config.js
├── hooks/
│   └── useFirestore.js  # Real-time Firestore hooks + CRUD helpers
├── Portfolio.jsx        # Main portfolio page
└── App.jsx              # Router
```

---

## 🔥 Firestore Data Structure

| Collection | Structure |
|------------|-----------|
| `personalInfo/main` | name, role, company, about, intro, roles[], location, email, phone, resumeUrl, profileImage, yearsOfExperience |
| `skills` | name, category (frontend/backend/database/tools/devops), level (0-100), order |
| `experience` | company, role, duration, location, description, technologies[], order |
| `projects` | title, description, techStack[], githubUrl, liveUrl, image, featured, order |
| `certifications` | title, issuer, date, credentialUrl, image, order |
| `socialLinks/main` | github, linkedin, email, twitter, instagram, website |
| `messages` | name, email, subject, message, timestamp, read |

---

## 🌐 Deployment (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init hosting
firebase init hosting
# Public dir: dist
# Single-page app: Yes

# Build
npm run build

# Deploy
firebase deploy
```

---

## ✨ Features

- **Dark/Light theme** toggle (persisted in localStorage)
- **Real-time updates** — all sections update live from Firestore
- **Framer Motion** scroll animations throughout
- **Typing animation** in hero (react-type-animation)
- **Fallback data** — portfolio shows demo content if Firestore is empty
- **Admin CRUD** — full add/edit/delete for all sections
- **Contact form** → stores messages in Firestore
- **Fully responsive** — mobile first design
