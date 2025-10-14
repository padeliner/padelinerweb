import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { data: emails, error: dbError } = await supabase
      .from('incoming_emails')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(100)

    if (dbError) {
      return NextResponse.json({
        emails: [],
        note: 'La tabla incoming_emails no está configurada',
      })
    }

    // Transformar al formato esperado por el componente
    const transformedEmails = emails.map((email: any) => ({
      id: email.id,
      from: email.from_address,
      subject: email.subject,
      body: email.text_content || email.html_content,
      received_at: email.received_at,
      is_read: email.is_read,
      is_starred: email.is_starred,
    }))

    return NextResponse.json({ emails: transformedEmails })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
