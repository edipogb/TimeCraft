import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Função de teste da conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1)
    
    if (error) throw error
    console.log('✅ Supabase conectado com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro na conexão Supabase:', error)
    return false
  }
}