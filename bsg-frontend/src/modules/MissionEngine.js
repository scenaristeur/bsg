// Logique métier des missions imbriquées
// Appels webhooks n8n pour génération IA
// Gestion objets partagés entre scénarios
// Tests : génération mission, mise à jour objets

export class MissionEngine {
    constructor(supabaseManager, webhookManager) {
        this.supabase = supabaseManager.getClient();
        this.webhookManager = webhookManager;
        if (!this.supabase) {
            console.error('Supabase non initialisé dans MissionEngine');
        }
    }

    // Générer une nouvelle mission via n8n
    async generateMission(userId, location, preferences) {
        try {
            // Appel au webhook n8n pour générer la mission
            const result = await this.webhookManager.callN8nWebhook(
                'generate-mission',
                { userId, location, preferences }
            );

            if (!result.success) {
                throw new Error(`Erreur lors de la génération de mission: ${result.error}`);
            }

            // Si la génération est réussie, enregistrer la mission dans Supabase
            const missionData = result.n8nResult;

            // Création de la mission dans la base de données
            const { data, error } = await this.supabase
                .from('missions')
                .insert([{
                    titre: missionData.titre,
                    description: missionData.description,
                    difficulte: missionData.difficulte,
                    objectifs: missionData.objectifs,
                    indices: missionData.indices,
                    created_by: userId
                }]);

            if (error) {
                throw new Error(`Erreur lors de l'enregistrement de la mission: ${error.message}`);
            }

            // Assigner la mission à l'utilisateur
            const missionId = data[0].id;
            await this.assignMissionToUser(missionId, userId, 'createur');

            return { success: true, mission: data[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Assigner une mission à un utilisateur
    async assignMissionToUser(missionId, userId, role = 'participant') {
        try {
            const { data, error } = await this.supabase
                .from('user_missions')
                .insert([{
                    mission_id: missionId,
                    user_id: userId,
                    role: role,
                    statut: 'initie'
                }]);

            if (error) {
                throw new Error(`Erreur lors de l'assignation de la mission: ${error.message}`);
            }

            return { success: true, assignment: data[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Récupérer les missions d'un utilisateur
    async getUserMissions(userId) {
        try {
            const { data, error } = await this.supabase
                .from('missions')
                .select(`
          *,
          user_missions (
            role,
            statut
          )
        `)
                .eq('user_missions.user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw new Error(`Erreur lors de la récupération des missions: ${error.message}`);
            }

            return { success: true, missions: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Mettre à jour le statut d'une mission
    async updateMissionStatus(missionId, status) {
        try {
            const { data, error } = await this.supabase
                .from('user_missions')
                .update({ statut: status })
                .eq('mission_id', missionId);

            if (error) {
                throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
            }

            return { success: true, updated: data[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Gérer les objets partagés entre missions
    async manageSharedObject(objectData) {
        try {
            // Vérifier si l'objet existe déjà
            const { data: existingObject, error: existingError } = await this.supabase
                .from('shared_objects')
                .select('*')
                .eq('reference_key', objectData.reference_key)
                .single();

            if (existingError && existingError.code !== 'PGRST116') {
                throw new Error(`Erreur lors de la vérification de l'objet: ${existingError.message}`);
            }

            let result;
            if (existingObject) {
                // Mettre à jour l'objet existant
                const { data, error } = await this.supabase
                    .from('shared_objects')
                    .update(objectData)
                    .eq('id', existingObject.id);

                if (error) {
                    throw new Error(`Erreur lors de la mise à jour de l'objet: ${error.message}`);
                }
                result = data[0];
            } else {
                // Créer un nouvel objet
                const { data, error } = await this.supabase
                    .from('shared_objects')
                    .insert([objectData]);

                if (error) {
                    throw new Error(`Erreur lors de la création de l'objet: ${error.message}`);
                }
                result = data[0];
            }

            return { success: true, object: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Vérifier si un objet partagé déclenche une nouvelle mission
    async checkForTriggeredMissions(sharedObjectId) {
        try {
            const { data, error } = await this.supabase
                .from('shared_objects')
                .select('*')
                .eq('id', sharedObjectId)
                .single();

            if (error) {
                throw new Error(`Erreur lors de la vérification de l'objet: ${error.message}`);
            }

            // Vérifier si cet objet déclenche une mission
            // Cela pourrait impliquer une logique métier spécifique
            // Pour l'instant, on retourne simplement l'objet
            return { success: true, object: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
