import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotesStore } from '@/stores/notes-store'

export function Dashboard() {
  const { notes, loading, fetchNotes } = useNotesStore()

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const todaysNotes = notes.filter(note => {
    const today = new Date().toDateString()
    const noteDate = new Date(note.criado_em).toDateString()
    return today === noteDate
  })

  const unprocessedNotes = notes.filter(note => note.tipo === 'rapida')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao seu hub de produtividade</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">=Ý Notas de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {todaysNotes.length}
            </div>
            <p className="text-sm text-gray-600">
              {todaysNotes.length === 1 ? 'nota capturada' : 'notas capturadas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">¡ Inbox GTD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {unprocessedNotes.length}
            </div>
            <p className="text-sm text-gray-600">
              {unprocessedNotes.length === 1 ? 'nota para processar' : 'notas para processar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">=Ê Total de Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {notes.length}
            </div>
            <p className="text-sm text-gray-600">
              {notes.length === 1 ? 'nota total' : 'notas totais'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>=€ Notas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : notes.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Nenhuma nota ainda. Use o Quick Capture!
              </div>
            ) : (
              <div className="space-y-3">
                {notes.slice(0, 5).map((note) => (
                  <div key={note.id} className="border-l-4 border-blue-500 pl-3">
                    <div className="font-medium text-sm">
                      {note.titulo || 'Sem título'}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {note.conteudo}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(note.criado_em).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>¡ Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-green-500"></span>
                <span className="text-sm">Sistema de autenticação</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500"></span>
                <span className="text-sm">Quick Capture funcionando</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-500">=</span>
                <span className="text-sm">Implementar gestão de tarefas</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">U</span>
                <span className="text-sm">Sistema de metas</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">U</span>
                <span className="text-sm">Tracking de hábitos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}