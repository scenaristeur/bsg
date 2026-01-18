-- Script de peuplement de la base de données Supabase pour l'application BSG
-- Ce script ajoute 10 utilisateurs fictifs, leurs missions et interactions

-- Définir les variables pour les dates
-- 30 jours avant aujourd'hui
WITH date_offset AS (
  SELECT CURRENT_DATE - INTERVAL '30 days' AS start_date
)

-- Insérer 10 utilisateurs fictifs
INSERT INTO users (id, pseudo, nom, prenom, competences, historique, latitude, longitude, created_at, updated_at)
VALUES 
  -- Utilisateur 1
  ('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'AlexDev', 'Dupont', 'Alex', ARRAY['Communication', 'Organisation'], ARRAY['Mission 1', 'Mission 2'], 48.8566, 2.3522, (SELECT start_date + INTERVAL '1 day'), (SELECT start_date + INTERVAL '1 day')),
  -- Utilisateur 2
  ('b2c3d4e5-f678-9012-b2c3-d4e5f6789012', 'MarieArt', 'Martin', 'Marie', ARRAY['Créativité', 'Empathie'], ARRAY['Mission 3'], 43.2965, 5.3704, (SELECT start_date + INTERVAL '2 days'), (SELECT start_date + INTERVAL '2 days')),
  -- Utilisateur 3
  ('c3d4e5f6-7890-1234-c3d4-e5f678901234', 'JeanTech', 'Bernard', 'Jean', ARRAY['Technique', 'Analyse'], ARRAY['Mission 4', 'Mission 5', 'Mission 6'], 48.8611, 2.3361, (SELECT start_date + INTERVAL '3 days'), (SELECT start_date + INTERVAL '3 days')),
  -- Utilisateur 4
  ('d4e5f678-9012-3456-d4e5-f67890123456', 'SophieDesign', 'Dubois', 'Sophie', ARRAY['Design', 'Esthétique'], ARRAY['Mission 7'], 45.7640, 4.8357, (SELECT start_date + INTERVAL '4 days'), (SELECT start_date + INTERVAL '4 days')),
  -- Utilisateur 5
  ('e5f67890-1234-5678-e5f6-789012345678', 'PierreSport', 'Robert', 'Pierre', ARRAY['Sports', 'Endurance'], ARRAY['Mission 8', 'Mission 9'], 43.6046, 1.4442, (SELECT start_date + INTERVAL '5 days'), (SELECT start_date + INTERVAL '5 days')),
  -- Utilisateur 6
  ('f6789012-3456-7890-f678-901234567890', 'ClaireMusique', 'Richard', 'Claire', ARRAY['Musique', 'Harmonie'], ARRAY['Mission 10'], 48.8534, 2.3488, (SELECT start_date + INTERVAL '6 days'), (SELECT start_date + INTERVAL '6 days')),
  -- Utilisateur 7
  ('12345678-9012-3456-1234-567890123456', 'ThomasCuisine', 'Petit', 'Thomas', ARRAY['Cuisine', 'Innovation'], ARRAY['Mission 11', 'Mission 12'], 49.4431, 1.0995, (SELECT start_date + INTERVAL '7 days'), (SELECT start_date + INTERVAL '7 days')),
  -- Utilisateur 8
  ('23456789-0123-4567-2345-678901234567', 'EmmaLecture', 'Moreau', 'Emma', ARRAY['Lecture', 'Analyse'], ARRAY['Mission 13'], 48.1172, -1.6785, (SELECT start_date + INTERVAL '8 days'), (SELECT start_date + INTERVAL '8 days')),
  -- Utilisateur 9
  ('34567890-1234-5678-3456-789012345678', 'LucPhotography', 'Leroy', 'Luc', ARRAY['Photographie', 'Art'], ARRAY['Mission 14', 'Mission 15'], 45.1885, 5.7245, (SELECT start_date + INTERVAL '9 days'), (SELECT start_date + INTERVAL '9 days')),
  -- Utilisateur 10
  ('45678901-2345-6789-4567-890123456789', 'JulieNature', 'Simon', 'Julie', ARRAY['Nature', 'Observation'], ARRAY['Mission 16', 'Mission 17', 'Mission 18'], 48.8566, 2.3522, (SELECT start_date + INTERVAL '10 days'), (SELECT start_date + INTERVAL '10 days'));

-- Insérer des missions fictives pour ces utilisateurs
WITH date_offset AS (
  SELECT CURRENT_DATE - INTERVAL '30 days' AS start_date
)
INSERT INTO missions (titre, description, niveau_difficulte, objectifs, created_by, created_at, updated_at)
VALUES 
  -- Mission 1 pour Alex
  ('Découverte du quartier', 'Explorez le quartier autour de vous et rencontrez 3 personnes intéressantes.', 2, ARRAY['Trouver 3 personnes', 'Échanger sur un sujet commun', 'Prendre une photo'], 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', (SELECT start_date + INTERVAL '1 day'), (SELECT start_date + INTERVAL '1 day')),
  -- Mission 2 pour Alex
  ('Atelier de cuisine', 'Participez à un atelier de cuisine local et apprenez à cuisiner un plat traditionnel.', 3, ARRAY['Assister à l\'atelier', 'Préparer un plat', 'Déguster le plat'], 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', (SELECT start_date + INTERVAL '2 days'), (SELECT start_date + INTERVAL '2 days')),
  -- Mission 3 pour Marie
  ('Exposition artistique', 'Visitez une exposition artistique et discutez avec un artiste.', 2, ARRAY['Visiter l\'exposition', 'Discuter avec un artiste', 'Prendre des notes'], 'b2c3d4e5-f678-9012-b2c3-d4e5f6789012', (SELECT start_date + INTERVAL '3 days'), (SELECT start_date + INTERVAL '3 days')),
  -- Mission 4 pour Jean
  ('Hackathon local', 'Participez à un hackathon et développez une application utile.', 4, ARRAY['S''inscrire au hackathon', 'Développer une application', 'Présenter le projet'], 'c3d4e5f6-7890-1234-c3d4-e5f678901234', (SELECT start_date + INTERVAL '4 days'), (SELECT start_date + INTERVAL '4 days')),
  -- Mission 5 pour Jean
  ('Atelier de photographie', 'Apprenez les bases de la photographie dans un atelier.', 2, ARRAY['Assister à l\'atelier', 'Pratiquer la prise de vue', 'Modifier les photos'], 'c3d4e5f6-7890-1234-c3d4-e5f678901234', (SELECT start_date + INTERVAL '5 days'), (SELECT start_date + INTERVAL '5 days')),
  -- Mission 6 pour Jean
  ('Randonnée en montagne', 'Partez en randonnée en montagne avec un groupe.', 3, ARRAY['Préparer l''équipement', 'Suivre le parcours', 'Prendre des photos'], 'c3d4e5f6-7890-1234-c3d4-e5f678901234', (SELECT start_date + INTERVAL '6 days'), (SELECT start_date + INTERVAL '6 days')),
  -- Mission 7 pour Sophie
  ('Atelier de design graphique', 'Apprenez les bases du design graphique.', 2, ARRAY['Assister à l\'atelier', 'Créer un logo', 'Présenter le travail'], 'd4e5f678-9012-3456-d4e5-f67890123456', (SELECT start_date + INTERVAL '7 days'), (SELECT start_date + INTERVAL '7 days')),
  -- Mission 8 pour Pierre
  ('Tournoi de football', 'Participez à un tournoi de football local.', 3, ARRAY['S''inscrire au tournoi', 'Jouer un match', 'Remporter un match'], 'e5f67890-1234-5678-e5f6-789012345678', (SELECT start_date + INTERVAL '8 days'), (SELECT start_date + INTERVAL '8 days')),
  -- Mission 9 pour Pierre
  ('Cours de yoga', 'Suivez un cours de yoga pour améliorer votre flexibilité.', 1, ARRAY['Assister au cours', 'Pratiquer les postures', 'Respirer profondément'], 'e5f67890-1234-5678-e5f6-789012345678', (SELECT start_date + INTERVAL '9 days'), (SELECT start_date + INTERVAL '9 days')),
  -- Mission 10 pour Claire
  ('Concert de musique', 'Assistez à un concert de musique live.', 2, ARRAY['Acheter un billet', 'Assister au concert', 'Prendre des photos'], 'f6789012-3456-7890-f678-901234567890', (SELECT start_date + INTERVAL '10 days'), (SELECT start_date + INTERVAL '10 days')),
  -- Mission 11 pour Thomas
  ('Cours de cuisine', 'Apprenez à cuisiner un plat traditionnel.', 2, ARRAY['Assister au cours', 'Préparer un plat', 'Déguster le plat'], '12345678-9012-3456-1234-567890123456', (SELECT start_date + INTERVAL '11 days'), (SELECT start_date + INTERVAL '11 days')),
  -- Mission 12 pour Thomas
  ('Atelier de pâtisserie', 'Participez à un atelier de pâtisserie.', 2, ARRAY['Assister à l\'atelier', 'Préparer un dessert', 'Déguster le dessert'], '12345678-9012-3456-1234-567890123456', (SELECT start_date + INTERVAL '12 days'), (SELECT start_date + INTERVAL '12 days')),
  -- Mission 13 pour Emma
  ('Lecture de livre', 'Lisez un livre et discutez-en avec un ami.', 1, ARRAY['Choisir un livre', 'Lire le livre', 'Discuter du livre'], '23456789-0123-4567-2345-678901234567', (SELECT start_date + INTERVAL '13 days'), (SELECT start_date + INTERVAL '13 days')),
  -- Mission 14 pour Luc
  ('Atelier de photographie', 'Apprenez les bases de la photographie.', 2, ARRAY['Assister à l\'atelier', 'Pratiquer la prise de vue', 'Modifier les photos'], '34567890-1234-5678-3456-789012345678', (SELECT start_date + INTERVAL '14 days'), (SELECT start_date + INTERVAL '14 days')),
  -- Mission 15 pour Luc
  ('Photographie de paysage', 'Prenez des photos de paysages naturels.', 2, ARRAY['Trouver un site', 'Prendre des photos', 'Choisir les meilleures'], '34567890-1234-5678-3456-789012345678', (SELECT start_date + INTERVAL '15 days'), (SELECT start_date + INTERVAL '15 days')),
  -- Mission 16 pour Julie
  ('Balade en nature', 'Faites une balade en nature et observez la flore et la faune.', 1, ARRAY['Choisir un lieu', 'Faire la balade', 'Observer les animaux'], '45678901-2345-6789-4567-890123456789', (SELECT start_date + INTERVAL '16 days'), (SELECT start_date + INTERVAL '16 days')),
  -- Mission 17 pour Julie
  ('Atelier de jardinage', 'Participez à un atelier de jardinage.', 2, ARRAY['Assister à l\'atelier', 'Planter des plantes', 'Prendre soin des plantes'], '45678901-2345-6789-4567-890123456789', (SELECT start_date + INTERVAL '17 days'), (SELECT start_date + INTERVAL '17 days')),
  -- Mission 18 pour Julie
  ('Observation astronomique', 'Regardez les étoiles dans un lieu éloigné de la ville.', 2, ARRAY['Trouver un lieu', 'Observer les étoiles', 'Prendre des notes'], '45678901-2345-6789-4567-890123456789', (SELECT start_date + INTERVAL '18 days'), (SELECT start_date + INTERVAL '18 days'));

-- Insérer des relations user_missions (missions assignées aux utilisateurs)
WITH date_offset AS (
  SELECT CURRENT_DATE - INTERVAL '30 days' AS start_date
)
INSERT INTO user_missions (user_id, mission_id, etat, progression, started_at, completed_at, created_at, updated_at)
VALUES 
  -- Alex a commencé la Mission 1
  ('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 1, 'en_cours', 60, (SELECT start_date + INTERVAL '1 day'), NULL, (SELECT start_date + INTERVAL '1 day'), (SELECT start_date + INTERVAL '1 day')),
  -- Alex a terminé la Mission 2
  ('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 2, 'terminee', 100, (SELECT start_date + INTERVAL '2 days'), (SELECT start_date + INTERVAL '3 days'), (SELECT start_date + INTERVAL '2 days'), (SELECT start_date + INTERVAL '3 days')),
  -- Marie a commencé la Mission 3
  ('b2c3d4e5-f678-9012-b2c3-d4e5f6789012', 3, 'en_cours', 30, (SELECT start_date + INTERVAL '3 days'), NULL, (SELECT start_date + INTERVAL '3 days'), (SELECT start_date + INTERVAL '3 days')),
  -- Jean a commencé la Mission 4
  ('c3d4e5f6-7890-1234-c3d4-e5f678901234', 4, 'en_cours', 80, (SELECT start_date + INTERVAL '4 days'), NULL, (SELECT start_date + INTERVAL '4 days'), (SELECT start_date + INTERVAL '4 days')),
  -- Jean a terminé la Mission 5
  ('c3d4e5f6-7890-1234-c3d4-e5f678901234', 5, 'terminee', 100, (SELECT start_date + INTERVAL '5 days'), (SELECT start_date + INTERVAL '6 days'), (SELECT start_date + INTERVAL '5 days'), (SELECT start_date + INTERVAL '6 days')),
  -- Jean a commencé la Mission 6
  ('c3d4e5f6-7890-1234-c3d4-e5f678901234', 6, 'en_cours', 40, (SELECT start_date + INTERVAL '7 days'), NULL, (SELECT start_date + INTERVAL '7 days'), (SELECT start_date + INTERVAL '7 days')),
  -- Sophie a commencé la Mission 7
  ('d4e5f678-9012-3456-d4e5-f67890123456', 7, 'en_cours', 20, (SELECT start_date + INTERVAL '8 days'), NULL, (SELECT start_date + INTERVAL '8 days'), (SELECT start_date + INTERVAL '8 days')),
  -- Pierre a commencé la Mission 8
  ('e5f67890-1234-5678-e5f6-789012345678', 8, 'en_cours', 50, (SELECT start_date + INTERVAL '9 days'), NULL, (SELECT start_date + INTERVAL '9 days'), (SELECT start_date + INTERVAL '9 days')),
  -- Pierre a terminé la Mission 9
  ('e5f67890-1234-5678-e5f6-789012345678', 9, 'terminee', 100, (SELECT start_date + INTERVAL '10 days'), (SELECT start_date + INTERVAL '11 days'), (SELECT start_date + INTERVAL '10 days'), (SELECT start_date + INTERVAL '11 days')),
  -- Claire a commencé la Mission 10
  ('f6789012-3456-7890-f678-901234567890', 10, 'en_cours', 10, (SELECT start_date + INTERVAL '12 days'), NULL, (SELECT start_date + INTERVAL '12 days'), (SELECT start_date + INTERVAL '12 days')),
  -- Thomas a commencé la Mission 11
  ('12345678-9012-3456-1234-567890123456', 11, 'en_cours', 70, (SELECT start_date + INTERVAL '13 days'), NULL, (SELECT start_date + INTERVAL '13 days'), (SELECT start_date + INTERVAL '13 days')),
  -- Thomas a terminé la Mission 12
  ('12345678-9012-3456-1234-567890123456', 12, 'terminee', 100, (SELECT start_date + INTERVAL '14 days'), (SELECT start_date + INTERVAL '15 days'), (SELECT start_date + INTERVAL '14 days'), (SELECT start_date + INTERVAL '15 days')),
  -- Emma a commencé la Mission 13
  ('23456789-0123-4567-2345-678901234567', 13, 'en_cours', 40, (SELECT start_date + INTERVAL '16 days'), NULL, (SELECT start_date + INTERVAL '16 days'), (SELECT start_date + INTERVAL '16 days')),
  -- Luc a commencé la Mission 14
  ('34567890-1234-5678-3456-789012345678', 14, 'en_cours', 30, (SELECT start_date + INTERVAL '17 days'), NULL, (SELECT start_date + INTERVAL '17 days'), (SELECT start_date + INTERVAL '17 days')),
  -- Luc a terminé la Mission 15
  ('34567890-1234-5678-3456-789012345678', 15, 'terminee', 100, (SELECT start_date + INTERVAL '18 days'), (SELECT start_date + INTERVAL '19 days'), (SELECT start_date + INTERVAL '18 days'), (SELECT start_date + INTERVAL '19 days')),
  -- Julie a commencé la Mission 16
  ('45678901-2345-6789-4567-890123456789', 16, 'en_cours', 60, (SELECT start_date + INTERVAL '20 days'), NULL, (SELECT start_date + INTERVAL '20 days'), (SELECT start_date + INTERVAL '20 days')),
  -- Julie a terminé la Mission 17
  ('45678901-2345-6789-4567-890123456789', 17, 'terminee', 100, (SELECT start_date + INTERVAL '21 days'), (SELECT start_date + INTERVAL '22 days'), (SELECT start_date + INTERVAL '21 days'), (SELECT start_date + INTERVAL '22 days')),
  -- Julie a commencé la Mission 18
  ('45678901-2345-6789-4567-890123456789', 18, 'en_cours', 20, (SELECT start_date + INTERVAL '23 days'), NULL, (SELECT start_date + INTERVAL '23 days'), (SELECT start_date + INTERVAL '23 days'));

-- Insérer des interactions sociales
WITH date_offset AS (
  SELECT CURRENT_DATE - INTERVAL '30 days' AS start_date
)
INSERT INTO interactions (user_id, type, target_user_id, message, data, created_at)
VALUES 
  -- Alex a échangé avec Marie
  ('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'échange', 'b2c3d4e5-f678-9012-b2c3-d4e5f6789012', 'Bonjour Marie, j''ai vu ton atelier d''art ! Tu es très talentueuse.', NULL, (SELECT start_date + INTERVAL '2 days')),
  -- Marie a échangé avec Alex
  ('b2c3d4e5-f678-9012-b2c3-d4e5f6789012', 'échange', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'Merci Alex ! Tu as l''air très curieux. Tu veux faire un atelier ensemble ?', NULL, (SELECT start_date + INTERVAL '3 days')),
  -- Jean a échangé avec Sophie
  ('c3d4e5f6-7890-1234-c3d4-e5f678901234', 'échange', 'd4e5f678-9012-3456-d4e5-f67890123456', 'Salut Sophie, j''ai vu tes photos de paysage ! Elles sont magnifiques.', NULL, (SELECT start_date + INTERVAL '5 days')),
  -- Sophie a échangé avec Jean
  ('d4e5f678-9012-3456-d4e5-f67890123456', 'échange', 'c3d4e5f6-7890-1234-c3d4-e5f678901234', 'Merci Jean ! J''adorerais faire une séance photo ensemble.', NULL, (SELECT start_date + INTERVAL '6 days')),
  -- Pierre a échangé avec Claire
  ('e5f67890-1234-5678-e5f6-789012345678', 'échange', 'f6789012-3456-7890-f678-901234567890', 'Bonjour Claire, j''ai entendu parler de ton concert ! Tu es formidable.', NULL, (SELECT start_date + INTERVAL '10 days')),
  -- Claire a échangé avec Pierre
  ('f6789012-3456-7890-f678-901234567890', 'échange', 'e5f67890-1234-5678-e5f6-789012345678', 'Merci Pierre ! J''espère que tu viendras à mon prochain concert.', NULL, (SELECT start_date + INTERVAL '11 days')),
  -- Thomas a échangé avec Emma
  ('12345678-9012-3456-1234-567890123456', 'échange', '23456789-0123-4567-2345-678901234567', 'Salut Emma, j''ai lu ton livre ! C''était très intéressant.', NULL, (SELECT start_date + INTERVAL '14 days')),
  -- Emma a échangé avec Thomas
  ('23456789-0123-4567-2345-678901234567', 'échange', '12345678-9012-3456-1234-567890123456', 'Merci Thomas ! J''espère que tu as aimé. Tu veux lire un autre livre ?', NULL, (SELECT start_date + INTERVAL '15 days')),
  -- Luc a échangé avec Julie
  ('34567890-1234-5678-3456-789012345678', 'échange', '45678901-2345-6789-4567-890123456789', 'Bonjour Julie, j''ai vu tes photos de nature ! Elles sont magnifiques.', NULL, (SELECT start_date + INTERVAL '18 days')),
  -- Julie a échangé avec Luc
  ('45678901-2345-6789-4567-890123456789', 'échange', '34567890-1234-5678-3456-789012345678', 'Merci Luc ! J''adorerais faire une balade en nature ensemble.', NULL, (SELECT start_date + INTERVAL '19 days'));

-- Insérer des événements
WITH date_offset AS (
  SELECT CURRENT_DATE - INTERVAL '30 days' AS start_date
)
INSERT INTO events (user_id, type, description, data, created_at)
VALUES 
  -- Alex a terminé une mission
  ('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'mission_terminee', 'Alex a terminé la mission "Atelier de cuisine"', '{"mission_id": 2, "titre": "Atelier de cuisine"}', (SELECT start_date + INTERVAL '3 days')),
  -- Marie a commencé une mission
  ('b2c3d4e5-f678-9012-b2c3-d4e5f6789012', 'mission_debut', 'Marie a commencé la mission "Exposition artistique"', '{"mission_id": 3, "titre": "Exposition artistique"}', (SELECT start_date + INTERVAL '3 days')),
  -- Jean a terminé une mission
  ('c3d4e5f6-7890-1234-c3d4-e5f678901234', 'mission_terminee', 'Jean a terminé la mission "Atelier de photographie"', '{"mission_id": 5, "titre": "Atelier de photographie"}', (SELECT start_date + INTERVAL '6 days')),
  -- Pierre a terminé une mission
  ('e5f67890-1234-5678-e5f6-789012345678', 'mission_terminee', 'Pierre a terminé la mission "Cours de yoga"', '{"mission_id": 9, "titre": "Cours de yoga"}', (SELECT start_date + INTERVAL '11 days')),
  -- Claire a commencé une mission
  ('f6789012-3456-7890-f678-901234567890', 'mission_debut', 'Claire a commencé la mission "Concert de musique"', '{"mission_id": 10, "titre": "Concert de musique"}', (SELECT start_date + INTERVAL '12 days')),
  -- Thomas a terminé une mission
  ('12345678-9012-3456-1234-567890123456', 'mission_terminee', 'Thomas a terminé la mission "Atelier de pâtisserie"', '{"mission_id": 12, "titre": "Atelier de pâtisserie"}', (SELECT start_date + INTERVAL '15 days')),
  -- Emma a commencé une mission
  ('23456789-0123-4567-2345-678901234567', 'mission_debut', 'Emma a commencé la mission "Lecture de livre"', '{"mission_id": 13, "titre": "Lecture de livre"}', (SELECT start_date + INTERVAL '16 days')),
  -- Luc a terminé une mission
  ('34567890-1234-5678-3456-789012345678', 'mission_terminee', 'Luc a terminé la mission "Photographie de paysage"', '{"mission_id": 15, "titre": "Photographie de paysage"}', (SELECT start_date + INTERVAL '19 days')),
  -- Julie a terminé une mission
  ('45678901-2345-6789-4567-890123456789', 'mission_terminee', 'Julie a terminé la mission "Atelier de jardinage"', '{"mission_id": 17, "titre": "Atelier de jardinage"}', (SELECT start_date + INTERVAL '22 days')),
  -- Julie a commencé une mission
  ('45678901-2345-6789-4567-890123456789', 'mission_debut', 'Julie a commencé la mission "Observation astronomique"', '{"mission_id": 18, "titre": "Observation astronomique"}', (SELECT start_date + INTERVAL '23 days'));

-- Afficher un message de confirmation
SELECT 'Données de test insérées avec succès : 10 utilisateurs, 18 missions, 18 relations user_missions, 10 interactions, 10 événements' AS message;
