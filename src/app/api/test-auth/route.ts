import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'fake@example.com',
      password: 'wrongpassword'
    });
    
    return NextResponse.json({
      success: !error,
      error: error?.message || null
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, exception: err.message });
  }
}
