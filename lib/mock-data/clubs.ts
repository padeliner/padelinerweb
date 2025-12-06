export interface Club {
  id: number
  name: string
  location: string
  city: string
  lat: number
  lng: number
  courtsCount: number
  instructorsCount: number // Número de instructores
  classTypes: string[] // Tipos de clases ofrecidas
  amenities: string[]
  rating: number
  reviewsCount: number
  imageUrl: string
  images: string[]
  description: string
  pricePerClass: number // Precio por clase de pádel
  contactPhone: string
  contactEmail: string
  openingHours: string[]
  isFeatured: boolean
}

export const mockClubs: Club[] = [
  {
    id: 1,
    name: "Full Padel",
    location: "La Pobla de Vallbona",
    city: "Valencia",
    lat: 39.596,
    lng: -0.548,
    courtsCount: 7,
    instructorsCount: 12,
    classTypes: ["Iniciación", "Perfeccionamiento", "Competición", "Clases grupales", "Clases privadas"],
    amenities: [
      "7 pistas indoor (cubiertas)",
      "Vestuarios",
      "Cafetería",
      "Torneos internos",
      "Equipos de competición en series nacionales",
      "Parking gratuito",
      "Tienda de material"
    ],
    rating: 4.8,
    reviewsCount: 342,
    imageUrl: "/imagenespruebaclub/_DSC7819.jpg",
    images: [
      "/imagenespruebaclub/_DSC7819.jpg",
      "/imagenespruebaclub/_DSC7841.jpg",
      "/imagenespruebaclub/_DSC8014.jpg",
      "/imagenespruebaclub/_DSC8031.jpg",
      "/imagenespruebaclub/_DSC8040.jpg",
      "/imagenespruebaclub/_DSC8116 (1).jpg"
    ],
    description: "Full Pádel es un club indoor en La Pobla de Vallbona (Valencia) con 7 pistas cubiertas, vestuarios completos y cafetería, pensado para disfrutar del pádel todo el año. Ofrecemos clases para todos los niveles —desde iniciación hasta competición— con entrenadores cualificados y grupos adaptados por nivel. Además, organizamos torneos internos de forma regular y contamos con equipos de competición que participan en series nacionales, creando una comunidad activa para jugadores que quieren mejorar, competir y vivir el pádel al máximo. Una experiencia cómoda, rápida y profesional desde la reserva hasta la pista.",
    pricePerClass: 25,
    contactPhone: "+34 911 234 567",
    contactEmail: "info@padelpromadrid.com",
    openingHours: [
      "Lunes a Viernes: 7:00 – 23:00",
      "Sábados y Domingos: 8:00 – 22:00"
    ],
    isFeatured: true
  },
  {
    id: 2,
    name: "Barcelona Padel Center",
    location: "Avenida Diagonal 456",
    city: "Barcelona",
    lat: 41.3851,
    lng: 2.1734,
    courtsCount: 12,
    instructorsCount: 18,
    classTypes: ["Infantil", "Junior", "Adultos", "Competición", "Clases grupales", "Clases privadas"],
    amenities: ["Parking", "Vestuarios premium", "Restaurante", "Tienda", "Material incluido", "WiFi gratis"],
    rating: 4.9,
    reviewsCount: 521,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    description: "El centro de clases de pádel más grande de Barcelona. 18 instructores profesionales ofrecen programas desde infantil hasta alto rendimiento. Metodología de enseñanza innovadora.",
    pricePerClass: 30,
    contactPhone: "+34 933 456 789",
    contactEmail: "hola@bcnpadel.com",
    openingHours: ["Lunes a Domingo: 7:00 - 24:00"],
    isFeatured: true
  },
  {
    id: 3,
    name: "Valencia Sports Club",
    location: "Calle Colón 78",
    city: "Valencia",
    lat: 39.4699,
    lng: -0.3763,
    courtsCount: 6,
    instructorsCount: 8,
    classTypes: ["Iniciación", "Intermedio", "Avanzado", "Clases grupales"],
    amenities: ["Parking", "Vestuarios", "Bar", "Alquiler material", "Pistas cubiertas"],
    rating: 4.7,
    reviewsCount: 198,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    description: "Club familiar con programa completo de clases de pádel para todos los niveles. 8 profesores experimentados con enfoque en técnica y táctica. Ambiente acogedor.",
    pricePerClass: 22,
    contactPhone: "+34 961 234 567",
    contactEmail: "info@valenciasports.com",
    openingHours: ["Lunes a Viernes: 8:00 - 22:00", "Fines de semana: 9:00 - 21:00"],
    isFeatured: true
  },
  {
    id: 4,
    name: "Sevilla Padel Arena",
    location: "Avenida de la Palmera 234",
    city: "Sevilla",
    lat: 37.3891,
    lng: -5.9845,
    courtsCount: 10,
    instructorsCount: 14,
    classTypes: ["Infantil", "Adultos", "Senior", "Competición", "Clases personalizadas"],
    amenities: ["Parking vigilado", "Vestuarios", "Cafetería", "Tienda especializada", "Material incluido"],
    rating: 4.6,
    reviewsCount: 287,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"
    ],
    description: "Centro de alto rendimiento con clases especializadas. 14 entrenadores certificados con experiencia en competición. Programas adaptados para todas las edades.",
    pricePerClass: 24,
    contactPhone: "+34 954 567 890",
    contactEmail: "contacto@sevillapadel.com",
    openingHours: ["Todos los días: 8:00 - 23:00"],
    isFeatured: false
  },
  {
    id: 5,
    name: "Málaga Padel Club",
    location: "Paseo Marítimo 56",
    city: "Málaga",
    lat: 36.7213,
    lng: -4.4214,
    courtsCount: 8,
    instructorsCount: 10,
    classTypes: ["Iniciación", "Perfeccionamiento", "Clases grupales", "Clases privadas"],
    amenities: ["Vista al mar", "Parking", "Vestuarios", "Chiringuito", "Material incluido", "Duchas"],
    rating: 4.9,
    reviewsCount: 412,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
    ],
    description: "Clases de pádel junto al mar con vistas espectaculares. 10 instructores profesionales ofrecen entrenamiento en un entorno único. Perfecto para combinar aprendizaje y disfrute.",
    pricePerClass: 28,
    contactPhone: "+34 952 123 456",
    contactEmail: "info@malagapadel.com",
    openingHours: ["Lunes a Domingo: 8:00 - 22:00"],
    isFeatured: true
  },
  {
    id: 6,
    name: "Bilbao Sport Center",
    location: "Gran Vía 89",
    city: "Bilbao",
    lat: 43.2627,
    lng: -2.9253,
    courtsCount: 7,
    instructorsCount: 9,
    classTypes: ["Iniciación", "Intermedio", "Avanzado", "Fitness + Pádel"],
    amenities: ["Parking subterráneo", "Vestuarios premium", "Gimnasio", "Sauna", "Cafetería", "WiFi"],
    rating: 4.7,
    reviewsCount: 234,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    description: "Centro integral con clases de pádel complementadas con preparación física. 9 entrenadores especializados combinan técnica, táctica y acondicionamiento. Programa fitness incluido.",
    pricePerClass: 26,
    contactPhone: "+34 944 567 890",
    contactEmail: "info@bilbaosport.com",
    openingHours: ["Lunes a Viernes: 7:00 - 23:00", "Sábados: 8:00 - 22:00", "Domingos: 9:00 - 21:00"],
    isFeatured: false
  },
  {
    id: 7,
    name: "Zaragoza Padel Point",
    location: "Paseo Independencia 145",
    city: "Zaragoza",
    lat: 41.6488,
    lng: -0.8891,
    courtsCount: 5,
    instructorsCount: 6,
    classTypes: ["Infantil", "Adultos", "Clases grupales"],
    amenities: ["Parking", "Vestuarios", "Bar deportivo", "Material incluido", "Ambiente familiar"],
    rating: 4.5,
    reviewsCount: 167,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"
    ],
    description: "Club acogedor especializado en clases para principiantes y familias. 6 instructores pacientes y didácticos. Ambiente relajado ideal para aprender.",
    pricePerClass: 20,
    contactPhone: "+34 976 234 567",
    contactEmail: "hola@zaragozapadel.com",
    openingHours: ["Lunes a Domingo: 9:00 - 22:00"],
    isFeatured: false
  },
  {
    id: 8,
    name: "Alicante Beach Padel",
    location: "Playa de San Juan s/n",
    city: "Alicante",
    lat: 38.3452,
    lng: -0.4810,
    courtsCount: 6,
    instructorsCount: 7,
    classTypes: ["Iniciación", "Perfeccionamiento", "Clases grupales"],
    amenities: ["Parking gratuito", "Vista al mar", "Bar-restaurante", "Duchas exteriores", "Material incluido"],
    rating: 4.8,
    reviewsCount: 298,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    description: "Clases de pádel junto a la playa con ambiente mediterráneo. 7 instructores cualificados ofrecen programas en un entorno incomparable. Aprende mientras disfrutas del mar.",
    pricePerClass: 23,
    contactPhone: "+34 965 345 678",
    contactEmail: "info@alicantebeachpadel.com",
    openingHours: ["Todos los días: 8:00 - 23:00"],
    isFeatured: false
  },
  {
    id: 9,
    name: "Murcia Indoor Padel",
    location: "Avenida Juan Carlos I, 34",
    city: "Murcia",
    lat: 37.9922,
    lng: -1.1307,
    courtsCount: 9,
    instructorsCount: 11,
    classTypes: ["Infantil", "Junior", "Adultos", "Competición", "Clases privadas"],
    amenities: ["Pistas climatizadas", "Parking vigilado", "Vestuarios", "Cafetería", "Tienda", "WiFi gratis"],
    rating: 4.6,
    reviewsCount: 189,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    description: "Centro con pistas climatizadas para clases todo el año. 11 profesores especializados en diferentes niveles. Condiciones óptimas de entrenamiento en cualquier época.",
    pricePerClass: 24,
    contactPhone: "+34 968 234 567",
    contactEmail: "contacto@murciaindoor.com",
    openingHours: ["Lunes a Domingo: 7:00 - 24:00"],
    isFeatured: false
  },
  {
    id: 10,
    name: "Córdoba Padel Elite",
    location: "Avenida del Gran Capitán 67",
    city: "Córdoba",
    lat: 37.8882,
    lng: -4.7794,
    courtsCount: 4,
    instructorsCount: 5,
    classTypes: ["Perfeccionamiento", "Alto rendimiento", "Clases privadas"],
    amenities: ["Parking", "Vestuarios", "Bar", "Material premium", "Atención personalizada"],
    rating: 4.4,
    reviewsCount: 123,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"
    ],
    description: "Club boutique especializado en clases de alto nivel. 5 entrenadores expertos con formación avanzada. Atención personalizada para jugadores exigentes.",
    pricePerClass: 35,
    contactPhone: "+34 957 345 678",
    contactEmail: "info@cordobaelite.com",
    openingHours: ["Lunes a Viernes: 9:00 - 22:00", "Sábados y Domingos: 10:00 - 21:00"],
    isFeatured: false
  }
]
