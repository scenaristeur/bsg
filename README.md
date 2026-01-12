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

## Parcours Utilisateur : Comment rencontrer du monde

### Étape 1 : Inscription et Création de Profil

1. Accédez à la page d'inscription
2. Remplissez le formulaire avec vos informations personnelles
3. Définissez vos centres d'intérêt et préférences de rencontre
4. Validez votre inscription

### Étape 2 : Connexion à l'Application

1. Retournez à la page de connexion
2. Entrez votre email et mot de passe
3. Accédez à votre interface de jeu

### Étape 3 : Exploration et Participation aux Missions

1. Naviguez vers l'onglet "Missions"
2. Choisissez une mission sociale adaptée à vos centres d'intérêt
3. Suivez les instructions pour participer à la mission
4. Les missions peuvent vous amener à rencontrer d'autres utilisateurs

### Étape 4 : Réception et Gestion des Notifications de Rencontre

1. Consultez l'onglet "Notifications"
2. Recevez les suggestions de rencontres basées sur vos préférences
3. Acceptez ou rejetez les propositions de rencontre
4. Validez les rencontres via les défis interactifs

### Étape 5 : Interaction via la Carte Interactive

1. Accédez à l'onglet "Carte"
2. Visualisez les points de rencontre sur la carte de Lyon
3. Consultez les informations sur les rencontres proches
4. Planifiez vos rencontres en utilisant les coordonnées fournies

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

# Peupler la base de données (optionnel)
cd backend
node populate-db.js

# Démarrer le backend
npm start

# Démarrer le frontend
cd ../bsg-frontend
npm run dev
```

## Documentation Technique

Pour plus de détails sur le développement et l'architecture technique, consultez le fichier [DEVELOPMENT.md](DEVELOPMENT.md).

## Prochaines Étapes

1. Amélioration de l'interface utilisateur
2. Développement de nouvelles missions
3. Ajout de fonctionnalités de messagerie
4. Intégration de géolocalisation avancée
5. Tests unitaires et d'intégration
6. Documentation utilisateur
