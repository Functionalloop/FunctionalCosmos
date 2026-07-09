'use server';

import { createClient } from '@supabase/supabase-js';

// We create a special Supabase client just for the server, using the secret Service Role key.
// This key bypasses Row Level Security (RLS) entirely, so it MUST NEVER be sent to the client.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function saveRecord(table: string, payload: any, isCreating: boolean) {
  try {
    let result;
    if (isCreating) {
      result = await adminSupabase.from(table).insert(payload);
    } else {
      result = await adminSupabase.from(table).update(payload).eq('id', payload.id);
    }

    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Server Action Error (Save):', error);
    return { success: false, error: error.message };
  }
}

export async function deleteRecord(table: string, id: number) {
  try {
    const { error } = await adminSupabase.from(table).delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  } catch (error: any) {
    console.error('Server Action Error (Delete):', error);
    return { success: false, error: error.message };
  }
}
