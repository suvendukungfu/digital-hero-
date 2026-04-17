'use server'

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function upsertCharity(formData: FormData) {
  const userClient = createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await userClient.auth.getUser()

  const { data: profile } = await userClient.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') throw new Error("Unauthorized")

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const charityData = { name, description }

  if (id) {
    const { error } = await adminClient.from('charities').update(charityData).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await adminClient.from('charities').insert([charityData])
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/charities')
  revalidatePath('/dashboard/charity')
}

export async function deleteCharity(id: string) {
  const userClient = createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await userClient.auth.getUser()

  const { data: profile } = await userClient.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') throw new Error("Unauthorized")

  const { error } = await adminClient.from('charities').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/charities')
  revalidatePath('/dashboard/charity')
}
