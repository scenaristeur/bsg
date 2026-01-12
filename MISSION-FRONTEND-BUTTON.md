# Bouton "Générer une nouvelle mission" - Frontend Vue.js

## Description

Ce composant Vue.js permet aux utilisateurs de générer une nouvelle mission via le backend, qui lancera le workflow n8n. Le bouton est intégré dans l'interface de jeu de l'application BSG.

## Fonctionnalités

- Bouton "Générer une nouvelle mission" dans l'interface utilisateur
- Appel au backend pour créer une mission temporaire
- Lancement du workflow n8n pour générer la mission complète
- Mise à jour de la mission avec les données retournées par n8n
- Feedback visuel pendant le processus de génération

## Structure du composant

```vue
<template>
  <div class="generate-mission-section">
    <button
      @click="generateNewMission"
      :disabled="isGenerating"
      class="generate-mission-btn"
    >
      {{
        isGenerating ? "Génération en cours..." : "Générer une nouvelle mission"
      }}
    </button>

    <div v-if="missionStatus" class="mission-status">
      <p>{{ missionStatus }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";

export default {
  name: "GenerateMissionButton",
  setup() {
    const userStore = useUserStore();
    const isGenerating = ref(false);
    const missionStatus = ref("");

    const generateNewMission = async () => {
      if (!userStore.currentUser) {
        missionStatus.value =
          "Veuillez vous connecter pour générer une mission";
        return;
      }

      isGenerating.value = true;
      missionStatus.value = "Création de la mission...";

      try {
        // Appel au backend pour créer une mission temporaire
        const response = await fetch("/api/missions/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userStore.token}`,
          },
          body: JSON.stringify({
            userId: userStore.currentUser.id,
            location: userStore.currentUser.location || {},
            preferences: userStore.currentUser.preferencesRencontre || {},
          }),
        });

        const data = await response.json();

        if (response.ok) {
          missionStatus.value = `Mission créée avec ID: ${data.missionId}. Génération en cours via l'agent n8n...`;

          // Ici, vous pouvez implémenter un système de polling pour surveiller l'avancement
          // ou utiliser un websocket pour recevoir les mises à jour

          // Pour l'instant, on simule la génération via n8n
          setTimeout(() => {
            // Simuler l'appel au workflow n8n
            simulateN8nWorkflow(data.missionId);
          }, 1000);
        } else {
          missionStatus.value = `Erreur: ${
            data.error || "Impossible de créer la mission"
          }`;
        }
      } catch (error) {
        console.error("Erreur lors de la génération de mission:", error);
        missionStatus.value =
          "Erreur réseau lors de la génération de la mission";
      } finally {
        isGenerating.value = false;
      }
    };

    const simulateN8nWorkflow = async (missionId) => {
      try {
        // Simulation de l'appel au workflow n8n
        const response = await fetch("/api/n8n/generate-mission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userStore.token}`,
          },
          body: JSON.stringify({
            userId: userStore.currentUser.id,
            location: userStore.currentUser.location || {},
            preferences: userStore.currentUser.preferencesRencontre || {},
          }),
        });

        const data = await response.json();

        if (response.ok) {
          missionStatus.value =
            "Mission en cours de génération par l'agent n8n...";

          // Simuler la mise à jour de la mission avec les données retournées
          setTimeout(() => {
            updateMissionWithN8nData(missionId);
          }, 2000);
        } else {
          missionStatus.value = `Erreur lors du lancement du workflow: ${
            data.error || "Inconnue"
          }`;
        }
      } catch (error) {
        console.error("Erreur lors du lancement du workflow n8n:", error);
        missionStatus.value = "Erreur réseau lors du lancement du workflow";
      }
    };

    const updateMissionWithN8nData = async (missionId) => {
      try {
        // Simulation de la mise à jour de la mission avec les données de n8n
        // Dans une implémentation réelle, cela viendrait du webhook n8n
        const updatedMission = {
          id: missionId,
          titre: "Mission de test - Générée par l'agent n8n",
          description:
            "Mission créée automatiquement par l'agent IA selon vos préférences.",
          difficulte: "Moyen",
          objectifs:
            "Compléter la mission, Trouver l'indice, Interagir avec le partenaire",
          indices: "L'indice se trouve dans le café de la place Bellecour",
        };

        // Appel à l'API pour mettre à jour la mission
        const response = await fetch(`/api/missions/${missionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userStore.token}`,
          },
          body: JSON.stringify(updatedMission),
        });

        if (response.ok) {
          missionStatus.value = "Mission générée avec succès !";
          // Vous pouvez ici rediriger vers la page de la mission ou rafraîchir l'affichage
        } else {
          const errorData = await response.json();
          missionStatus.value = `Erreur lors de la mise à jour: ${
            errorData.error || "Inconnue"
          }`;
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la mission:", error);
        missionStatus.value =
          "Erreur réseau lors de la mise à jour de la mission";
      }
    };

    return {
      isGenerating,
      missionStatus,
      generateNewMission,
    };
  },
};
</script>

<style scoped>
.generate-mission-section {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
}

.generate-mission-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.generate-mission-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.generate-mission-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.mission-status {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  background-color: #e8f5e8;
  color: #2e7d32;
}
</style>
```

## Intégration dans l'application

Pour intégrer ce composant dans l'application, vous pouvez l'ajouter dans la vue appropriée (par exemple, dans `src/views/GameView.vue` ou `src/components/game/MissionsView.vue`):

```vue
<!-- Dans le template -->
<GenerateMissionButton />

<!-- Dans le script -->
import GenerateMissionButton from '@/components/GenerateMissionButton.vue'
```

## API Backend utilisée

Le composant utilise les endpoints suivants du backend :

1. `POST /api/missions/generate` - Crée une mission temporaire
2. `POST /api/n8n/generate-mission` - Lance le workflow n8n pour générer la mission
3. `PUT /api/missions/{id}` - Met à jour la mission avec les données retournées

## Notes importantes

- Le composant utilise le store utilisateur pour accéder aux informations de l'utilisateur connecté
- Le workflow n8n est simulé dans cet exemple, mais dans une implémentation réelle, il serait appelé directement
- Le composant gère les états de chargement et les erreurs
- Les données retournées par n8n sont utilisées pour mettre à jour la mission dans la base de données
