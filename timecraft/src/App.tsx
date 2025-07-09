import { useEffect, useState } from 'react'
import { testConnection } from './lib/supabase'

function App() {
  const [connected, setConnected] = useState<boolean | null>(null)

  useEffect(() => {
    testConnection().then(setConnected)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 TimeCraft
        </h1>
        <p className="text-gray-600 mb-6">Personal Productivity Hub</p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Status da Conexão</h2>
          {connected === null && (
            <div className="text-yellow-600">🔄 Testando conexão...</div>
          )}
          {connected === true && (
            <div className="text-green-600">✅ Supabase conectado com sucesso!</div>
          )}
          {connected === false && (
            <div className="text-red-600">❌ Erro na conexão. Verifique .env.local</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App