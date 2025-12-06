import { createClient } from '@/utils/supabase/server'

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical'
export type LogStatus = 'success' | 'failure' | 'pending'

export interface AuditLogData {
  userId?: string
  action: string
  description: string
  entityType?: string
  entityId?: string
  level?: LogLevel
  status?: LogStatus
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  requestPath?: string
  requestMethod?: string
}

/**
 * Sistema de logging de auditoría
 * Registra eventos importantes en la base de datos
 */
export class AuditLogger {
  
  /**
   * Registra un log de auditoría
   */
  static async log(data: AuditLogData): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Obtener info del usuario si no se proporciona
      let userId = data.userId
      let userEmail: string | null = null
      let userRole: string | null = null
      
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser()
        userId = user?.id || undefined
      }
      
      if (userId) {
        const { data: authUser } = await supabase.auth.admin.getUserById(userId)
        userEmail = authUser?.user?.email || null
        
        const { data: userProfile } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single()
        
        userRole = userProfile?.role || null
      }

      // Insertar log
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          user_email: userEmail,
          user_role: userRole,
          action: data.action,
          entity_type: data.entityType || null,
          entity_id: data.entityId || null,
          description: data.description,
          level: data.level || 'info',
          status: data.status || 'success',
          metadata: data.metadata || {},
          ip_address: data.ipAddress || null,
          user_agent: data.userAgent || null,
          request_path: data.requestPath || null,
          request_method: data.requestMethod || null
        })

      if (error) {
        console.error('❌ Error creating audit log:', error)
      } else {
        console.log(`📝 Audit log created: ${data.action} - ${data.description}`)
      }
    } catch (error) {
      console.error('❌ Fatal error in audit logger:', error)
    }
  }

  // Shortcuts para niveles comunes
  static async info(action: string, description: string, data?: Partial<AuditLogData>) {
    return this.log({ action, description, level: 'info', ...data })
  }

  static async warning(action: string, description: string, data?: Partial<AuditLogData>) {
    return this.log({ action, description, level: 'warning', ...data })
  }

  static async error(action: string, description: string, data?: Partial<AuditLogData>) {
    return this.log({ action, description, level: 'error', ...data })
  }

  static async critical(action: string, description: string, data?: Partial<AuditLogData>) {
    return this.log({ action, description, level: 'critical', ...data })
  }

  // Shortcuts para acciones comunes
  static async logAuth(action: 'login' | 'logout' | 'register' | 'password_reset', userId: string, metadata?: any) {
    return this.log({
      userId,
      action,
      description: `User ${action}`,
      entityType: 'auth',
      entityId: userId,
      level: 'info',
      metadata
    })
  }

  static async logPayment(action: string, paymentId: string, userId: string, amount: number, status: LogStatus) {
    return this.log({
      userId,
      action: `payment_${action}`,
      description: `Payment ${action}: €${amount}`,
      entityType: 'payment',
      entityId: paymentId,
      level: status === 'success' ? 'info' : 'error',
      status,
      metadata: { amount }
    })
  }

  static async logEmail(action: string, recipientEmail: string, subject: string, status: LogStatus) {
    return this.log({
      action: `email_${action}`,
      description: `Email sent to ${recipientEmail}: ${subject}`,
      entityType: 'email',
      level: status === 'success' ? 'info' : 'error',
      status,
      metadata: { recipient: recipientEmail, subject }
    })
  }

  static async logConversation(action: string, conversationId: string, userId?: string, metadata?: any) {
    return this.log({
      userId,
      action: `conversation_${action}`,
      description: `Conversation ${action}`,
      entityType: 'conversation',
      entityId: conversationId,
      level: 'info',
      metadata
    })
  }

  static async logNewsletter(action: string, campaignId: string, recipientCount: number, status: LogStatus) {
    return this.log({
      action: `newsletter_${action}`,
      description: `Newsletter ${action} sent to ${recipientCount} recipients`,
      entityType: 'newsletter',
      entityId: campaignId,
      level: status === 'success' ? 'info' : 'error',
      status,
      metadata: { recipientCount }
    })
  }
}
