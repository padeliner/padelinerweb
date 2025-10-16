// Sistema de validación inteligente para mensajes del chat
// Previene compartir contactos externos, URLs y contenido inapropiado

interface ValidationResult {
  isValid: boolean
  reason?: string
  blockedContent?: string
}

// Patrones para detectar URLs (muy exhaustivo)
const URL_PATTERNS = [
  // URLs completas
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
  // URLs sin protocolo
  /(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
  // Dominios comunes
  /\b[a-zA-Z0-9.-]+\.(com|net|org|es|io|co|app|dev|xyz|online|site|shop|store|me|tv|info|biz)\b/gi,
  // URLs con espacios para evadir (ej: "face book .com")
  /[a-zA-Z0-9]+\s*\.\s*(com|net|org|es|io|co|app|dev)\b/gi,
  // URLs sin punto (ej: "instagram")
  /\b(instagram|facebook|whatsapp|telegram|twitter|tiktok|snapchat|linkedin)\b/gi,
  // @ menciones (redes sociales)
  /@[a-zA-Z0-9._]{3,}/g,
]

// Patrones para detectar teléfonos (múltiples formatos)
const PHONE_PATTERNS = [
  // Formato español: +34 123 456 789
  /(\+34|0034)[\s.-]?[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/g,
  // Formato internacional genérico
  /\+\d{1,4}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g,
  // 9 dígitos juntos o separados
  /\b\d{3}[\s.-]?\d{3}[\s.-]?\d{3}\b/g,
  // Teléfono con paréntesis
  /\(\d{3}\)[\s.-]?\d{3}[\s.-]?\d{3,4}/g,
  // Números largos (posibles teléfonos)
  /\b\d{9,15}\b/g,
  // Con espacios para evadir (ej: "6 1 2 3 4 5 6 7 8")
  /\b\d(\s*\d){8,}\b/g,
  // Palabras clave
  /\b(tel[eé]fono|tel|llamar|ll[aá]mame|contacto|n[uú]mero|whatsapp|wpp|wa)\s*:?\s*\d/gi,
]

// Emails
const EMAIL_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  // Con espacios para evadir
  /[a-zA-Z0-9._%+-]+\s*@\s*[a-zA-Z0-9.-]+\s*\.\s*[a-zA-Z]{2,}/gi,
  // Arroba escrita
  /[a-zA-Z0-9._%+-]+\s*(arroba|at)\s*[a-zA-Z0-9.-]+/gi,
]

// Palabras prohibidas (insultos, violencia, contenido inapropiado)
const PROHIBITED_WORDS = [
  // Insultos comunes (lista básica - expandir según necesidad)
  'puta', 'puto', 'mierda', 'cabrón', 'cabron', 'hijo de puta', 'hdp', 'gilipollas',
  'imbécil', 'imbecil', 'idiota', 'tonto', 'estúpido', 'estupido', 'maricón', 'maricon',
  'joder', 'coño', 'cojones', 'pendejo', 'mamón', 'mamona', 'zorra', 'perra',
  
  // Variaciones con símbolos
  'p.u.t.a', 'c@brón', 'c0ño', 'j0der',
  
  // Violencia/amenazas
  'matar', 'morir', 'muerte', 'suicid', 'violar', 'violación', 'abusar',
  
  // Discriminación
  'racista', 'nazi', 'facha', 'rojo', 'negro de mierda',
]

// Palabras clave que sugieren contacto externo
const EXTERNAL_CONTACT_KEYWORDS = [
  'whatsapp', 'whats app', 'wpp', 'wa', 'telegram', 'instagram', 'insta',
  'facebook', 'fb', 'twitter', 'tiktok', 'snapchat', 'snap',
  'llamar', 'llamame', 'llámame', 'te llamo', 'contactar', 'contactame',
  'mi tel', 'mi numero', 'mi número', 'mi email', 'mi correo',
  'fuera de aqui', 'fuera de la app', 'por fuera', 'en privado',
  'otro lado', 'otra plataforma', 'directamente',
]

/**
 * Normaliza texto para detectar evasiones
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^\w\s]/g, ' ') // Reemplazar símbolos por espacios
    .replace(/\s+/g, ' ') // Múltiples espacios a uno
    .trim()
}

/**
 * Valida si el mensaje contiene URLs
 */
function checkURLs(text: string): ValidationResult {
  const normalized = normalizeText(text)
  
  for (const pattern of URL_PATTERNS) {
    const matches = text.match(pattern) || normalized.match(pattern)
    if (matches) {
      return {
        isValid: false,
        reason: 'No se permiten compartir enlaces o redes sociales',
        blockedContent: matches[0]
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Valida si el mensaje contiene teléfonos
 */
function checkPhones(text: string): ValidationResult {
  const normalized = normalizeText(text)
  
  for (const pattern of PHONE_PATTERNS) {
    const matches = text.match(pattern) || normalized.match(pattern)
    if (matches) {
      // Filtrar falsos positivos (ej: fechas, códigos)
      const match = matches[0].replace(/\D/g, '') // Solo números
      if (match.length >= 9) {
        return {
          isValid: false,
          reason: 'No se permiten compartir números de teléfono',
          blockedContent: matches[0]
        }
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Valida si el mensaje contiene emails
 */
function checkEmails(text: string): ValidationResult {
  for (const pattern of EMAIL_PATTERNS) {
    const matches = text.match(pattern)
    if (matches) {
      return {
        isValid: false,
        reason: 'No se permiten compartir direcciones de correo electrónico',
        blockedContent: matches[0]
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Valida si el mensaje contiene palabras prohibidas
 */
function checkProhibitedWords(text: string): ValidationResult {
  const normalized = normalizeText(text)
  
  for (const word of PROHIBITED_WORDS) {
    const normalizedWord = normalizeText(word)
    if (normalized.includes(normalizedWord)) {
      return {
        isValid: false,
        reason: 'El mensaje contiene lenguaje inapropiado',
        blockedContent: '***'
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Detecta intentos de compartir contacto externo
 */
function checkExternalContact(text: string): ValidationResult {
  const normalized = normalizeText(text)
  
  for (const keyword of EXTERNAL_CONTACT_KEYWORDS) {
    const normalizedKeyword = normalizeText(keyword)
    if (normalized.includes(normalizedKeyword)) {
      return {
        isValid: false,
        reason: 'No se permite coordinar fuera de la plataforma. Usa Padeliner para reservas seguras.',
        blockedContent: keyword
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Valida un mensaje completo
 * @param message - El contenido del mensaje
 * @param isAdmin - Si el usuario es admin (admins pueden enviar cualquier cosa)
 */
export function validateMessage(message: string, isAdmin: boolean = false): ValidationResult {
  // ⚡ ADMIN bypass: Los admins pueden enviar lo que quieran
  if (isAdmin) {
    return { isValid: true }
  }
  if (!message || message.trim().length === 0) {
    return { isValid: false, reason: 'El mensaje está vacío' }
  }

  if (message.length > 1000) {
    return { isValid: false, reason: 'El mensaje es demasiado largo (máximo 1000 caracteres)' }
  }

  // Ejecutar todas las validaciones
  const validations = [
    checkURLs(message),
    checkPhones(message),
    checkEmails(message),
    checkProhibitedWords(message),
    checkExternalContact(message),
  ]

  for (const validation of validations) {
    if (!validation.isValid) {
      return validation
    }
  }

  return { isValid: true }
}

/**
 * Versión async para usar en API
 * @param message - El contenido del mensaje
 * @param isAdmin - Si el usuario es admin (admins pueden enviar cualquier cosa)
 */
export async function validateMessageAsync(message: string, isAdmin: boolean = false): Promise<ValidationResult> {
  return validateMessage(message, isAdmin)
}
