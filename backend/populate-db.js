// Script de peuplement de la base de données avec des données fictives
import { initDB, getDB } from './db.js';
import { hash } from 'bcrypt';

async function populateDatabase() {
    try {
        console.log('Début du peuplement de la base de données...');

        // Initialiser la base de données
        await initDB();
        const db = await getDB();

        // Supprimer les données existantes (facultatif)
        console.log('Nettoyage des tables existantes...');
        await db.run('DELETE FROM evenements');
        await db.run('DELETE FROM interactions');
        await db.run('DELETE FROM missions');
        await db.run('DELETE FROM rencontres');
        await db.run('DELETE FROM users');

        // Générer 100 utilisateurs
        console.log('Génération des utilisateurs...');
        const users = [];
        const passwordHash = await hash('bsg', 10); // Mot de passe bsg pour tous

        for (let i = 0; i < 100; i++) {
            const user = {
                pseudo: `user${i + 1}`,
                prenom: `Prénom${i + 1}`,
                nom: `Nom${i + 1}`,
                email: `user${i + 1}@bsg.fr`,
                password: passwordHash,
                preferencesRencontre: JSON.stringify({
                    meeting_type: i % 3 === 0 ? 'transport' : i % 3 === 1 ? 'lieu' : 'restaurant',
                    age_min: 20 + (i % 20),
                    age_max: 30 + (i % 30),
                    distance_max: 5 + (i % 10)
                }),
                location: JSON.stringify({
                    ville: `Ville${i + 1}`,
                    departement: `Département${i + 1}`,
                    latitude: 48.8566 + (i * 0.001),
                    longitude: 2.3522 + (i * 0.001)
                })
            };

            users.push(user);
        }

        // Insérer les utilisateurs
        for (const user of users) {
            await db.run(
                'INSERT INTO users (pseudo, prenom, nom, email, password, preferencesRencontre) VALUES (?, ?, ?, ?, ?, ?)',
                [user.pseudo, user.prenom, user.nom, user.email, user.password, user.preferencesRencontre]
            );
        }

        console.log('100 utilisateurs créés');

        // Générer 100 missions
        console.log('Génération des missions...');
        const missions = [];
        for (let i = 0; i < 100; i++) {
            const mission = {
                titre: `Mission ${i + 1}`,
                description: `Description de la mission ${i + 1}. Cette mission est générée automatiquement pour le test de l'application.`,
                difficulte: i % 3 === 0 ? 'Facile' : i % 3 === 1 ? 'Moyen' : 'Difficile',
                objectifs: `Objectif 1, Objectif 2, Objectif 3`,
                indices: `Indice ${i + 1} pour la mission ${i + 1}`
            };

            missions.push(mission);
        }

        // Insérer les missions
        for (const mission of missions) {
            await db.run(
                'INSERT INTO missions (titre, description, difficulte, objectifs, indices) VALUES (?, ?, ?, ?, ?)',
                [mission.titre, mission.description, mission.difficulte, mission.objectifs, mission.indices]
            );
        }

        console.log('100 missions créées');

        // Générer 100 interactions
        console.log('Génération des interactions...');
        const interactions = [];
        for (let i = 0; i < 100; i++) {
            const interaction = {
                utilisateur1_id: i % 100 + 1,
                utilisateur2_id: (i + 1) % 100 + 1,
                type: i % 3 === 0 ? 'message' : i % 3 === 1 ? 'appel' : 'rencontre',
                contenu: `Contenu de l'interaction ${i + 1}`,
                date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
            };

            interactions.push(interaction);
        }

        // Insérer les interactions
        for (const interaction of interactions) {
            await db.run(
                'INSERT INTO interactions (userId1, userId2, type, contenu, createdAt) VALUES (?, ?, ?, ?, ?)',
                [interaction.utilisateur1_id, interaction.utilisateur2_id, interaction.type, interaction.contenu, interaction.date]
            );
        }

        console.log('100 interactions créées');

        // Générer 100 événements
        console.log('Génération des événements...');
        const events = [];
        for (let i = 0; i < 100; i++) {
            const event = {
                type: i % 3 === 0 ? 'meeting' : i % 3 === 1 ? 'notification' : 'mission',
                message: `Message d'événement ${i + 1}`,
                details: JSON.stringify({
                    location: `Lieu ${i + 1}`,
                    time: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
                }),
                created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
            };

            events.push(event);
        }

        // Insérer les événements
        for (const event of events) {
            await db.run(
                'INSERT INTO evenements (nom, description, lieu, latitude, longitude, type, utilisateur_id, details, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [event.type, '', event.type, 0, 0, event.type, null, event.details, event.created_at]
            );
        }

        console.log('100 événements créés');

        // Générer 100 rencontres
        console.log('Génération des rencontres...');
        const rencontres = [];
        for (let i = 0; i < 100; i++) {
            const rencontre = {
                utilisateur1_id: i % 100 + 1,
                utilisateur2_id: (i + 1) % 100 + 1,
                date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
                lieu: `Lieu de rencontre ${i + 1}`,
                type: i % 3 === 0 ? 'rendez-vous' : i % 3 === 1 ? 'discussion' : 'mission',
                statut: i % 3 === 0 ? 'confirmée' : i % 3 === 1 ? 'en attente' : 'annulée'
            };

            rencontres.push(rencontre);
        }

        // Insérer les rencontres
        for (const rencontre of rencontres) {
            await db.run(
                'INSERT INTO rencontres (utilisateur1_id, utilisateur2_id, date, lieu, type, statut) VALUES (?, ?, ?, ?, ?, ?)',
                [rencontre.utilisateur1_id, rencontre.utilisateur2_id, rencontre.date, rencontre.lieu, rencontre.type, rencontre.statut]
            );
        }

        console.log('100 rencontres créées');

        console.log('Peuplement de la base de données terminé avec succès !');

    } catch (error) {
        console.error('Erreur lors du peuplement de la base de données:', error);
        process.exit(1);
    }
}

// Exécuter le script
populateDatabase();
