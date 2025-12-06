/**
 * Cliente de Supabase para Client Components
 * 
 * IMPORTANTE: Este es el ÚNICO archivo que debes importar en Client Components.
 * 
 * Usa cookies para almacenar la sesión (compatible con Server Components)
 * 
 * Para Server Components usa: @/utils/supabase/server
 */

import { createClient } from '@/utils/supabase/client'

// Instancia única del cliente
export const supabase = createClient()
