// Types for Messaging System

export interface Team {
  id: string
  name: string
  slug: string
  color: string
  icon: string
  description?: string
  email?: string
}

export interface User {
  id: string
  full_name: string
  email: string
  avatar_url?: string
}

export interface Message {
  id: string
  conversation_id: string
  from_email: string
  from_name?: string
  to_email: string
  subject?: string
  content: string
  html_content?: string
  type: 'message' | 'note' | 'system'
  is_internal: boolean
  is_from_customer: boolean
  read: boolean
  read_at?: string
  read_by?: string
  created_at: string
  attachments?: any[]
}

export interface Conversation {
  id: string
  contact_email: string
  contact_name?: string
  contact_phone?: string
  subject: string
  team_id?: string
  team?: Team
  category: string
  source: string
  assigned_to?: string
  assigned_user?: User
  assigned_at?: string
  status: 'new' | 'open' | 'pending' | 'solved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  tags: string[]
  first_message_at: string
  last_message_at: string
  first_response_at?: string
  closed_at?: string
  message_count: number
  unread_count: number
  metadata?: any
  created_at: string
  updated_at: string
  messages?: Message[]
  notes?: Note[]
  activities?: Activity[]
  latest_message?: Message[]
}

export interface Note {
  id: string
  conversation_id: string
  user_id: string
  user?: User
  content: string
  is_pinned: boolean
  created_at: string
}

export interface Activity {
  id: string
  conversation_id: string
  user_id?: string
  user?: User
  action: string
  details: any
  created_at: string
}

export interface ConversationStats {
  byStatus: {
    new: number
    open: number
    pending: number
    solved: number
    closed: number
    total: number
  }
  byPriority: {
    low: number
    normal: number
    high: number
    urgent: number
  }
  byTeam: {
    [key: string]: {
      name: string
      count: number
    }
  }
  myConversations: number
  unassigned: number
}

export type FilterType = 
  | 'inbox' 
  | 'mine' 
  | 'team' 
  | 'unassigned' 
  | 'new' 
  | 'open' 
  | 'pending' 
  | 'solved' 
  | 'closed'
  | string // team slugs

export interface ConversationFilters {
  status?: string
  team_id?: string
  assigned_to?: string | 'me' | 'unassigned'
  priority?: string
  search?: string
  page?: number
  limit?: number
}
