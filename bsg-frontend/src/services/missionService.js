// Service pour gérer les opérations liées aux missions
// Utilise directement Supabase au lieu du backend REST

import { supabase } from '../utils/supabase'

export const missionService = {
    // Récupérer les missions d'un utilisateur
    async getUserMissions(userId) {
        try {
            console.log('Récupération des missions de l\'utilisateur via Supabase:', userId);

            // Récupérer les missions créées par l'utilisateur (utilisant created_by)
            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .eq('created_by', userId)
                .order('created_at', { ascending: false })
            console.log("DATA", data)

            if (error) {
                console.error('Erreur lors de la récupération des missions:', error);
                throw error;
            }

            console.log('Missions récupérées via Supabase:', data);
            // Afficher les missions dans la console comme demandé
            console.log('=== LISTE DES MISSIONS ===');
            data.forEach((mission, index) => {
                console.log(`${index + 1}. ${mission.titre || 'Sans titre'} - ${mission.description || 'Pas de description'}`);
            });
            console.log('==========================');
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des missions:', error);
            throw error;
        }
    },

    // Récupérer toutes les missions (pour référence)
    async getAllMissions() {
        try {
            console.log('Récupération de toutes les missions via Supabase');

            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur lors de la récupération des missions:', error);
                throw error;
            }

            console.log('Toutes les missions récupérées:', data);
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des missions:', error);
            throw error;
        }
    },

    // Créer une nouvelle mission
    async createMission(missionData) {
        try {
            console.log('Création d\'une nouvelle mission via Supabase:', missionData);

            // Créer la mission dans la table missions
            const { data: missionDataResult, error: missionError } = await supabase
                .from('missions')
                .insert([{
                    titre: missionData.titre,
                    description: missionData.description,
                    niveau_difficulte: missionData.difficulte,
                    objectifs: missionData.objectifs
                }])
                .select()
                .single();

            if (missionError) {
                console.error('Erreur lors de la création de la mission:', missionError);
                throw missionError;
            }

            console.log('Mission créée:', missionDataResult);
            return missionDataResult;
        } catch (error) {
            console.error('Erreur lors de la création de la mission:', error);
            throw error;
        }
    },

    // Générer une mission via N8N (via webhook)
    async generateMission(userId, location, preferences) {
        try {
            console.log('Génération de mission via N8N pour l\'utilisateur:', userId);

            // Récupérer l'URL du webhook n8n depuis les variables d'environnement
            const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
            if (!n8nWebhookUrl) {
                throw new Error('Variable d\'environnement VITE_N8N_WEBHOOK_URL non définie');
            }

            // Récupérer les informations de l'utilisateur
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (userError) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', userError);
                throw userError;
            }

            // Données à envoyer à n8n
            const n8nPayload = {
                user: {
                    id: userData.id,
                    pseudo: userData.pseudo || userData.user_metadata?.pseudo || '',
                    prenom: userData.prenom || userData.user_metadata?.prenom || '',
                    nom: userData.nom || userData.user_metadata?.nom || '',
                    email: userData.email,
                    preferencesRencontre: userData.preferencesRencontre || {}
                },
                chatInput: `Génère une mission personnalisée pour l'utilisateur ${userData.prenom || userData.user_metadata?.prenom || 'Utilisateur'} ${userData.nom || userData.user_metadata?.nom || 'Inconnu'}. 
                Crée une mission captivante dans le style de l'application BSG avec un titre, une description, un niveau de difficulté, des objectifs et des indices.`
            };

            console.log('Envoi de la requête à n8n:', n8nPayload);

            // Effectuer l'appel HTTP vers le webhook n8n
            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(n8nPayload)
            });

            console.log('Réponse n8n:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erreur n8n:', errorText);
                throw new Error(`Erreur HTTP de n8n: ${response.status} - ${response.statusText} - ${errorText}`);
            }

            const n8nData = await response.json();
            console.log('Données reçues de n8n:', n8nData);

            return n8nData;
        } catch (error) {
            console.error('Erreur lors de la génération de la mission:', error);
            throw error;
        }
    }
}
