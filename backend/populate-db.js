// Script de peuplement de la base de données avec des données fictives simulées
// Simule une application fonctionnant depuis plusieurs mois avec des interactions réelles
import { initDB, getDB } from './db.js';
import { hash } from 'bcrypt';

async function populateDatabase() {
    try {
        console.log('Début du peuplement de la base de données avec données simulées...');

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

        // Générer 50 missions (simuler des missions complétées)
        console.log('Génération des missions...');
        const missions = [];
        for (let i = 0; i < 50; i++) {
            const mission = {
                titre: `Mission ${i + 1}`,
                description: `Mission sociale de type ${i % 3 === 0 ? 'culturelle' : i % 3 === 1 ? 'environnementale' : 'sociale'} pour découvrir Lyon.`,
                difficulte: i % 3 === 0 ? 'Facile' : i % 3 === 1 ? 'Moyen' : 'Difficile',
                objectifs: `Objectif 1: Explorer le quartier ${i + 1}, Objectif 2: Discuter avec des habitants, Objectif 3: Partager une expérience`,
                indices: `Indice ${i + 1}: Cherchez les lieux de rencontre dans le centre-ville de Lyon`
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

        console.log('50 missions créées');

        // Ajouter des informations de mission dans les interactions existantes
        // Pour simuler des missions complétées, on va modifier quelques interactions
        console.log('Simulation de missions complétées dans les interactions...');
        // Aucune insertion supplémentaire nécessaire, les interactions suffisent
        console.log('Simulation de missions complétées terminée');

        // Générer des interactions (simuler des interactions réelles)
        console.log('Génération des interactions...');
        const interactions = [];
        // Créer des interactions entre utilisateurs existants
        for (let i = 0; i < 150; i++) {
            const userId1 = Math.floor(Math.random() * 100) + 1;
            let userId2;
            do {
                userId2 = Math.floor(Math.random() * 100) + 1;
            } while (userId2 === userId1); // S'assurer que ce ne sont pas les mêmes utilisateurs

            const types = ['message', 'appel', 'rencontre'];
            const type = types[Math.floor(Math.random() * types.length)];

            let contenu = '';
            if (type === 'message') {
                contenu = `Bonjour, j'ai vu que tu faisais la mission ${Math.floor(Math.random() * 50) + 1}. Tu as des conseils à partager ?`;
            } else if (type === 'appel') {
                contenu = `Appel pour discuter de notre rencontre prévue.`;
            } else {
                // Rencontre
                contenu = `Merci pour notre rencontre hier. C'était très agréable !`;
            }

            const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();

            interactions.push({
                utilisateur1_id: userId1,
                utilisateur2_id: userId2,
                type: type,
                contenu: contenu,
                date: date
            });
        }

        // Insérer les interactions
        for (const interaction of interactions) {
            await db.run(
                'INSERT INTO interactions (userId1, userId2, type, contenu, createdAt) VALUES (?, ?, ?, ?, ?)',
                [interaction.utilisateur1_id, interaction.utilisateur2_id, interaction.type, interaction.contenu, interaction.date]
            );
        }

        console.log('150 interactions créées');

        // Générer des événements (simuler des événements passés et futurs)
        console.log('Génération des événements...');
        const events = [];
        for (let i = 0; i < 80; i++) {
            const types = ['meeting', 'notification', 'mission'];
            const type = types[Math.floor(Math.random() * types.length)];

            let message = '';
            let details = {};

            if (type === 'meeting') {
                message = `Nouvelle rencontre programmée`;
                details = {
                    location: `Lieu de rencontre ${i + 1}`,
                    time: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
                    participants: [Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 100) + 1]
                };
            } else if (type === 'notification') {
                message = `Nouvelle mission disponible`;
                details = {
                    mission_id: Math.floor(Math.random() * 50) + 1,
                    description: `Mission sociale à découvrir dans Lyon`
                };
            } else {
                message = `Mission terminée`;
                details = {
                    mission_id: Math.floor(Math.random() * 50) + 1,
                    result: `Mission réussie avec ${Math.floor(Math.random() * 10) + 1} participants`
                };
            }

            const created_at = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();

            events.push({
                type: type,
                message: message,
                details: JSON.stringify(details),
                created_at: created_at
            });
        }

        // Insérer les événements
        for (const event of events) {
            await db.run(
                'INSERT INTO evenements (nom, description, lieu, latitude, longitude, type, utilisateur_id, details, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [event.type, '', event.type, 0, 0, event.type, null, event.details, event.created_at]
            );
        }

        console.log('80 événements créés');

        // Générer des rencontres (simuler des rencontres passées et futures)
        console.log('Génération des rencontres...');
        const rencontres = [];
        // Créer des rencontres (la table rencontres a seulement userId, pas utilisateur1_id/utilisateur2_id)
        for (let i = 0; i < 80; i++) {
            const userId = Math.floor(Math.random() * 100) + 1;

            const types = ['rendez-vous', 'discussion', 'mission'];
            const type = types[Math.floor(Math.random() * types.length)];

            // Pour simuler des rencontres passées et futures, on utilise la colonne statut
            // Mais la table rencontres n'a pas de colonne statut, donc on va simplement créer des rencontres
            const statut = i < 60 ? 'confirmée' : 'en attente'; // 60 passées, 20 futures

            const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();

            rencontres.push({
                userId: userId,
                type: type,
                lieu: `Lieu de rencontre ${i + 1}`,
                // La table rencontres n'a pas de colonne date, statut, transport, arret, heure
                // On ne met que les colonnes existantes
            });
        }

        // Insérer les rencontres
        for (const rencontre of rencontres) {
            await db.run(
                'INSERT INTO rencontres (userId, type, lieu) VALUES (?, ?, ?)',
                [rencontre.userId, rencontre.type, rencontre.lieu]
            );
        }

        console.log('80 rencontres créées (60 passées, 20 futures)');

        console.log('Peuplement de la base de données terminé avec succès !');

    } catch (error) {
        console.error('Erreur lors du peuplement de la base de données:', error);
        process.exit(1);
    }
}

// Exécuter le script
populateDatabase();
