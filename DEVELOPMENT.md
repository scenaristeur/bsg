# Development Documentation

## Project Structure

### Frontend (bsg-frontend/)

- `src/components/` : Composants Vue.js
  - `Login.vue` : Composant de connexion
  - `SignUp.vue` : Composant d'inscription
  - `GameInterface.vue` : Interface principale du jeu
- `src/stores/` : Store Pinia pour la gestion d'état
  - `user.js` : Store utilisateur
- `src/services/` : Services d'API
  - `userService.js` : Service pour les appels API utilisateurs
- `src/router/` : Routeur Vue.js
  - `index.js` : Configuration des routes
- `src/views/` : Vues principales
  - `HomeView.vue` : Page d'accueil
  - `AboutView.vue` : Page À propos

### Backend (backend/)

- `index.js` : Point d'entrée du serveur
- `db.js` : Configuration de la base de données
- `routes/users.js` : Routes API pour les utilisateurs
- `views/index.html` : Page d'accueil avec formulaire d'inscription
- `public/` : Fichiers statiques

## Technical Details

### Database Schema

The SQLite database contains the following tables:

#### users table

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `nom` (TEXT)
- `prenom` (TEXT)
- `pseudo` (TEXT)
- `email` (TEXT UNIQUE)
- `password` (TEXT)
- `dateNaissance` (TEXT)
- `interets` (TEXT)
- `preferencesRencontre` (TEXT)
- `disponibilite` (TEXT)
- `createdAt` (TEXT)

#### missions table

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `titre` (TEXT)
- `description` (TEXT)
- `difficulte` (TEXT)
- `objectifs` (TEXT)
- `indices` (TEXT)
- `createdAt` (TEXT)

#### interactions table

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `userId1` (INTEGER)
- `userId2` (INTEGER)
- `type` (TEXT)
- `contenu` (TEXT)
- `createdAt` (TEXT)

#### rencontres table

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `utilisateur1_id` (INTEGER)
- `utilisateur2_id` (INTEGER)
- `date` (TEXT)
- `lieu` (TEXT)
- `type` (TEXT)
- `statut` (TEXT)
- `createdAt` (TEXT)

#### evenements table

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `nom` (TEXT)
- `description` (TEXT)
- `lieu` (TEXT)
- `latitude` (TEXT)
- `longitude` (TEXT)
- `type` (TEXT)
- `utilisateur_id` (INTEGER)
- `details` (TEXT)
- `createdAt` (TEXT)

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install frontend dependencies
cd bsg-frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

#### Start the backend server

```bash
cd backend
npm start
```

#### Start the frontend development server

```bash
cd bsg-frontend
npm run dev
```

### Populating the Database

To populate the database with sample data:

```bash
cd backend
node populate-db.js
```

This script creates 100 users, 100 missions, 100 interactions, 100 events, and 100 encounters.

## API Endpoints

### Users

- `POST /api/users` : Create a new user
- `GET /api/users` : Get all users
- `GET /api/users/:id` : Get a specific user
- `PUT /api/users/:id` : Update a user
- `DELETE /api/users/:id` : Delete a user
- `POST /api/users/login` : User login

### Missions

- `GET /api/missions` : Get all missions
- `POST /api/missions` : Create a new mission
- `GET /api/missions/:id` : Get a specific mission
- `PUT /api/missions/:id` : Update a mission
- `DELETE /api/missions/:id` : Delete a mission

### Interactions

- `GET /api/interactions` : Get all interactions
- `POST /api/interactions` : Create a new interaction

### Encounters

- `GET /api/rencontres` : Get all encounters
- `POST /api/rencontres` : Create a new encounter

## Technologies Used

### Frontend

- Vue.js 3 with Composition API
- Pinia for state management
- Vue Router for navigation
- Axios for API calls

### Backend

- Node.js with Express
- SQLite database
- Bcrypt for password hashing
- Body-parser for request parsing
- CORS for cross-origin requests

## Testing

Run tests with:

```bash
cd backend
npm test
```

## Deployment

The application can be deployed as a standard Node.js + Vue.js application. The frontend is built with Vite and the backend with Express.
