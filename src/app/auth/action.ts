'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/auth?error=true&message=Invalid+login+credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      }
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/auth?error=true&message=Could+not+sign+up+user')
  }

  if (!authData.session) {
    redirect('/auth?success=true&message=Please+check+your+email+to+verify+your+account')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/')
}
