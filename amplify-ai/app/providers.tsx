'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
      const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

      if (PH_KEY) {
        posthog.init(PH_KEY, {
          api_host: PH_HOST,
          person_profiles: 'identified_only', 
          capture_pageview: false // We capture manually for better control
        })
      }
    }, [])

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}