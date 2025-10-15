import { createClient } from '@supabase/supabase-js'

// Cliente de Supabase con service_role (bypasea RLS)
// Usar SOLO para operaciones de servidor que requieren privilegios elevados
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
