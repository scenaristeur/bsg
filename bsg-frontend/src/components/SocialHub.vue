<template>
    <div class="social-hub">
        <header class="social-header">
            <h1>Centre Social</h1>
            <div class="social-controls">
                <button @click="showChat = !showChat" class="btn-secondary">
                    {{ showChat ? 'Masquer le chat' : 'Afficher le chat' }}
                </button>
                <button @click="showFriends = !showFriends" class="btn-secondary">
                    {{ showFriends ? 'Masquer les amis' : 'Afficher les amis' }}
                </button>
            </div>
        </header>

        <div class="social-content">
            <!-- Panneau des amis -->
            <div v-if="showFriends" class="friends-panel">
                <h2>Mes Amis</h2>
                <div v-if="loadingFriends" class="loading">
                    Chargement des amis...
                </div>
                <div v-else-if="friends.length === 0" class="empty-state">
                    <p>Vous n'avez pas encore d'amis.</p>
                    <button @click="searchUsers" class="btn-primary">
                        Chercher des utilisateurs
                    </button>
                </div>
                <div v-else class="friends-list">
                    <div v-for="friend in friends" :key="friend.id" class="friend-item">
                        <div class="friend-avatar">
                            <img :src="friend.avatar" :alt="friend.pseudo" v-if="friend.avatar">
                            <span v-else class="avatar-placeholder">{{ friend.pseudo.charAt(0) }}</span>
                        </div>
                        <div class="friend-info">
                            <h3>{{ friend.pseudo }}</h3>
                            <p class="friend-status">{{ getStatusLabel(friend.lastSeen) }}</p>
                        </div>
                        <div class="friend-actions">
                            <button @click="startChat(friend)" class="btn-small">
                                Message
                            </button>
                            <button @click="removeFriend(friend.id)" class="btn-small btn-danger">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Panneau de chat -->
            <div v-if="showChat" class="chat-panel">
                <h2>Discussion</h2>
                <div v-if="loadingMessages" class="loading">
                    Chargement des messages...
                </div>
                <div v-else-if="!selectedFriend" class="chat-placeholder">
                    <p>Sélectionnez un ami pour commencer une discussion</p>
                </div>
                <div v-else class="chat-container">
                    <div class="chat-messages">
                        <div v-for="message in messages" :key="message.id"
                            :class="['message-item', { 'own-message': message.sender_id === currentUser?.id }]">
                            <div class="message-content">
                                <p>{{ message.content }}</p>
                                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-input">
                        <input v-model="newMessage" @keyup.enter="sendMessage" type="text"
                            placeholder="Tapez votre message..." :disabled="!selectedFriend">
                        <button @click="sendMessage" :disabled="!newMessage.trim() || !selectedFriend">
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>

            <!-- Zone de recherche d'utilisateurs -->
            <div v-if="showUserSearch" class="search-panel">
                <h2>Chercher des utilisateurs</h2>
                <div class="search-controls">
                    <input v-model="searchQuery" type="text" placeholder="Rechercher par pseudo, nom ou prénom..."
                        class="search-input">
                    <button @click="searchUsers" class="btn-primary">
                        Rechercher
                    </button>
                </div>
                <div v-if="loadingSearch" class="loading">
                    Recherche en cours...
                </div>
                <div v-else-if="searchResults.length === 0" class="empty-state">
                    <p>Aucun utilisateur trouvé.</p>
                </div>
                <div v-else class="search-results">
                    <div v-for="user in searchResults" :key="user.id" class="user-result">
                        <div class="user-avatar">
                            <img :src="user.avatar" :alt="user.pseudo" v-if="user.avatar">
                            <span v-else class="avatar-placeholder">{{ user.pseudo.charAt(0) }}</span>
                        </div>
                        <div class="user-info">
                            <h3>{{ user.pseudo }}</h3>
                            <p>{{ user.nom }} {{ user.prenom }}</p>
                        </div>
                        <button @click="addFriend(user)" :disabled="isFriend(user.id)" class="btn-primary">
                            {{ isFriend(user.id) ? 'Ami' : 'Ajouter' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name: 'SocialHub',
    data() {
        return {
            showChat: true,
            showFriends: true,
            showUserSearch: false,
            loadingFriends: false,
            loadingMessages: false,
            loadingSearch: false,
            searchQuery: '',
            searchResults: [],
            selectedFriend: null,
            newMessage: '',
            messages: []
        }
    },
    computed: {
        ...mapState('auth', ['user']),
        ...mapGetters('auth', ['currentUser']),
        ...mapGetters('social', ['friends', 'unreadMessages']),
        friendsCount() {
            return this.friends.length
        },
        unreadNotifications() {
            return this.unreadMessages
        }
    },
    async mounted() {
        await this.loadFriends()
    },
    methods: {
        ...mapActions('social', [
            'loadUserFriends',
            'loadUserMessages',
            'sendMessage',
            'addFriend',
            'removeFriend'
        ]),

        async loadFriends() {
            this.loadingFriends = true
            try {
                const result = await this.loadUserFriends(this.user?.id)
                if (!result.success) {
                    console.error('Erreur lors du chargement des amis:', result.error)
                }
            } catch (error) {
                console.error('Erreur lors du chargement des amis:', error)
            } finally {
                this.loadingFriends = false
            }
        },

        async loadMessages(friendId) {
            this.loadingMessages = true
            try {
                const result = await this.loadUserMessages({
                    userId: this.user?.id,
                    targetUserId: friendId
                })
                if (result.success) {
                    this.messages = result.messages
                } else {
                    console.error('Erreur lors du chargement des messages:', result.error)
                }
            } catch (error) {
                console.error('Erreur lors du chargement des messages:', error)
            } finally {
                this.loadingMessages = false
            }
        },

        async startChat(friend) {
            this.selectedFriend = friend
            await this.loadMessages(friend.id)
        },

        async sendMessage() {
            if (!this.newMessage.trim() || !this.selectedFriend) return

            try {
                const result = await this.sendMessage({
                    sender_id: this.user?.id,
                    receiver_id: this.selectedFriend.id,
                    content: this.newMessage.trim()
                })

                if (result.success) {
                    // Ajouter le message envoyé à la liste
                    this.messages.push(result.message)
                    this.newMessage = ''
                } else {
                    console.error('Erreur lors de l\'envoi du message:', result.error)
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error)
            }
        },

        async searchUsers() {
            this.loadingSearch = true
            try {
                // Simuler une recherche d'utilisateurs
                this.searchResults = [
                    {
                        id: 1,
                        pseudo: 'Utilisateur1',
                        nom: 'Dupont',
                        prenom: 'Jean',
                        avatar: '/avatars/user1.jpg',
                        lastSeen: new Date().toISOString()
                    },
                    {
                        id: 2,
                        pseudo: 'Utilisateur2',
                        nom: 'Martin',
                        prenom: 'Marie',
                        avatar: '/avatars/user2.jpg',
                        lastSeen: new Date().toISOString()
                    }
                ]
            } catch (error) {
                console.error('Erreur lors de la recherche:', error)
            } finally {
                this.loadingSearch = false
            }
        },

        isFriend(userId) {
            return this.friends.some(friend => friend.id === userId)
        },

        getStatusLabel(lastSeen) {
            if (!lastSeen) return 'Inconnu'

            const now = new Date()
            const lastSeenDate = new Date(lastSeen)
            const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60))

            if (diffMinutes < 5) {
                return 'En ligne'
            } else if (diffMinutes < 60) {
                return `${diffMinutes} min`
            } else if (diffMinutes < 1440) {
                return `${Math.floor(diffMinutes / 60)} h`
            } else {
                return 'Hors ligne'
            }
        },

        formatTime(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    }
}
</script>

<style scoped>
.social-hub {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.social-header {
    background-color: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.social-header h1 {
    margin: 0;
    color: #333;
}

.social-controls {
    display: flex;
    gap: 0.5rem;
}

.btn-secondary {
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-secondary:hover {
    background-color: #545b62;
}

.social-content {
    display: flex;
    padding: 2rem;
    gap: 2rem;
}

.friends-panel,
.chat-panel,
.search-panel {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    flex: 1;
}

.friends-panel h2,
.chat-panel h2,
.search-panel h2 {
    margin: 0 0 1rem 0;
    color: #333;
}

.friends-list,
.search-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.friend-item,
.user-result {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    transition: all 0.2s;
}

.friend-item:hover,
.user-result:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.friend-avatar,
.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #007bff;
    color: white;
    font-weight: bold;
}

.avatar-placeholder {
    font-size: 1.2rem;
}

.friend-info,
.user-info {
    flex: 1;
}

.friend-info h3,
.user-info h3 {
    margin: 0 0 0.25rem 0;
    color: #333;
}

.friend-status {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

.friend-actions,
.user-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-small {
    padding: 0.25rem 0.5rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.8rem;
}

.btn-small:hover {
    background-color: #545b62;
}

.btn-danger {
    background-color: #dc3545;
}

.btn-danger:hover {
    background-color: #c82333;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 400px;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.message-item {
    display: flex;
    max-width: 70%;
}

.own-message {
    align-self: flex-end;
}

.message-content {
    background-color: #e3f2fd;
    padding: 0.75rem 1rem;
    border-radius: 18px;
    position: relative;
}

.own-message .message-content {
    background-color: #007bff;
    color: white;
}

.message-content p {
    margin: 0 0 0.25rem 0;
}

.message-time {
    font-size: 0.7rem;
    opacity: 0.8;
    text-align: right;
}

.chat-input {
    display: flex;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.chat-input input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.chat-input button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.chat-input button:hover:not(:disabled) {
    background-color: #0056b3;
}

.chat-input button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.chat-placeholder {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.search-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.search-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-primary {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.loading,
.empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
}
</style>
