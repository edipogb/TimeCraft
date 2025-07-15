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
    detectSessionInUrl: true,
  },
})

// Função de teste da conexão
export async function testConnection() {
  try {
    const { error } = await supabase.from('usuarios').select('id').limit(1)

    if (error) throw error
    console.log('✅ Supabase conectado com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro na conexão Supabase:', error)
    return false
  }
}

// Função para testar auth
export async function testAuth() {
  try {
    console.log('🔍 Testando autenticação...')

    // Teste básico da auth
    const { data: session, error: sessionError } =
      await supabase.auth.getSession()

    if (sessionError) {
      console.error('❌ Erro na sessão:', sessionError)
      return false
    }

    console.log(
      '✅ Auth funcionando. Sessão atual:',
      session.session?.user?.email || 'Não logado'
    )

    return true
  } catch (error) {
    console.error('❌ Erro no teste de auth:', error)
    return false
  }
}

// Expor para debug no browser (sem expor chaves)
if (typeof window !== 'undefined') {
  ;(
    window as unknown as { supabaseDebug: typeof import('./supabase') }
  ).supabaseDebug = {
    testConnection,
    testAuth,
  }
}
