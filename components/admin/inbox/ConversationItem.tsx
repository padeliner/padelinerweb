'use client'

import { Conversation } from './types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Circle, User } from 'lucide-react'

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

export default function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const isUnread = conversation.unread_count > 0

  const statusColors = {
    new: 'bg-blue-500',
    open: 'bg-green-500',
    pending: 'bg-orange-500',
    solved: 'bg-emerald-500',
    closed: 'bg-gray-500'
  }

  const priorityColors = {
    urgent: 'border-l-4 border-red-500',
    high: 'border-l-4 border-orange-500',
    normal: '',
    low: ''
  }

  const latestMessage = conversation.latest_message?.[0]
  const preview = latestMessage?.content?.substring(0, 80) || conversation.subject

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors ${
        isSelected ? 'bg-primary-50 border-l-4 border-primary-600' : priorityColors[conversation.priority]
      } ${isUnread ? 'bg-blue-50/30' : ''}`}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {isUnread && (
            <Circle className="w-2 h-2 fill-primary-600 text-primary-600 flex-shrink-0" />
          )}
          <span className={`font-semibold truncate ${isUnread ? 'text-neutral-900' : 'text-neutral-700'}`}>
            {conversation.contact_name || conversation.contact_email}
          </span>
        </div>
        <span className="text-xs text-neutral-500 flex-shrink-0 ml-2">
          {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true, locale: es })}
        </span>
      </div>

      <div className={`text-sm mb-2 line-clamp-1 ${isUnread ? 'font-medium text-neutral-900' : 'text-neutral-600'}`}>
        {conversation.subject}
      </div>

      <div className="text-xs text-neutral-500 line-clamp-2 mb-2">
        {preview}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Team Badge */}
          {conversation.team && (
            <span 
              className="text-xs px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: `${conversation.team.color}20`,
                color: conversation.team.color 
              }}
            >
              {conversation.team.name}
            </span>
          )}

          {/* Priority Badge */}
          {(conversation.priority === 'high' || conversation.priority === 'urgent') && (
            <span className={`text-xs px-2 py-0.5 rounded ${
              conversation.priority === 'urgent' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {conversation.priority === 'urgent' ? '🔥' : '⚠️'}
            </span>
          )}

          {/* Assigned Badge */}
          {conversation.assigned_user && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3 text-neutral-400" />
              <span className="text-xs text-neutral-600">
                {conversation.assigned_user.full_name?.split(' ')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-1">
          <Circle className={`w-2 h-2 ${statusColors[conversation.status]}`} />
        </div>
      </div>
    </button>
  )
}
