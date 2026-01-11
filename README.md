# Bienveillant Seduction Game

## Concept

Bienveillant Seduction Game est une application web interactive qui combine l'exploration de la ville de Lyon avec des défis de rencontre et de communication. L'application permet aux utilisateurs de créer un profil détaillé, de participer à des missions sociales et de rencontrer d'autres utilisateurs dans un cadre respectueux et bienveillant.

## Use Case

L'application vise à :

- Créer une communauté de personnes souhaitant rencontrer d'autres individus de manière authentique
- Proposer des défis sociaux et culturels à travers la ville de Lyon
- Encourager les interactions humaines positives et respectueuses
- Offrir une expérience ludique autour de la découverte urbaine

### Exemple concret d'utilisation

Un utilisateur souhaite rencontrer d'autres personnes dans un cadre respectueux. Il crée un profil détaillé avec ses centres d'intérêt et préférences de rencontre. L'application lui propose alors des missions sociales dans la ville de Lyon comme :

1. Trouver un lieu culturel à Lyon et discuter avec d'autres visiteurs
2. Participer à une activité de nettoyage de quartier avec d'autres bénévoles
3. Explorer un quartier de Lyon en groupe et échanger sur les traditions locales

L'utilisateur peut ensuite recevoir des notifications de rencontre avec d'autres utilisateurs ayant des intérêts similaires, et valider ces rencontres via des défis interactifs dans la ville.

## Fonctionnalités Implémentées

### 1. Gestion des Utilisateurs

- Inscription et connexion sécurisées
- Création de profil complet avec :
  - Informations personnelles (nom, prénom, email)
  - Détails supplémentaires (âge, centres d'intérêt)
  - Préférences de rencontre
  - Disponibilité
- Gestion de session avec store Vue.js

### 2. Interface de Jeu

- Navigation entre les sections : Profil, Notifications, Missions, Carte
- Interface de gestion des profils utilisateurs
- Système de notifications de rencontre
- Gestion des missions interactives
- Carte interactive de Lyon avec marqueurs

### 3. Backend et Base de Données

- Serveur Node.js avec Express
- Base de données SQLite
- Routes API pour la gestion des utilisateurs
- Validation des données et sécurité des mots de passe

### 4. Technologies Utilisées

- Frontend : Vue.js 3 avec Composition API
- State Management : Pinia
- Backend : Node.js + Express
- Base de données : SQLite
- Communication : Axios pour les API calls

## Structure du Projet

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

## Étapes de Développement Réalisées

1. **Analyse et Planification**

   - Définition du concept détaillé
   - Architecture technique
   - Planification des fonctionnalités

2. **Frontend**

   - Création de l'interface utilisateur principale
   - Implémentation du composant GameInterface
   - Développement des composants Login et SignUp
   - Intégration du store Pinia pour la gestion des utilisateurs
   - Mise en place du routeur Vue.js

3. **Backend**

   - Configuration de la base de données SQLite
   - Création des routes API pour les utilisateurs
   - Implémentation des fonctionnalités CRUD
   - Ajout de la table users avec tous les champs nécessaires

4. **Intégration**
   - Connexion frontend et backend
   - Mise à jour des composants pour utiliser le store
   - Correction des erreurs de syntaxe et d'accès aux données
   - Amélioration de la sécurité et de la robustesse

## Détails Techniques

### Base de données SQLite

La base de données contient une table `users` avec les champs suivants :

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `nom` (TEXT)
- `prenom` (TEXT)
- `pseudo` (TEXT)
- `email` (TEXT UNIQUE)
- `password` (TEXT)
- `age` (INTEGER)
- `interets` (TEXT)
- `preferencesRencontre` (TEXT)
- `disponibilite` (TEXT)

### API Backend

Les endpoints disponibles :

- `POST /api/users` : Création d'un utilisateur
- `GET /api/users` : Récupération de tous les utilisateurs
- `PUT /api/users/:id` : Mise à jour d'un utilisateur
- `DELETE /api/users/:id` : Suppression d'un utilisateur
- `POST /api/login` : Connexion utilisateur

### Composants Frontend Principaux

#### Login.vue

- Formulaire de connexion avec validation
- Redirection vers `/game` après connexion réussie
- Gestion des erreurs de connexion

#### SignUp.vue

- Formulaire d'inscription avec tous les champs requis
- Validation des données côté client
- Redirection vers `/login` après inscription réussie

#### GameInterface.vue

- Interface principale avec navigation entre sections
- Gestion du profil utilisateur
- Système de notifications et de missions
- Carte interactive de Lyon

## Comment Démarrer

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation

```bash
# Cloner le dépôt
git clone <repository-url>

# Installer les dépendances frontend
cd bsg-frontend
npm install

# Installer les dépendances backend
cd ../backend
npm install

# Démarrer le backend
cd backend
npm start

# Démarrer le frontend
cd ../bsg-frontend
npm run dev
```

## Prochaines Étapes

1. Amélioration de l'interface utilisateur
2. Développement de nouvelles missions
3. Ajout de fonctionnalités de messagerie
4. Intégration de géolocalisation avancée
5. Tests unitaires et d'intégration
6. Documentation utilisateur
