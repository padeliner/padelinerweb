export interface Product {
  id: number
  name: string
  brand: string
  category: 'palas' | 'ropa' | 'zapatillas' | 'accesorios'
  price: number
  originalPrice?: number
  rating: number
  reviewsCount: number
  imageUrl: string
  images: string[]
  description: string
  features: string[]
  inStock: boolean
  isFeatured: boolean
  isNew?: boolean
  discount?: number
}

export const mockProducts: Product[] = [
  // PALAS
  {
    id: 1,
    name: "Bullpadel Hack 03 2024",
    brand: "Bullpadel",
    category: "palas",
    price: 279,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 342,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800", "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"],
    description: "Pala de alta gama diseñada para jugadores profesionales. Forma diamante con balance alto para máxima potencia.",
    features: ["Forma: Diamante", "Balance: Alto", "Núcleo: Black EVA", "Marco: 100% Carbono", "Peso: 365-375g"],
    inStock: true,
    isFeatured: true,
    isNew: true,
    discount: 20
  },
  {
    id: 2,
    name: "Adidas Metalbone 3.2",
    brand: "Adidas",
    category: "palas",
    price: 299,
    originalPrice: 375,
    rating: 4.8,
    reviewsCount: 287,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"],
    description: "La pala oficial de Alejandro Galán. Potencia extrema con gran punto dulce.",
    features: ["Forma: Diamante", "Balance: Alto", "Núcleo: EVA Soft Performance", "Marco: Carbono Aluminizado", "Peso: 360-375g"],
    inStock: true,
    isFeatured: true,
    isNew: true,
    discount: 20
  },
  {
    id: 3,
    name: "Nox AT10 Luxury Genius",
    brand: "Nox",
    category: "palas",
    price: 249,
    rating: 4.7,
    reviewsCount: 198,
    imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"],
    description: "Pala versátil con excelente control y potencia equilibrada. Perfecta para nivel avanzado.",
    features: ["Forma: Lágrima", "Balance: Medio", "Núcleo: HR3 Core", "Marco: 12K Carbon", "Peso: 360-370g"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 4,
    name: "Head Delta Elite",
    brand: "Head",
    category: "palas",
    price: 189,
    rating: 4.6,
    reviewsCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"],
    description: "Pala de control para jugadores que buscan precisión en cada golpe.",
    features: ["Forma: Redonda", "Balance: Bajo", "Núcleo: Soft Foam", "Marco: Fibra de Vidrio", "Peso: 350-360g"],
    inStock: true,
    isFeatured: false
  },
  {
    id: 5,
    name: "Babolat Viper Carbon",
    brand: "Babolat",
    category: "palas",
    price: 219,
    rating: 4.8,
    reviewsCount: 223,
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"],
    description: "Equilibrio perfecto entre potencia y control para jugadores exigentes.",
    features: ["Forma: Diamante", "Balance: Medio-Alto", "Núcleo: Black EVA", "Marco: Carbon Flex", "Peso: 365-375g"],
    inStock: true,
    isFeatured: false
  },
  {
    id: 6,
    name: "Wilson Carbon Force",
    brand: "Wilson",
    category: "palas",
    price: 159,
    rating: 4.5,
    reviewsCount: 134,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"],
    description: "Pala accesible con tecnología de alta gama. Ideal para jugadores intermedios.",
    features: ["Forma: Lágrima", "Balance: Medio", "Núcleo: EVA Soft", "Marco: Carbono 3K", "Peso: 355-365g"],
    inStock: true,
    isFeatured: false
  },

  // ZAPATILLAS
  {
    id: 7,
    name: "Asics Gel-Padel Pro 5",
    brand: "Asics",
    category: "zapatillas",
    price: 129,
    originalPrice: 159,
    rating: 4.9,
    reviewsCount: 456,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
    description: "Máxima comodidad y estabilidad. Sistema Gel para amortiguación superior.",
    features: ["Tecnología Gel", "Suela Herringbone", "Sistema Trusstic", "Upper transpirable", "Refuerzo lateral"],
    inStock: true,
    isFeatured: true,
    discount: 19
  },
  {
    id: 8,
    name: "Adidas Barricade Padel",
    brand: "Adidas",
    category: "zapatillas",
    price: 139,
    rating: 4.8,
    reviewsCount: 389,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"],
    description: "Diseñadas para movimientos laterales rápidos. Durabilidad profesional.",
    features: ["Tecnología Boost", "Upper Adiwear", "Adituff toe", "Suela Continental", "Sistema de atadura"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 9,
    name: "Nike Court Padel Zoom",
    brand: "Nike",
    category: "zapatillas",
    price: 119,
    rating: 4.7,
    reviewsCount: 267,
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800"],
    description: "Respuesta rápida con sistema Zoom Air. Perfectas para juego dinámico.",
    features: ["Zoom Air", "Suela XDR", "Flywire cables", "Foam React", "Collar acolchado"],
    inStock: true,
    isFeatured: false
  },
  {
    id: 10,
    name: "Babolat Jet Mach 3",
    brand: "Babolat",
    category: "zapatillas",
    price: 109,
    rating: 4.6,
    reviewsCount: 198,
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"],
    description: "Ligereza extrema sin sacrificar soporte. Perfectas para jugadores rápidos.",
    features: ["Sistema Jet", "KPRS-X amortiguación", "Matryx upper", "Michelin suela", "Active Flexion"],
    inStock: true,
    isFeatured: false
  },

  // ROPA
  {
    id: 11,
    name: "Camiseta Técnica Pro",
    brand: "Bullpadel",
    category: "ropa",
    price: 39,
    originalPrice: 49,
    rating: 4.7,
    reviewsCount: 234,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
    description: "Tejido Drynamic de alta tecnología para máxima transpirabilidad.",
    features: ["Tejido Drynamic", "Antiolor", "Protección UV 50+", "Costuras planas", "Ajuste ergonómico"],
    inStock: true,
    isFeatured: true,
    discount: 20
  },
  {
    id: 12,
    name: "Pantalón Corto Elite",
    brand: "Adidas",
    category: "ropa",
    price: 45,
    rating: 4.8,
    reviewsCount: 189,
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800"],
    description: "Libertad de movimiento con tecnología Climacool. Bolsillos laterales.",
    features: ["Climacool", "Bolsillos con cremallera", "Cintura elástica", "Tejido stretch", "Longitud media"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 13,
    name: "Polo Técnico Performance",
    brand: "Nox",
    category: "ropa",
    price: 42,
    rating: 4.6,
    reviewsCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800"],
    description: "Diseño elegante con máximo confort. Perfecto para competición.",
    features: ["Dry-MX tech", "Cuello con botones", "Costuras reforzadas", "Corte slim fit", "Logo bordado"],
    inStock: true,
    isFeatured: false
  },
  {
    id: 14,
    name: "Sudadera Training",
    brand: "Head",
    category: "ropa",
    price: 59,
    rating: 4.7,
    reviewsCount: 134,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"],
    description: "Perfecta para calentamiento. Tejido suave y transpirable.",
    features: ["Tejido French Terry", "Capucha ajustable", "Bolsillos canguro", "Puños elásticos", "Cremallera completa"],
    inStock: true,
    isFeatured: false
  },

  // ACCESORIOS
  {
    id: 15,
    name: "Paletero Profesional",
    brand: "Bullpadel",
    category: "accesorios",
    price: 89,
    originalPrice: 119,
    rating: 4.9,
    reviewsCount: 423,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"],
    description: "Capacidad para 3 palas. Compartimento térmico y para zapatillas.",
    features: ["Capacidad 3 palas", "Compartimento térmico", "Bolsillo para zapatillas", "Acolchado reforzado", "Correas ajustables"],
    inStock: true,
    isFeatured: true,
    discount: 25
  },
  {
    id: 16,
    name: "Mochila Pádel Elite",
    brand: "Adidas",
    category: "accesorios",
    price: 65,
    rating: 4.7,
    reviewsCount: 287,
    imageUrl: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800"],
    description: "Compartimento para pala y organización inteligente. Resistente al agua.",
    features: ["Para 1 pala", "Compartimentos múltiples", "Resistente al agua", "Respaldo acolchado", "Puerto USB"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 17,
    name: "Overgrip Premium Pack x12",
    brand: "Wilson",
    category: "accesorios",
    price: 18,
    rating: 4.8,
    reviewsCount: 567,
    imageUrl: "https://images.unsplash.com/photo-1574271143515-5cdec8288d5d?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1574271143515-5cdec8288d5d?w=800"],
    description: "Pack de 12 overgrips de alta absorción. Tacto suave y duradero.",
    features: ["Pack x12 unidades", "Alta absorción", "Tacto seco", "Fácil aplicación", "Colores variados"],
    inStock: true,
    isFeatured: false
  },
  {
    id: 18,
    name: "Muñequeras Deportivas",
    brand: "Babolat",
    category: "accesorios",
    price: 12,
    rating: 4.6,
    reviewsCount: 234,
    imageUrl: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800"],
    description: "Par de muñequeras elásticas. Máxima absorción del sudor.",
    features: ["Pack x2", "Tejido absorbente", "Elásticas", "Logo bordado", "Talla única"],
    inStock: true,
    isFeatured: false
  },
  {
    id: 19,
    name: "Bolsa de Bolas x3",
    brand: "Head",
    category: "accesorios",
    price: 6,
    rating: 4.5,
    reviewsCount: 445,
    imageUrl: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"],
    description: "3 bolas profesionales en tubo presurizado. Durabilidad garantizada.",
    features: ["3 bolas", "Presurizado", "Durabilidad pro", "Aprobadas federación", "Tubo reciclable"],
    inStock: true,
    isFeatured: false
  },
  {
    id: 20,
    name: "Protector de Pala",
    brand: "Nox",
    category: "accesorios",
    price: 15,
    rating: 4.7,
    reviewsCount: 189,
    imageUrl: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800"],
    description: "Protección premium para el marco de tu pala. Autoadhesivo.",
    features: ["Material PU premium", "Fácil aplicación", "Protección 360°", "No deja residuos", "Colores variados"],
    inStock: true,
    isFeatured: false
  }
]

export const categories = [
  { id: 'palas', name: 'Palas' },
  { id: 'zapatillas', name: 'Zapatillas' },
  { id: 'ropa', name: 'Ropa' },
  { id: 'accesorios', name: 'Accesorios' }
]

export const brands = ['Todas', 'Bullpadel', 'Adidas', 'Nox', 'Head', 'Babolat', 'Wilson', 'Nike', 'Asics']
