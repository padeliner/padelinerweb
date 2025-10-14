// Google Analytics 4 helper functions

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Blog-specific events
export const trackBlogView = (blogTitle: string, category: string, readingTime: number) => {
  event({
    action: 'blog_view',
    category: 'Blog',
    label: `${category} - ${blogTitle}`,
    value: readingTime
  })
}

export const trackScrollDepth = (percentage: number, blogTitle: string) => {
  event({
    action: 'scroll_depth',
    category: 'Blog',
    label: blogTitle,
    value: percentage
  })
}

export const trackShare = (platform: string, blogTitle: string) => {
  event({
    action: 'share',
    category: 'Blog',
    label: `${platform} - ${blogTitle}`
  })
}

export const trackCTAClick = (ctaType: string, destination: string) => {
  event({
    action: 'cta_click',
    category: 'CTA',
    label: `${ctaType} -> ${destination}`
  })
}

export const trackNewsletterSubscribe = (source: string) => {
  event({
    action: 'newsletter_subscribe',
    category: 'Newsletter',
    label: source
  })
}

export const trackReadingTime = (blogTitle: string, secondsRead: number) => {
  event({
    action: 'reading_time',
    category: 'Engagement',
    label: blogTitle,
    value: Math.round(secondsRead / 60) // Convert to minutes
  })
}
