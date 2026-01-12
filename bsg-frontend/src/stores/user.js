import { defineStore } from 'pinia'
import { userService } from '../services/userService'

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: null,
        isLoggedIn: false,
        currentMeeting: null // Pour gérer les sessions de rencontre
    }),

    actions: {
        async login(email, password) {
            try {
                const credentials = { email, password }
                const result = await userService.loginUser(credentials)

                this.currentUser = result.user
                this.isLoggedIn = true
                console.log(this.currentUser)
                return { success: true, user: result.user }
            } catch (error) {
                return { success: false, error: error.message }
            }
        },

        async logout() {
            this.currentUser = null
            this.isLoggedIn = false
            this.currentMeeting = null
        },

        async register(userData) {
            try {
                const result = await userService.createUser(userData)

                this.currentUser = result.user
                this.isLoggedIn = true

                return { success: true, user: result.user }
            } catch (error) {
                return { success: false, error: error.message }
            }
        },

        setCurrentUser(user) {
            console.log("set user", user)
            this.currentUser = user
            this.isLoggedIn = true
        },

        setCurrentMeeting(meeting) {
            this.currentMeeting = meeting
        },

        clearCurrentMeeting() {
            this.currentMeeting = null
        }
    }

    // persist: true // Permet de conserver les données dans le localStorage
    // Supprimé pour uniformiser l'utilisation du store
})
