'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addScore(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const score = parseInt(formData.get('score') as string)
  const score_date = formData.get('score_date') as string

  if (isNaN(score) || score < 1 || score > 45) {
      throw new Error("Score must be between 1 and 45")
  }

  const { error: insertError } = await supabase
    .from('golf_scores')
    .insert([{ 
        user_id: user.id, 
        score, 
        score_date 
    }])

  if (insertError) {
      if (insertError.code === '23505') {
          throw new Error("A score already exists for this date.")
      }
      throw new Error(insertError.message)
  }

  const { data: scores } = await supabase
    .from('golf_scores')
    .select('id')
    .eq('user_id', user.id)
    .order('score_date', { ascending: false })

  if (scores && scores.length > 5) {
      const idsToDelete = scores.slice(5).map(s => s.id)
      await supabase
        .from('golf_scores')
        .delete()
        .in('id', idsToDelete)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/scores')
}

export async function deleteScore(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error("Unauthorized")

    await supabase
        .from('golf_scores')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    revalidatePath('/dashboard/scores')
}
