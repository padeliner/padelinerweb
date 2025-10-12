export interface Club {
  id: number
  name: string
  location: string
  city: string
  lat: number
  lng: number
  courtsCount: number
  amenities: string[]
  rating: number
  reviewsCount: number
  imageUrl: string
  images: string[]
  description: string
  pricePerHour: number
  contactPhone: string
  contactEmail: string
  openingHours: string[]
  isFeatured: boolean
}

export const mockClubs: Club[] = [
  {
    id: 1,
    name: "Padel Pro Madrid",
    location: "Calle de Alcalá 123",
    city: "Madrid",
    lat: 40.4168,
    lng: -3.7038,
    courtsCount: 8,
    amenities: ["Parking gratuito", "Vestuarios", "Cafetería", "Tienda", "Alquiler de palas", "Iluminación LED"],
    rating: 4.8,
    reviewsCount: 342,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
    ],
    description: "Club de pádel de alta gama en el centro de Madrid. Instalaciones modernas con pistas cubiertas y al aire libre. Ambiente profesional y acogedor.",
    pricePerHour: 25,
    contactPhone: "+34 911 234 567",
    contactEmail: "info@padelpromadrid.com",
    openingHours: ["Lunes a Viernes: 7:00 - 23:00", "Sábados y Domingos: 8:00 - 22:00"],
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
    amenities: ["Parking", "Vestuarios premium", "Restaurante", "Spa", "Clases grupales", "WiFi gratis"],
    rating: 4.9,
    reviewsCount: 521,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    description: "El centro de pádel más grande de Barcelona. 12 pistas de última generación con sistema de reserva online. Perfecto para competiciones y eventos.",
    pricePerHour: 30,
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
    amenities: ["Parking", "Vestuarios", "Bar", "Alquiler material", "Pistas cubiertas"],
    rating: 4.7,
    reviewsCount: 198,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    description: "Club familiar en pleno centro de Valencia. Ambiente acogedor con jugadores de todos los niveles. Torneos mensuales.",
    pricePerHour: 22,
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
    amenities: ["Parking vigilado", "Vestuarios", "Cafetería", "Tienda especializada", "Clases personalizadas"],
    rating: 4.6,
    reviewsCount: 287,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"
    ],
    description: "Moderno complejo deportivo con las mejores instalaciones del sur de España. Ideal para jugadores exigentes.",
    pricePerHour: 24,
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
    amenities: ["Vista al mar", "Parking", "Vestuarios", "Chiringuito", "Alquiler palas", "Duchas"],
    rating: 4.9,
    reviewsCount: 412,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
    ],
    description: "Única experiencia de pádel junto al mar. Pistas con vistas panorámicas y ambiente relajado. Perfecto para combinar deporte y ocio.",
    pricePerHour: 28,
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
    amenities: ["Parking subterráneo", "Vestuarios premium", "Gimnasio", "Sauna", "Cafetería", "WiFi"],
    rating: 4.7,
    reviewsCount: 234,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    description: "Centro deportivo integral con instalaciones de primera. Combina pádel con gimnasio y zona wellness.",
    pricePerHour: 26,
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
    amenities: ["Parking", "Vestuarios", "Bar deportivo", "Alquiler material", "Torneos semanales"],
    rating: 4.5,
    reviewsCount: 167,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"
    ],
    description: "Club acogedor en el corazón de Zaragoza. Comunidad activa de jugadores y torneos regulares.",
    pricePerHour: 20,
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
    amenities: ["Parking gratuito", "Vista al mar", "Bar-restaurante", "Duchas exteriores", "Alquiler palas"],
    rating: 4.8,
    reviewsCount: 298,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
    ],
    description: "Pádel junto a la playa de San Juan. Disfruta del mejor clima mientras juegas con vistas al Mediterráneo.",
    pricePerHour: 23,
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
    amenities: ["Pistas climatizadas", "Parking vigilado", "Vestuarios", "Cafetería", "Tienda", "WiFi gratis"],
    rating: 4.6,
    reviewsCount: 189,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    description: "Pistas cubiertas y climatizadas. Juega en las mejores condiciones durante todo el año.",
    pricePerHour: 24,
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
    amenities: ["Parking", "Vestuarios", "Bar", "Alquiler completo", "Clases disponibles"],
    rating: 4.4,
    reviewsCount: 123,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"
    ],
    description: "Club boutique con atención personalizada. Ambiente exclusivo para jugadores exigentes.",
    pricePerHour: 27,
    contactPhone: "+34 957 345 678",
    contactEmail: "info@cordobaelite.com",
    openingHours: ["Lunes a Viernes: 9:00 - 22:00", "Sábados y Domingos: 10:00 - 21:00"],
    isFeatured: false
  }
]
