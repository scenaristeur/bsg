// Fichier de configuration Supabase
import { createClient } from '@supabase/supabase-js'

// Lecture des variables d'environnement depuis le fichier .env
import fs from 'fs'
import path from 'path'

// Chemin vers le fichier .env (dans le répertoire parent)
const envPath = path.join(process.cwd(), '.env')
const envContent = fs.readFileSync(envPath, 'utf8')

// Extraction des variables d'environnement
const SUPABASE_URL = envContent.match(/SUPABASE_URL=(.*)/)?.[1]?.trim()
const SUPABASE_KEY = envContent.match(/SUPABASE_KEY=(.*)/)?.[1]?.trim()

// Vérification des variables d'environnement
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Erreur: Les identifiants Supabase ne sont pas définis dans le fichier .env')
    process.exit(1)
}

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
