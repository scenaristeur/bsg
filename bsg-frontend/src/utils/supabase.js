// Configuration du client Supabase pour le frontend
import { createClient } from '@supabase/supabase-js'

// Récupération des variables d'environnement depuis le fichier .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérification des variables d'environnement
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Erreur: Variables d\'environnement Supabase manquantes')
    throw new Error('Variables d\'environnement Supabase manquantes')
}

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
