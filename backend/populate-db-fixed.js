// Script de peuplement de la base de données avec des données simulées
// Simule une application fonctionnant depuis plusieurs mois avec des missions réelles
import { initDB, getDB } from './db.js';
import { hash } from 'bcrypt';

async function populateDatabase() {
    try {
        console.log('Début du peuplement de la base de données avec données simulées...');

        // Initialiser la base de données
        await initDB();
        const db = await getDB();

        // Supprimer les données existantes
        console.log('Nettoyage des tables existantes...');
        await db.run('DELETE FROM missions_assignees');
        await db.run('DELETE FROM evenements');
        await db.run('DELETE FROM interactions');
        await db.run('DELETE FROM missions');
        await db.run('DELETE FROM rencontres');
        await db.run('DELETE FROM users');

        // Générer 30 utilisateurs
        console.log('Génération des 30 utilisateurs...');
        const users = [];
        const passwordHash = await hash('bsg', 10); // Mot de passe bsg pour tous

        for (let i = 0; i < 30; i++) {
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

        console.log('30 utilisateurs créés');

        // Générer 15 missions (simuler des missions complétées et en cours)
        console.log('Génération des missions...');
        const missions = [];

        // Mission 1 : "Le Mystère du Café" (comme dans l'exemple)
        missions.push({
            titre: "Le Mystère du Café",
            description: "Trouvez l'indice caché dans le café de la place Bellecour pour découvrir le prochain lieu de la mission.",
            difficulte: "Facile",
            objectifs: "Identifier le lieu de la mission,Trouver l'indice caché,Résoudre l'énigme",
            indices: "L'indice est caché dans le café, derrière le bar."
        });

        // Mission 2 : "Le Secret du Musée" (comme dans l'exemple)
        missions.push({
            titre: "Le Secret du Musée",
            description: "Résolvez l'énigme pour trouver le mot de passe qui vous mènera au prochain lieu.",
            difficulte: "Moyen",
            objectifs: "Identifier l'objet mystérieux,Trouver le mot de passe,Résoudre l'énigme",
            indices: "Le mot de passe se trouve dans le tableau de l'artiste."
        });

        // Autres missions
        missions.push({
            titre: "L'Enquête du Restaurant",
            description: "Trouvez les indices cachés dans le restaurant de la place Bellecour pour résoudre le mystère du restaurant abandonné.",
            difficulte: "Moyen",
            objectifs: "Identifier l'indice caché,Trouver la clé de la porte,Résoudre l'énigme de la cuisine",
            indices: "L'indice est caché dans le panier à salade, la clé est cachée dans le pot de vinaigre, la cuisine a un mystère à résoudre."
        });

        missions.push({
            titre: "L'Enquête du Bistrot",
            description: "Vous avez reçu un message cryptique du propriétaire du Bistrot qui vous invite à enquêter sur une affaire de vol de recette. Le suspect se trouverait dans un de ces restaurants à proximité de votre localisation. Trouvez le suspect et ramenez la recette volée.",
            difficulte: "Moyen",
            objectifs: "Identifier le suspect,Récupérer la recette volée,Trouver le propriétaire du Bistrot",
            indices: "Le suspect a été vu dans le restaurant 'Le Comptoir' à 5h du matin, mais a pu changer de lieu. Vous trouverez la recette dans la poche du suspect. Le propriétaire du Bistrot a donné une description détaillée du suspect."
        });

        missions.push({
            titre: "L'Enquête de la Nuit",
            description: "Vous vous rendez dans un restaurant chic de la ville pour rencontrer un contact qui vous a donné rendez-vous. Lorsque vous arrivez, vous découvrez que votre contact n'est pas là, mais un message vous attend à votre table. Le message indique que votre contact a été arrêté par la police et que vous devez trouver des preuves pour prouver son innocence. Vous avez 30 minutes pour trouver les preuves et les remettre à la police avant que le temps ne se soit écoulé.",
            difficulte: "Moyen",
            objectifs: "Trouver les preuves,Résoudre l'enzyme,Résoudre l'énigme",
            indices: "Le serveur du restaurant vous donnera des informations sur l'emplacement des preuves. Vous devez trouver la clé de la chambre de votre contact avant de pouvoir accéder aux preuves."
        });

        missions.push({
            titre: "L'Affaire du Restaurant Perdu",
            description: "Vous êtes un détective expérimenté qui a été chargé d'investiguer une affaire mystérieuse dans un restaurant perdu de la ville. Selon les rumeurs, un objet de valeur a été caché dans l'un des restaurants de la ville et vous devez le trouver avant que les voleurs ne le volent.",
            difficulte: "Moyen",
            objectifs: "Trouver le restaurant perdu,Identifier l'objet de valeur,Résoudre l'énigme",
            indices: "Un indice vous indique que le restaurant perdu est situé dans un quartier de la ville où les restaurants sont nombreux et que l'objet de valeur est caché dans un endroit caché."
        });

        missions.push({
            titre: "L'Enquête du Café",
            description: "Trouvez l'indice caché dans le café de la place Bellecour pour découvrir le prochain lieu de la mission.",
            difficulte: "Facile",
            objectifs: "Identifier le lieu de la mission,Trouver l'indice caché,Résoudre l'énigme",
            indices: "L'indice est caché dans le café, derrière le bar."
        });

        missions.push({
            titre: "L'Enquête du Restaurant",
            description: "Trouvez les indices cachés dans le restaurant de la place Bellecour pour résoudre le mystère du restaurant abandonné.",
            difficulte: "Moyen",
            objectifs: "Identifier l'indice caché,Trouver la clé de la porte,Résoudre l'énigme de la cuisine",
            indices: "L'indice est caché dans le panier à salade, la clé est cachée dans le pot de vinaigre, la cuisine a un mystère à résoudre."
        });

        missions.push({
            titre: "L'Enquête de la Nuit",
            description: "Vous vous rendez dans un restaurant chic de la ville pour rencontrer un contact qui vous a donné rendez-vous. Lorsque vous arrivez, vous découvrez que votre contact n'est pas là, mais un message vous attend à votre table. Le message indique que votre contact a été arrêté par la police et que vous devez trouver des preuves pour prouver son innocence. Vous avez 30 minutes pour trouver les preuves et les remettre à la police avant que le temps ne se soit écoulé.",
            difficulte: "Moyen",
            objectifs: "Trouver les preuves,Résoudre l'enzyme,Résoudre l'énigme",
            indices: "Le serveur du restaurant vous donnera des informations sur l'emplacement des preuves. Vous devez trouver la clé de la chambre de votre contact avant de pouvoir accéder aux preuves."
        });

        missions.push({
            titre: "L'Affaire du Restaurant Perdu",
            description: "Vous êtes un détective expérimenté qui a été chargé d'investiguer une affaire mystérieuse dans un restaurant perdu de la ville. Selon les rumeurs, un objet de valeur a été caché dans l'un des restaurants de la ville et vous devez le trouver avant que les voleurs ne le volent.",
            difficulte: "Moyen",
            objectifs: "Trouver le restaurant perdu,Identifier l'objet de valeur,Résoudre l'énigme",
            indices: "Un indice vous indique que le restaurant perdu est situé dans un quartier de la ville où les restaurants sont nombreux et que l'objet de valeur est caché dans un endroit caché."
        });

        missions.push({
            titre: "L'Enquête du Café",
            description: "Trouvez l'indice caché dans le café de la place Bellecour pour découvrir le prochain lieu de la mission.",
            difficulte: "Facile",
            objectifs: "Identifier le lieu de la mission,Trouver l'indice caché,Résoudre l'énigme",
            indices: "L'indice est caché dans le café, derrière le bar."
        });

        missions.push({
            titre: "L'Enquête du Bistrot",
            description: "Vous avez reçu un message cryptique du propriétaire du Bistrot qui vous invite à enquêter sur une affaire de vol de recette. Le suspect se trouverait dans un de ces restaurants à proximité de votre localisation. Trouvez le suspect et ramenez la recette volée.",
            difficulte: "Moyen",
            objectifs: "Identifier le suspect,Récupérer la recette volée,Trouver le propriétaire du Bistrot",
            indices: "Le suspect a été vu dans le restaurant 'Le Comptoir' à 5h du matin, mais a pu changer de lieu. Vous trouverez la recette dans la poche du suspect. Le propriétaire du Bistrot a donné une description détaillée du suspect."
        });

        missions.push({
            titre: "L'Enquête de la Nuit",
            description: "Vous vous rendez dans un restaurant chic de la ville pour rencontrer un contact qui vous a donné rendez-vous. Lorsque vous arrivez, vous découvrez que votre contact n'est pas là, mais un message vous attend à votre table. Le message indique que votre contact a été arrêté par la police et que vous devez trouver des preuves pour prouver son innocence. Vous avez 30 minutes pour trouver les preuves et les remettre à la police avant que le temps ne se soit écoulé.",
            difficulte: "Moyen",
            objectifs: "Trouver les preuves,Résoudre l'enzyme,Résoudre l'énigme",
            indices: "Le serveur du restaurant vous donnera des informations sur l'emplacement des preuves. Vous devez trouver la clé de la chambre de votre contact avant de pouvoir accéder aux preuves."
        });

        missions.push({
            titre: "L'Affaire du Restaurant Perdu",
            description: "Vous êtes un détective expérimenté qui a été chargé d'investiguer une affaire mystérieuse dans un restaurant perdu de la ville. Selon les rumeurs, un objet de valeur a été caché dans l'un des restaurants de la ville et vous devez le trouver avant que les voleurs ne le volent.",
            difficulte: "Moyen",
            objectifs: "Trouver le restaurant perdu,Identifier l'objet de valeur,Résoudre l'énigme",
            indices: "Un indice vous indique que le restaurant perdu est situé dans un quartier de la ville où les restaurants sont nombreux et que l'objet de valeur est caché dans un endroit caché."
        });

        missions.push({
            titre: "L'Enquête du Café",
            description: "Trouvez l'indice caché dans le café de la place Bellecour pour découvrir le prochain lieu de la mission.",
            difficulte: "Facile",
            objectifs: "Identifier le lieu de la mission,Trouver l'indice caché,Résoudre l'énigme",
            indices: "L'indice est caché dans le café, derrière le bar."
        });

        // Insérer les missions
        for (const mission of missions) {
            await db.run(
                'INSERT INTO missions (titre, description, difficulte, objectifs, indices) VALUES (?, ?, ?, ?, ?)',
                [mission.titre, mission.description, mission.difficulte, mission.objectifs, mission.indices]
            );
        }

        console.log('15 missions créées');

        // Assigner les missions aux utilisateurs avec différents rôles
        console.log('Assignation des missions aux utilisateurs...');

        // Obtenir les IDs des missions créées
        const missionRows = await db.all('SELECT id FROM missions');
        const missionIds = missionRows.map(row => row.id);

        // Obtenir les IDs des utilisateurs créés
        const userRows = await db.all('SELECT id FROM users');
        const userIds = userRows.map(row => row.id);

        // Créer des assignations de missions avec différents rôles
        // 10 missions pour les utilisateurs 1-10 (createur)
        // 5 missions pour les utilisateurs 11-15 (invités)
        // 5 missions pour les utilisateurs 16-20 (participants)
        // 5 missions pour les utilisateurs 21-25 (createur)
        // 5 missions pour les utilisateurs 26-30 (invités)

        const assignments = [];

        // Assignations pour les utilisateurs 1-10 : createur
        for (let i = 0; i < 10; i++) {
            const userId = userIds[i];
            // Choisir 1 mission aléatoire pour chaque utilisateur
            const missionId = missionIds[Math.floor(Math.random() * missionIds.length)];
            assignments.push({
                mission_id: missionId,
                user_id: userId,
                role: 'createur',
                statut: i % 2 === 0 ? 'reussie' : 'initie'
            });
        }

        // Assignations pour les utilisateurs 11-15 : invités
        for (let i = 10; i < 15; i++) {
            const userId = userIds[i];
            // Choisir 1 mission aléatoire pour chaque utilisateur
            const missionId = missionIds[Math.floor(Math.random() * missionIds.length)];
            assignments.push({
                mission_id: missionId,
                user_id: userId,
                role: 'invite',
                statut: i % 2 === 0 ? 'reussie' : 'initie'
            });
        }

        // Assignations pour les utilisateurs 16-20 : participants
        for (let i = 15; i < 20; i++) {
            const userId = userIds[i];
            // Choisir 1 mission aléatoire pour chaque utilisateur
            const missionId = missionIds[Math.floor(Math.random() * missionIds.length)];
            assignments.push({
                mission_id: missionId,
                user_id: userId,
                role: 'participant',
                statut: i % 2 === 0 ? 'reussie' : 'initie'
            });
        }

        // Assignations pour les utilisateurs 21-25 : createur
        for (let i = 20; i < 25; i++) {
            const userId = userIds[i];
            // Choisir 1 mission aléatoire pour chaque utilisateur
            const missionId = missionIds[Math.floor(Math.random() * missionIds.length)];
            assignments.push({
                mission_id: missionId,
                user_id: userId,
                role: 'createur',
                statut: i % 2 === 0 ? 'reussie' : 'initie'
            });
        }

        // Assignations pour les utilisateurs 26-30 : invités
        for (let i = 25; i < 30; i++) {
            const userId = userIds[i];
            // Choisir 1 mission aléatoire pour chaque utilisateur
            const missionId = missionIds[Math.floor(Math.random() * missionIds.length)];
            assignments.push({
                mission_id: missionId,
                user_id: userId,
                role: 'invite',
                statut: i % 2 === 0 ? 'reussie' : 'initie'
            });
        }

        // Insérer les assignations
        for (const assignment of assignments) {
            await db.run(
                'INSERT INTO missions_assignees (mission_id, user_id, role, statut) VALUES (?, ?, ?, ?)',
                [assignment.mission_id, assignment.user_id, assignment.role, assignment.statut]
            );
        }

        console.log('Assignations de missions créées');

        // Générer des interactions (simuler des interactions réelles)
        console.log('Génération des interactions...');
        const interactions = [];
        // Créer des interactions entre utilisateurs existants
        for (let i = 0; i < 50; i++) {
            const userId1 = Math.floor(Math.random() * 30) + 1;
            let userId2;
            do {
                userId2 = Math.floor(Math.random() * 30) + 1;
            } while (userId2 === userId1); // S'assurer que ce ne sont pas les mêmes utilisateurs

            const types = ['message', 'appel', 'rencontre'];
            const type = types[Math.floor(Math.random() * types.length)];

            let contenu = '';
            if (type === 'message') {
                conteúdo = `Bonjour, j'ai vu que tu faisais la mission ${Math.floor(Math.random() * 15) + 1}. Tu as des conseils à partager ?`;
            } else if (type === 'appel') {
                conteúdo = `Appel pour discuter de notre rencontre prévue.`;
            } else {
                // Rencontre
                conteúdo = `Merci pour notre rencontre hier. C'était très agréable !`;
            }

            const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();

            interactions.push({
                utilisateur1_id: userId1,
                utilisateur2_id: userId2,
                type: type,
                conteúdo: conteúdo,
                date: date
            });
        }

        // Insérer les interactions
        for (const interaction of interactions) {
            await db.run(
                'INSERT INTO interactions (userId1, userId2, type, conteúdo, createdAt) VALUES (?, ?, ?, ?, ?)',
                [interaction.utilisateur1_id, interaction.utilisateur2_id, interaction.type, interaction.contenu, interaction.date]
            );
        }

        console.log('50 interactions créées');

        // Générer des événements (simuler des événements passés et futurs)
        console.log('Génération des événements...');
        const events = [];
        for (let i = 0; i < 30; i++) {
            const types = ['meeting', 'notification', 'mission'];
            const type = types[Math.floor(Math.random() * types.length)];

            let message = '';
            let details = {};

            if (type === 'meeting') {
                message = `Nouvelle rencontre programmée`;
                details = {
                    location: `Lieu de rencontre ${i + 1}`,
                    time: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
                    participants: [Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 30) + 1]
                };
            } else if (type === 'notification') {
                message = `Nouvelle mission disponible`;
                details = {
                    mission_id: Math.floor(Math.random() * 15) + 1,
                    description: `Mission sociale à découvrir dans Lyon`
                };
            } else {
                message = `Mission terminée`;
                details = {
                    mission_id: Math.floor(Math.random() * 15) + 1,
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

        console.log('30 événements créés');

        // Générer des rencontres (simuler des rencontres passées et futures)
        console.log('Génération des rencontres...');
        const rencontres = [];
        // Créer des rencontres (la table rencontres a seulement userId, pas utilisateur1_id/utilisateur2_id)
        for (let i = 0; i < 30; i++) {
            const userId = Math.floor(Math.random() * 30) + 1;

            const types = ['rendez-vous', 'discussion', 'mission'];
            const type = types[Math.floor(Math.random() * types.length)];

            // Pour simuler des rencontres passées et futures, on utilise la colonne statut
            // Mais la table rencontres n'a pas de colonne statut, donc on va simplement créer des rencontres
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

        console.log('30 rencontres créées (passées et futures)');

        console.log('Peuplement de la base de données terminé avec succès !');

    } catch (error) {
        console.error('Erreur lors du peuplement de la base de données:', error);
        process.exit(1);
    }
}

// Exécuter le script
populateDatabase();
