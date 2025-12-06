import { Metadata } from 'next'

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  try {
    // Obtener datos del jugador para metadata
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/players/${params.id}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return {
        title: 'Jugador no encontrado | Padeliner',
        description: 'Perfil de jugador no disponible'
      }
    }

    const player = await res.json()
    const displayName = player.display_name || player.user?.full_name || 'Jugador'
    const level = player.skill_level || 'jugador'
    
    return {
      title: `${displayName} - Perfil de Jugador | Padeliner`,
      description: player.bio || `Perfil de ${displayName}, ${level} de pádel. ${player.total_sessions_completed} sesiones completadas, ${Math.round(player.total_hours_trained)} horas entrenadas.`,
      openGraph: {
        title: `${displayName} - Perfil de Jugador`,
        description: player.bio || `${level} de pádel en Padeliner`,
        images: player.user?.avatar_url ? [player.user.avatar_url] : [],
        type: 'profile'
      },
      twitter: {
        card: 'summary',
        title: `${displayName} - Perfil de Jugador`,
        description: player.bio || `${level} de pádel en Padeliner`,
        images: player.user?.avatar_url ? [player.user.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Perfil de Jugador | Padeliner',
      description: 'Perfil de jugador de pádel en Padeliner'
    }
  }
}

export default function PlayerProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
