<template>
    <div class="user-list-container">
        <h2>Liste des Utilisateurs</h2>

        <div class="user-controls">
            <button @click="fetchUsers" :disabled="loading" class="refresh-button">
                {{ loading ? 'Chargement...' : 'Actualiser' }}
            </button>
        </div>

        <div v-if="loading" class="loading">
            Chargement des utilisateurs...
        </div>

        <div v-else-if="error" class="error">
            {{ error }}
        </div>

        <div v-else-if="users.length === 0" class="no-users">
            Aucun utilisateur trouvé.
        </div>

        <table v-else class="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Pseudo</th>
                    <th>Email</th>
                    <th>Date de création</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.nom }}</td>
                    <td>{{ user.prenom }}</td>
                    <td>{{ user.pseudo }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                    <td>
                        <button @click="deleteUser(user.id)" :disabled="deletingId === user.id" class="delete-button">
                            {{ deletingId === user.id ? 'Suppression...' : 'Supprimer' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { userService } from '../services/userService'

export default {
    name: 'UserList',
    data() {
        return {
            users: [],
            loading: false,
            error: null,
            deletingId: null
        }
    },
    mounted() {
        // Vérification de l'authentification
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        if (!isLoggedIn) {
            this.$router.push('/login')
            return
        }

        this.fetchUsers()
    },
    methods: {
        async fetchUsers() {
            this.loading = true
            this.error = null

            try {
                const users = await userService.getUsers()
                this.users = users
            } catch (err) {
                this.error = 'Erreur lors de la récupération des utilisateurs: ' + err.message
            } finally {
                this.loading = false
            }
        },
        async deleteUser(userId) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                return
            }

            this.deletingId = userId
            try {
                await userService.deleteUser(userId)
                // Retirer l'utilisateur supprimé de la liste
                this.users = this.users.filter(user => user.id !== userId)
            } catch (err) {
                this.error = 'Erreur lors de la suppression de l\'utilisateur: ' + err.message
            } finally {
                this.deletingId = null
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    }
}
</script>

<style scoped>
.user-list-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-list-container h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
}

.user-controls {
    text-align: center;
    margin-bottom: 1.5rem;
}

.refresh-button {
    padding: 0.75rem 1.5rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.refresh-button:hover:not(:disabled) {
    background-color: #5a6268;
}

.refresh-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.loading,
.error,
.no-users {
    text-align: center;
    padding: 1rem;
    margin: 1rem 0;
}

.loading {
    color: #007bff;
}

.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
}

.no-users {
    color: #6c757d;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.user-table th,
.user-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.user-table th {
    background-color: #f8f9fa;
    font-weight: bold;
    color: #333;
}

.user-table tr:hover {
    background-color: #f5f5f5;
}

.delete-button {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.delete-button:hover:not(:disabled) {
    background-color: #c82333;
}

.delete-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}
</style>
