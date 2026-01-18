-- Script de création de la base de données Supabase pour l'application BSG
-- Ce script crée toutes les tables nécessaires pour l'application BSG

-- Activation de l'extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table users (étend auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  pseudo VARCHAR(100),
  nom VARCHAR(100),
  prenom VARCHAR(100),
  competences TEXT[],
  historique TEXT[],
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la fonction pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Création du trigger pour la table users (si non existant)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_users_updated_at' AND tgrelid = 'users'::regclass
    ) THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Table poi (Points d'intérêt avec PostGIS)
CREATE TABLE IF NOT EXISTS poi (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  geom GEOMETRY(Point, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de l'index spatial pour les requêtes géolocalisées
CREATE INDEX IF NOT EXISTS idx_poi_geom ON poi USING GIST(geom);

-- Création du trigger pour la table poi (si non existant)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_poi_updated_at' AND tgrelid = 'poi'::regclass
    ) THEN
        CREATE TRIGGER update_poi_updated_at BEFORE UPDATE ON poi FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Table missions
CREATE TABLE IF NOT EXISTS missions (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  niveau_difficulte INTEGER,
  objectifs TEXT[],
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création du trigger pour la table missions (si non existant)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_missions_updated_at' AND tgrelid = 'missions'::regclass
    ) THEN
        CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Table mission_poi (relation missions ↔ POIs)
CREATE TABLE IF NOT EXISTS mission_poi (
  mission_id INTEGER REFERENCES missions(id) ON DELETE CASCADE,
  poi_id INTEGER REFERENCES poi(id) ON DELETE CASCADE,
  ordre INTEGER,
  PRIMARY KEY (mission_id, poi_id)
);

-- Table user_missions (progression des utilisateurs)
CREATE TABLE IF NOT EXISTS user_missions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_id INTEGER REFERENCES missions(id) ON DELETE CASCADE,
  etat VARCHAR(50) DEFAULT 'en_cours',
  progression INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création du trigger pour la table user_missions (si non existant)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_user_missions_updated_at' AND tgrelid = 'user_missions'::regclass
    ) THEN
        CREATE TRIGGER update_user_missions_updated_at BEFORE UPDATE ON user_missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Table events (journal de toutes les actions)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(100) NOT NULL,
  description TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table shared_objects (objets liant les scénarios)
CREATE TABLE IF NOT EXISTS shared_objects (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  proprietaire_id UUID REFERENCES users(id),
  statut VARCHAR(50) DEFAULT 'disponible',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création du trigger pour la table shared_objects (si non existant)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_shared_objects_updated_at' AND tgrelid = 'shared_objects'::regclass
    ) THEN
        CREATE TRIGGER update_shared_objects_updated_at BEFORE UPDATE ON shared_objects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Table interactions (échanges entre joueurs)
CREATE TABLE IF NOT EXISTS interactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(100) NOT NULL,
  target_user_id UUID REFERENCES users(id),
  message TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table help_requests (demandes d'aide)
CREATE TABLE IF NOT EXISTS help_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(100) NOT NULL,
  description TEXT,
  statut VARCHAR(50) DEFAULT 'ouverte',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création du trigger pour la table help_requests (si non existant)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_help_requests_updated_at' AND tgrelid = 'help_requests'::regclass
    ) THEN
        CREATE TRIGGER update_help_requests_updated_at BEFORE UPDATE ON help_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Activation de RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE poi ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_poi ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour la table users
-- Autoriser les utilisateurs à voir leur propre profil
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (id = auth.uid());

-- Autoriser les utilisateurs à créer leur propre profil
CREATE POLICY "Users can create their own profile" ON users
FOR INSERT WITH CHECK (id = auth.uid());

-- Autoriser les utilisateurs à mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (id = auth.uid());

-- Autoriser les utilisateurs à supprimer leur propre profil
CREATE POLICY "Users can delete their own profile" ON users
FOR DELETE USING (id = auth.uid());

-- Création de la table de test "truc"
CREATE TABLE IF NOT EXISTS truc (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affichage des tables créées
SELECT 'Tables créées avec succès : users, poi, missions, mission_poi, user_missions, events, shared_objects, interactions, help_requests, truc' AS message;
