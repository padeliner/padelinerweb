export interface Coach {
  id: number
  name: string
  specialties: string[]
  experience: number
  rating: number
  reviewsCount: number
  pricePerHour: number
  location: string
  city: string
  lat: number
  lng: number
  imageUrl: string
  bio: string
  certifications: string[]
  languages: string[]
  availability: string[]
  images: string[]
  isFeatured: boolean
}

export const mockCoaches: Coach[] = [
  {
    id: 1,
    name: "Carlos Martínez",
    specialties: ["Adultos", "Iniciación", "Junior"],
    experience: 8,
    rating: 4.9,
    reviewsCount: 127,
    pricePerHour: 45,
    location: "Club Deportivo Chamartín",
    city: "Madrid",
    lat: 40.4168,
    lng: -3.7038,
    imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop",
    bio: "Entrenador profesional con más de 8 años de experiencia. Especializado en mejorar la técnica y la estrategia de juego. He trabajado con jugadores de todos los niveles, desde principiantes hasta avanzados.",
    certifications: ["Entrenador Nacional PTR", "Preparador Físico", "Monitor FEP"],
    languages: ["Español", "Inglés"],
    availability: ["Lunes a Viernes: 9:00-21:00", "Sábados: 10:00-14:00"],
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
    ],
    isFeatured: true
  },
  {
    id: 2,
    name: "Laura Sánchez",
    specialties: ["Adultos", "Junior", "Competición"],
    experience: 6,
    rating: 4.8,
    reviewsCount: 94,
    pricePerHour: 40,
    location: "Padel Indoor Barcelona",
    city: "Barcelona",
    lat: 41.3851,
    lng: 2.1734,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    bio: "Ex jugadora profesional especializada en pádel femenino. Mi objetivo es ayudarte a mejorar tu técnica y confianza en la pista.",
    certifications: ["Entrenadora Nacional", "Psicología Deportiva"],
    languages: ["Español", "Catalán", "Inglés"],
    availability: ["Martes a Domingo: 10:00-20:00"],
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    isFeatured: true
  },
  {
    id: 3,
    name: "Miguel Ángel Torres",
    specialties: ["Competición", "Adultos"],
    experience: 12,
    rating: 5.0,
    reviewsCount: 203,
    pricePerHour: 60,
    location: "Valencia Padel Center",
    city: "Valencia",
    lat: 39.4699,
    lng: -0.3763,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Entrenador de alto rendimiento con experiencia en competiciones nacionales e internacionales. Especializado en preparación mental y táctica de juego.",
    certifications: ["Entrenador Superior", "Coach Mental", "Preparador Físico RPT"],
    languages: ["Español", "Inglés", "Francés"],
    availability: ["Lunes a Viernes: 8:00-22:00"],
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"
    ],
    isFeatured: true
  },
  {
    id: 4,
    name: "Ana Rodríguez",
    specialties: ["Infantil", "Iniciación", "Junior"],
    experience: 5,
    rating: 4.7,
    reviewsCount: 81,
    pricePerHour: 35,
    location: "Club Padel Sevilla",
    city: "Sevilla",
    lat: 37.3891,
    lng: -5.9845,
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    bio: "Apasionada del pádel y de la enseñanza. Me especializo en introducir a niños y principiantes al mundo del pádel de forma divertida y efectiva.",
    certifications: ["Monitor Nacional", "Educación Deportiva Infantil"],
    languages: ["Español"],
    availability: ["Lunes a Viernes: 16:00-20:00", "Sábados: 9:00-14:00"],
    images: [
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    isFeatured: false
  },
  {
    id: 5,
    name: "Javier Moreno",
    specialties: ["Adultos", "Competición"],
    experience: 10,
    rating: 4.9,
    reviewsCount: 156,
    pricePerHour: 50,
    location: "Málaga Padel Club",
    city: "Málaga",
    lat: 36.7213,
    lng: -4.4214,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Especialista en juego ofensivo y potencia. Si quieres mejorar tu ataque y dominar la red, soy tu entrenador.",
    certifications: ["Entrenador Nacional", "Técnico Deportivo"],
    languages: ["Español", "Inglés"],
    availability: ["Lunes a Sábado: 9:00-21:00"],
    images: [
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
    ],
    isFeatured: false
  },
  {
    id: 6,
    name: "Patricia López",
    specialties: ["Adultos", "Junior"],
    experience: 7,
    rating: 4.8,
    reviewsCount: 112,
    pricePerHour: 42,
    location: "Zaragoza Sport Center",
    city: "Zaragoza",
    lat: 41.6488,
    lng: -0.8891,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Mi pasión es enseñar el arte de la defensa y el posicionamiento en pista. Aprende a leer el juego y anticiparte.",
    certifications: ["Entrenadora Nacional", "Técnico en Análisis de Juego"],
    languages: ["Español", "Inglés"],
    availability: ["Martes a Domingo: 10:00-19:00"],
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"
    ],
    isFeatured: false
  },
  {
    id: 7,
    name: "Roberto Fernández",
    specialties: ["Competición", "Adultos"],
    experience: 15,
    rating: 5.0,
    reviewsCount: 89,
    pricePerHour: 70,
    location: "Madrid Padel Pro",
    city: "Madrid",
    lat: 40.4168,
    lng: -3.7038,
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Ex jugador profesional del World Padel Tour. Entrenador especializado en alto rendimiento y preparación para competiciones.",
    certifications: ["Entrenador Superior WPT", "Analista Táctico", "Preparación Física Avanzada"],
    languages: ["Español", "Inglés", "Italiano"],
    availability: ["Lunes a Viernes: 7:00-12:00 y 18:00-22:00"],
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"
    ],
    isFeatured: true
  },
  {
    id: 8,
    name: "Elena Jiménez",
    specialties: ["Iniciación", "Adultos", "Junior"],
    experience: 4,
    rating: 4.6,
    reviewsCount: 67,
    pricePerHour: 32,
    location: "Bilbao Padel Arena",
    city: "Bilbao",
    lat: 43.2627,
    lng: -2.9253,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bio: "Entrenadora dinámica especializada en clases grupales y mejora de la técnica. ¡El pádel es diversión!",
    certifications: ["Monitora Nacional", "Educadora Deportiva"],
    languages: ["Español", "Euskera"],
    availability: ["Lunes a Viernes: 17:00-21:00"],
    images: [
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    isFeatured: false
  },
  {
    id: 9,
    name: "David Ruiz",
    specialties: ["Adultos", "Iniciación"],
    experience: 9,
    rating: 4.8,
    reviewsCount: 134,
    pricePerHour: 48,
    location: "Alicante Padel Club",
    city: "Alicante",
    lat: 38.3452,
    lng: -0.4810,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    bio: "Perfecciona tu saque y devolución con técnicas probadas. Los fundamentos son la clave del éxito.",
    certifications: ["Entrenador Nacional", "Especialista en Técnica"],
    languages: ["Español", "Inglés"],
    availability: ["Lunes a Sábado: 9:00-20:00"],
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"
    ],
    isFeatured: false
  },
  {
    id: 10,
    name: "Sofía Martín",
    specialties: ["Adultos", "Competición"],
    experience: 6,
    rating: 4.7,
    reviewsCount: 98,
    pricePerHour: 38,
    location: "Granada Padel Center",
    city: "Granada",
    lat: 37.1773,
    lng: -3.5986,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    bio: "Especialista en mejorar la comunicación y estrategia entre parejas. El pádel es un deporte de equipo.",
    certifications: ["Entrenadora Nacional", "Coach de Comunicación"],
    languages: ["Español"],
    availability: ["Martes a Domingo: 10:00-18:00"],
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"
    ],
    isFeatured: false
  },
  {
    id: 11,
    name: "Alberto Castro",
    specialties: ["Adultos", "Competición", "Senior"],
    experience: 11,
    rating: 4.9,
    reviewsCount: 145,
    pricePerHour: 55,
    location: "Murcia Sports Complex",
    city: "Murcia",
    lat: 37.9922,
    lng: -1.1307,
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    bio: "Preparador físico especializado en pádel. Mejora tu rendimiento, resistencia y previene lesiones.",
    certifications: ["Preparador Físico", "Fisioterapeuta Deportivo", "Nutrición Deportiva"],
    languages: ["Español", "Inglés"],
    availability: ["Lunes a Viernes: 7:00-14:00 y 17:00-21:00"],
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    isFeatured: false
  },
  {
    id: 12,
    name: "Carmen Díaz",
    specialties: ["Senior", "Adultos"],
    experience: 8,
    rating: 4.8,
    reviewsCount: 121,
    pricePerHour: 44,
    location: "Salamanca Padel Club",
    city: "Salamanca",
    lat: 40.9701,
    lng: -5.6635,
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    bio: "Especializada en jugadores veteranos y adaptación de técnicas. Nunca es tarde para mejorar tu juego.",
    certifications: ["Entrenadora Nacional", "Adaptación Deportiva"],
    languages: ["Español"],
    availability: ["Lunes a Viernes: 10:00-18:00"],
    images: [
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    isFeatured: false
  },
  {
    id: 13,
    name: "Fernando Gil",
    specialties: ["Iniciación", "Adultos"],
    experience: 5,
    rating: 4.6,
    reviewsCount: 73,
    pricePerHour: 30,
    location: "Santander Padel Point",
    city: "Santander",
    lat: 43.4623,
    lng: -3.8100,
    imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
    bio: "¿Nunca has jugado al pádel? ¡Perfecto! Te enseño desde cero de forma amena y efectiva.",
    certifications: ["Monitor Nacional", "Iniciación Deportiva"],
    languages: ["Español"],
    availability: ["Lunes a Viernes: 16:00-21:00", "Sábados: 10:00-14:00"],
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
    ],
    isFeatured: false
  },
  {
    id: 14,
    name: "Marta Vega",
    specialties: ["Competición", "Junior", "Adultos"],
    experience: 7,
    rating: 4.7,
    reviewsCount: 105,
    pricePerHour: 46,
    location: "Vigo Padel Academy",
    city: "Vigo",
    lat: 42.2406,
    lng: -8.7207,
    imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
    bio: "Prepárate para competir a nivel regional. Técnica depurada y estrategia ganadora.",
    certifications: ["Entrenadora Nacional", "Análisis de Competición"],
    languages: ["Español", "Gallego", "Portugués"],
    availability: ["Martes a Sábado: 9:00-20:00"],
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    isFeatured: false
  },
  {
    id: 15,
    name: "Jorge Ramírez",
    specialties: ["Adultos", "Competición"],
    experience: 9,
    rating: 4.8,
    reviewsCount: 118,
    pricePerHour: 47,
    location: "Córdoba Padel Center",
    city: "Córdoba",
    lat: 37.8882,
    lng: -4.7794,
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop",
    bio: "Aprende a controlar el juego desde el fondo. La defensa sólida es el camino a la victoria.",
    certifications: ["Entrenador Nacional", "Táctica Defensiva"],
    languages: ["Español", "Inglés"],
    availability: ["Lunes a Viernes: 9:00-21:00"],
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"
    ],
    isFeatured: false
  },
  {
    id: 16,
    name: "Lucía Herrera",
    specialties: ["Competición", "Adultos", "Junior"],
    experience: 6,
    rating: 4.9,
    reviewsCount: 92,
    pricePerHour: 52,
    location: "Valladolid Padel Pro",
    city: "Valladolid",
    lat: 41.6523,
    lng: -4.7245,
    imageUrl: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=400&h=400&fit=crop",
    bio: "Psicóloga deportiva y entrenadora. El juego mental es tan importante como la técnica.",
    certifications: ["Entrenadora Nacional", "Psicología Deportiva", "Coaching Mental"],
    languages: ["Español", "Inglés"],
    availability: ["Lunes a Viernes: 10:00-19:00"],
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"
    ],
    isFeatured: false
  },
  {
    id: 17,
    name: "Pablo Serrano",
    specialties: ["Adultos", "Iniciación", "Junior"],
    experience: 10,
    rating: 4.7,
    reviewsCount: 167,
    pricePerHour: 43,
    location: "Pamplona Sports Center",
    city: "Pamplona",
    lat: 42.8125,
    lng: -1.6458,
    imageUrl: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=400&h=400&fit=crop",
    bio: "Cada jugador es único. Adapto mis clases a tus necesidades y objetivos específicos.",
    certifications: ["Entrenador Nacional", "Metodología Personalizada"],
    languages: ["Español", "Euskera"],
    availability: ["Lunes a Sábado: 8:00-21:00"],
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"
    ],
    isFeatured: false
  },
  {
    id: 18,
    name: "Isabel Navarro",
    specialties: ["Senior", "Adultos"],
    experience: 7,
    rating: 4.8,
    reviewsCount: 88,
    pricePerHour: 40,
    location: "Tarragona Padel Club",
    city: "Tarragona",
    lat: 41.1189,
    lng: 1.2445,
    imageUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop",
    bio: "Especialista en jugadores senior. Mejora tu juego mientras cuidas tus articulaciones.",
    certifications: ["Entrenadora Nacional", "Fisioterapia Deportiva", "Ejercicio Senior"],
    languages: ["Español", "Catalán"],
    availability: ["Martes a Viernes: 10:00-17:00"],
    images: [
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    isFeatured: false
  },
  {
    id: 19,
    name: "Raúl Campos",
    specialties: ["Adultos", "Junior"],
    experience: 8,
    rating: 4.7,
    reviewsCount: 110,
    pricePerHour: 45,
    location: "Cádiz Padel Arena",
    city: "Cádiz",
    lat: 36.5271,
    lng: -6.2886,
    imageUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
    bio: "Domina el juego con las paredes y desarrolla tu creatividad en la pista. El pádel es un arte.",
    certifications: ["Entrenador Nacional", "Creatividad Táctica"],
    languages: ["Español"],
    availability: ["Lunes a Viernes: 9:00-20:00", "Sábados: 10:00-14:00"],
    images: [
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
    ],
    isFeatured: false
  },
  {
    id: 20,
    name: "Natalia Ortiz",
    specialties: ["Infantil", "Junior", "Iniciación"],
    experience: 5,
    rating: 4.6,
    reviewsCount: 76,
    pricePerHour: 36,
    location: "Oviedo Padel Club",
    city: "Oviedo",
    lat: 43.3619,
    lng: -5.8494,
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    bio: "Aprende mientras te diviertes. Mis clases son dinámicas y efectivas para todos los niveles.",
    certifications: ["Monitora Nacional", "Educación Física"],
    languages: ["Español"],
    availability: ["Lunes a Viernes: 16:00-21:00", "Sábados: 9:00-14:00"],
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"
    ],
    isFeatured: false
  }
]
