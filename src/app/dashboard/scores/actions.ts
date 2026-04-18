'use server'

import { revalidatePath } from "next/cache"
import { scoreSchema } from "@/lib/validations"
import { requireActiveSubscription } from "@/lib/guards"

export async function addScore(formData: FormData) {
  const { user, supabase } = await requireActiveSubscription()

  const rawScore = parseInt(formData.get('score') as string)
  const rawDate = formData.get('score_date') as string

  // Validate with Zod
  const result = scoreSchema.safeParse({ score: rawScore, score_date: rawDate })
  if (!result.success) {
    throw new Error(result.error.errors[0].message)
  }

  const { score, score_date } = result.data

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

  // Keep only latest 5 scores
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
    const { user, supabase } = await requireActiveSubscription()

    const { error } = await supabase
        .from('golf_scores')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/scores')
}
