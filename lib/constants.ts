// ============================================================================
// USER ROLES - DEBE COINCIDIR CON LA BASE DE DATOS
// ============================================================================

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'alumno',        // ← En español!
  COACH: 'entrenador',      // ← En español!
  CLUB: 'club',
  ACADEMY: 'academia',      // ← En español!
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
