export interface Academy {
  id: number
  name: string
  location: string
  city: string
  lat: number
  lng: number
  programs: string[]
  rating: number
  reviewsCount: number
  imageUrl: string
  images: string[]
  description: string
  pricePerMonth: number
  contactPhone: string
  contactEmail: string
  schedule: string[]
  isFeatured: boolean
  studentCapacity: number
  coachesCount: number
}

export const mockAcademies: Academy[] = [
  {
    id: 1,
    name: "Manu Martin Academy - Aspresso Valencia",
    location: "Aspresso Valencia",
    city: "Valencia",
    lat: 39.4699,
    lng: -0.3763,
    programs: [
      "Entrenamientos por niveles (iniciación, intermedio, avanzado, competición)",
      "Clases individuales y grupales",
      "Escuela mensual con grupos fijos",
      "Programas de perfeccionamiento para adultos",
      "Iniciación y formación para niños (si aplica en Aspresso)",
      "Entrenamientos de competición",
      "Clinics / intensivos puntuales",
      "Metodología propia Manu Martín Academy",
      "Entrenadores titulados y especializados"
    ],
    rating: 4.9,
    reviewsCount: 256,
    imageUrl: "/imagenespruebaacademia/_DSC7700.jpg",
    images: [
      "/imagenespruebaacademia/_DSC7700.jpg",
      "/imagenespruebaacademia/_DSC7729.jpg",
      "/imagenespruebaacademia/_DSC7943.jpg"
    ],
    description: "Manu Martín Academy es la academia de pádel de referencia dentro de Aspresso Valencia, diseñada para jugadores que buscan una evolución real y medible en su juego. Con una metodología propia desarrollada por Manu Martín y su equipo, la academia estructura el entrenamiento por niveles —desde iniciación hasta alto rendimiento— combinando técnica, táctica y preparación específica para competición. Nuestros entrenadores cualificados trabajan con grupos reducidos y planes adaptados a cada jugador, asegurando seguimiento, progresión y una experiencia profesional desde la primera clase. Además, la academia impulsa una comunidad activa con programas intensivos, entrenamientos de competición y participación en dinámicas internas del club, creando un entorno perfecto para aprender, mejorar y competir con continuidad. Una experiencia premium, organizada y transparente: reservas simples, plazas controladas y oferta visible en un solo sistema.",
    pricePerMonth: 120,
    contactPhone: "+34 911 345 678",
    contactEmail: "info@padelelite.com",
    schedule: [
      "Lunes a Viernes: 9:00 – 21:00",
      "Sábados: 9:00 – 14:00",
      "Domingos: según disponibilidad de grupos / eventos"
    ],
    isFeatured: true,
    studentCapacity: 150,
    coachesCount: 8
  },
  {
    id: 2,
    name: "Barcelona Padel Academy",
    location: "Avenida Diagonal 567",
    city: "Barcelona",
    lat: 41.3851,
    lng: 2.1734,
    programs: ["Escuela infantil", "Adultos principiantes", "Alto rendimiento", "Preparación física", "Psicología deportiva"],
    rating: 4.8,
    reviewsCount: 342,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"
    ],
    description: "Academia líder en formación de jugadores de competición. Programa específico para cada nivel con seguimiento personalizado.",
    pricePerMonth: 135,
    contactPhone: "+34 933 567 890",
    contactEmail: "hola@bcnpadelacademy.com",
    schedule: ["Lunes a Domingo: 8:00 - 22:00"],
    isFeatured: true,
    studentCapacity: 200,
    coachesCount: 12
  },
  {
    id: 3,
    name: "Valencia Padel School",
    location: "Calle Colón 234",
    city: "Valencia",
    lat: 39.4699,
    lng: -0.3763,
    programs: ["Escuela de menores", "Tecnificación", "Clases particulares", "Grupos reducidos"],
    rating: 4.7,
    reviewsCount: 189,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    description: "Escuela con más de 10 años de experiencia. Grupos reducidos para atención personalizada. Excelente ambiente de aprendizaje.",
    pricePerMonth: 95,
    contactPhone: "+34 961 345 678",
    contactEmail: "info@valenciapadel.com",
    schedule: ["Lunes a Viernes: 16:00 - 21:00", "Sábados: 10:00 - 14:00"],
    isFeatured: false,
    studentCapacity: 80,
    coachesCount: 5
  },
  {
    id: 4,
    name: "Sevilla Padel Pro Academy",
    location: "Avenida de la Palmera 345",
    city: "Sevilla",
    lat: 37.3891,
    lng: -5.9845,
    programs: ["Iniciación", "Perfeccionamiento", "Competición regional", "Técnica avanzada", "Campus intensivos"],
    rating: 4.8,
    reviewsCount: 223,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    description: "Academia con entrenadores titulados y ex jugadores profesionales. Metodología innovadora enfocada en resultados.",
    pricePerMonth: 110,
    contactPhone: "+34 954 678 901",
    contactEmail: "contacto@sevillapadelpro.com",
    schedule: ["Lunes a Viernes: 9:00 - 21:00", "Sábados: 9:00 - 15:00"],
    isFeatured: true,
    studentCapacity: 120,
    coachesCount: 7
  },
  {
    id: 5,
    name: "Málaga Padel Junior Academy",
    location: "Paseo Marítimo 89",
    city: "Málaga",
    lat: 36.7213,
    lng: -4.4214,
    programs: ["Escuela de menores 5-17 años", "Competición juvenil", "Campus de Navidad", "Campus de verano"],
    rating: 4.9,
    reviewsCount: 298,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
    ],
    description: "Especializada en formación de jóvenes talentos. Instalaciones junto al mar y metodología de aprendizaje divertida y efectiva.",
    pricePerMonth: 100,
    contactPhone: "+34 952 234 567",
    contactEmail: "info@malagajunior.com",
    schedule: ["Lunes a Viernes: 16:00 - 20:00", "Sábados y Domingos: 10:00 - 14:00"],
    isFeatured: true,
    studentCapacity: 100,
    coachesCount: 6
  },
  {
    id: 6,
    name: "Bilbao Sport Academy",
    location: "Gran Vía 234",
    city: "Bilbao",
    lat: 43.2627,
    lng: -2.9253,
    programs: ["Escuela de pádel", "Entrenamiento personal", "Preparación física integral", "Nutrición deportiva"],
    rating: 4.6,
    reviewsCount: 167,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    description: "Centro integral de formación deportiva. Combina entrenamiento técnico con preparación física y nutricional.",
    pricePerMonth: 125,
    contactPhone: "+34 944 678 901",
    contactEmail: "info@bilbaosport.com",
    schedule: ["Lunes a Viernes: 7:00 - 22:00", "Sábados: 9:00 - 14:00"],
    isFeatured: false,
    studentCapacity: 90,
    coachesCount: 6
  },
  {
    id: 7,
    name: "Zaragoza Padel Formation",
    location: "Paseo Independencia 456",
    city: "Zaragoza",
    lat: 41.6488,
    lng: -0.8891,
    programs: ["Iniciación adultos", "Perfeccionamiento", "Grupos de nivel", "Clases particulares"],
    rating: 4.5,
    reviewsCount: 134,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"
    ],
    description: "Formación de calidad a precios accesibles. Grupos homogéneos por nivel para mejor progresión.",
    pricePerMonth: 85,
    contactPhone: "+34 976 345 678",
    contactEmail: "hola@zaragozaformation.com",
    schedule: ["Lunes a Viernes: 17:00 - 21:00", "Sábados: 10:00 - 14:00"],
    isFeatured: false,
    studentCapacity: 60,
    coachesCount: 4
  },
  {
    id: 8,
    name: "Alicante Elite Training",
    location: "Playa de San Juan s/n",
    city: "Alicante",
    lat: 38.3452,
    lng: -0.4810,
    programs: ["Alto rendimiento", "Preparación WPT", "Análisis de vídeo", "Entrenamiento mental", "Fisioterapia"],
    rating: 4.9,
    reviewsCount: 178,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"
    ],
    description: "Academia especializada en jugadores de alto nivel. Programas personalizados con análisis táctico y técnico avanzado.",
    pricePerMonth: 180,
    contactPhone: "+34 965 456 789",
    contactEmail: "info@alicanteelite.com",
    schedule: ["Lunes a Viernes: 8:00 - 21:00"],
    isFeatured: true,
    studentCapacity: 50,
    coachesCount: 5
  }
]
