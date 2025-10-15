import { Suspense } from 'react'
import InboxClient from '@/components/admin/inbox/InboxClient'

export const metadata = {
  title: 'Mensajería - Padeliner Admin',
  description: 'Sistema de gestión de mensajes y conversaciones'
}

export default function MessagingPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <Suspense fallback={<InboxSkeleton />}>
        <InboxClient />
      </Suspense>
    </div>
  )
}

function InboxSkeleton() {
  return (
    <div className="h-full flex">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r bg-neutral-50 p-4 space-y-4">
        <div className="h-10 bg-neutral-200 rounded animate-pulse" />
        <div className="h-40 bg-neutral-200 rounded animate-pulse" />
        <div className="h-60 bg-neutral-200 rounded animate-pulse" />
      </div>
      
      {/* List skeleton */}
      <div className="w-96 border-r bg-white p-4 space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-24 bg-neutral-100 rounded animate-pulse" />
        ))}
      </div>
      
      {/* Detail skeleton */}
      <div className="flex-1 p-4 space-y-4">
        <div className="h-20 bg-neutral-100 rounded animate-pulse" />
        <div className="h-96 bg-neutral-100 rounded animate-pulse" />
      </div>
    </div>
  )
}
