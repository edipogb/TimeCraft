import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NoteConverter } from '@/components/shared/note-converter'
import { useNotesStore } from '@/stores/notes-store'
import { toast } from 'sonner'
import type { Nota } from '@/types/app'

export function InboxPage() {
  const { notes, loading, fetchNotes, updateNote } = useNotesStore()
  const [convertingNote, setConvertingNote] = useState<Nota | null>(null)
  const [preselectedType, setPreselectedType] = useState<'tarefa' | 'meta'>('tarefa')

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const unprocessedNotes = notes.filter(note => note.tipo === 'rapida')

  const handleConvertToTask = (note: Nota) => {
    setPreselectedType('tarefa')
    setConvertingNote(note)
  }

  const handleConvertToGoal = (note: Nota) => {
    setPreselectedType('meta')
    setConvertingNote(note)
  }

  const handleKeepAsNote = async (note: Nota) => {
    try {
      await updateNote(note.id, { tipo: 'referencia' })
      toast.success('Nota mantida como referência')
    } catch (error) {
      toast.error('Erro ao atualizar nota')
    }
  }

  const handleArchiveNote = async (note: Nota) => {
    try {
      await updateNote(note.id, { tipo: 'algum_dia' })
      toast.success('Nota arquivada')
    } catch (error) {
      toast.error('Erro ao arquivar nota')
    }
  }

  if (convertingNote) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setConvertingNote(null)}
            className="mb-4"
          >
            ← Voltar para Inbox
          </Button>
        </div>
        
        <NoteConverter
          note={convertingNote}
          preselectedType={preselectedType}
          onConverted={() => {
            setConvertingNote(null)
            fetchNotes() // Refresh para remover da lista
          }}
          onCancel={() => setConvertingNote(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📥 Inbox GTD</h1>
        <p className="text-gray-600">
          Processe suas notas capturadas. Decida o que fazer com cada uma.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : unprocessedNotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold mb-2">Inbox Limpo!</h3>
            <p className="text-gray-600">
              Parabéns! Você processou todas as suas notas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {unprocessedNotes.length} {unprocessedNotes.length === 1 ? 'nota' : 'notas'} para processar
            </h2>
            <Badge variant="outline">
              {unprocessedNotes.length} pendentes
            </Badge>
          </div>

          {unprocessedNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {note.titulo || 'Sem título'}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Capturado em {new Date(note.criado_em).toLocaleString('pt-BR')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    {note.conteudo}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => handleConvertToTask(note)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    ✅ Converter em Tarefa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConvertToGoal(note)}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    🎯 Converter em Meta
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleKeepAsNote(note)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    📝 Manter como Nota
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleArchiveNote(note)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    📦 Arquivar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}