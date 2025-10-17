-- Tabla para jugadores favoritos de jugadores
CREATE TABLE IF NOT EXISTS player_favorite_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  favorite_player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, favorite_player_id),
  CHECK (user_id != favorite_player_id) -- Un usuario no puede añadirse a sí mismo
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_player_favorite_players_user_id ON player_favorite_players(user_id);
CREATE INDEX IF NOT EXISTS idx_player_favorite_players_favorite_id ON player_favorite_players(favorite_player_id);

-- RLS Policies
ALTER TABLE player_favorite_players ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver sus propios favoritos
CREATE POLICY "Users can view their own favorite players"
  ON player_favorite_players
  FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden añadir favoritos
CREATE POLICY "Users can add favorite players"
  ON player_favorite_players
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus favoritos
CREATE POLICY "Users can remove favorite players"
  ON player_favorite_players
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comentarios
COMMENT ON TABLE player_favorite_players IS 'Jugadores favoritos de cada usuario';
COMMENT ON COLUMN player_favorite_players.user_id IS 'Usuario que marca el favorito';
COMMENT ON COLUMN player_favorite_players.favorite_player_id IS 'Jugador marcado como favorito';
