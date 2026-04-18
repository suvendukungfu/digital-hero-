'use server'

import { revalidatePath } from "next/cache"
import { requireActiveSubscription } from "@/lib/guards"

export async function selectCharity(charityId: string, percentage: number) {
  const { user, supabase } = await requireActiveSubscription()

  if (percentage < 10 || percentage > 100) {
      throw new Error("Percentage must be between 10% and 100%")
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({ 
        selected_charity_id: charityId,
        charity_percentage: percentage
    })
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/charity')
}
