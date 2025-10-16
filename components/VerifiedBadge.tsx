import { CheckCircle2 } from 'lucide-react'

interface VerifiedBadgeProps {
  isVerified?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function VerifiedBadge({ isVerified = false, size = 'md', className = '' }: VerifiedBadgeProps) {
  if (!isVerified) return null

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className={`inline-flex items-center ${className}`} title="Cuenta oficial verificada de Padeliner">
      <CheckCircle2 
        className={`${sizeClasses[size]} text-blue-500 fill-blue-500`}
        strokeWidth={2.5}
      />
    </div>
  )
}
