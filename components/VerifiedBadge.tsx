import { ShieldCheck } from 'lucide-react'

interface VerifiedBadgeProps {
  isVerified?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function VerifiedBadge({ isVerified = false, size = 'md', className = '' }: VerifiedBadgeProps) {
  if (!isVerified) return null

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className={`inline-flex items-center ${className}`} title="Cuenta oficial verificada de Padeliner">
      <ShieldCheck 
        className={`${sizeClasses[size]} text-blue-600 fill-blue-100`}
        strokeWidth={2}
      />
    </div>
  )
}
