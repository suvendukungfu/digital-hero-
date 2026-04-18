import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase environment variables for server/admin client')
}

/**
 * Service Role Client
 * IMPORTANT: Only use this in server-side code (API routes, server actions)
 * This bypasses RLS and should be used with extreme caution.
 */
export const createAdminClient = () => {
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Standard Server Client (Cookie Aware)
 * Use this for user-specific operations in server components/actions.
 */
export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            console.error('Supabase cookie set error (expected in Server Components, unexpected in Actions):', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            console.error('Supabase cookie remove error:', error)
          }
        },
      },
    }
  )
}
