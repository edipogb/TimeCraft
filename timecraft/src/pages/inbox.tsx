import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [preselectedType, setPreselectedType] = useState<'tarefa' | 'meta'>(
    'tarefa'
  )
  const [processingNoteId, setProcessingNoteId] = useState<string | null>(null)

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
    setProcessingNoteId(note.id)
    try {
      await updateNote(note.id, { tipo: 'referencia' })
      toast.success('Nota mantida como referência')
      await fetchNotes()
    } catch {
      toast.error('Erro ao atualizar nota')
    } finally {
      setProcessingNoteId(null)
    }
  }

  const handleArchiveNote = async (note: Nota) => {
    setProcessingNoteId(note.id)
    try {
      await updateNote(note.id, { tipo: 'algum_dia' })
      toast.success('Nota arquivada')
      await fetchNotes()
    } catch {
      toast.error('Erro ao arquivar nota')
    } finally {
      setProcessingNoteId(null)
    }
  }

  if (convertingNote) {
    return (
      <div className="bg-background min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              variant="outline"
              onClick={() => setConvertingNote(null)}
              className="bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
            >
              ← Voltar para Inbox
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <NoteConverter
              note={convertingNote}
              preselectedType={preselectedType}
              onConverted={() => {
                setConvertingNote(null)
                fetchNotes()
              }}
              onCancel={() => setConvertingNote(null)}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header com gradiente */}
      <div className="bg-background/80 border-border sticky top-0 z-10 border-b backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-foreground text-4xl font-bold">
                📥 Inbox GTD
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Processe suas notas capturadas seguindo a metodologia GTD
              </p>
            </div>

            {unprocessedNotes.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-warning text-warning-foreground flex items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-lg"
              >
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="text-lg font-bold">
                    {unprocessedNotes.length}
                  </div>
                  <div className="text-xs opacity-90">
                    {unprocessedNotes.length === 1
                      ? 'nota pendente'
                      : 'notas pendentes'}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="border-muted border-t-primary mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4"></div>
              <p className="text-foreground text-lg">
                Carregando suas notas...
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Preparando o processamento GTD
              </p>
            </div>
          </div>
        ) : unprocessedNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <Card className="bg-card/80 border-border mx-auto max-w-2xl overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-lg">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mb-6 text-8xl"
                >
                  🎉
                </motion.div>
                <h3 className="text-card-foreground mb-4 text-3xl font-bold">
                  Inbox Limpo!
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Parabéns! Você processou todas as suas notas capturadas.
                </p>
                <div className="bg-success/10 border-success/20 rounded-2xl border p-6">
                  <div className="text-success-foreground mb-2 text-sm font-medium">
                    ✨ Metodologia GTD
                  </div>
                  <p className="text-success-foreground text-sm leading-relaxed">
                    "Manter o inbox vazio é fundamental para uma mente tranquila
                    e produtiva. Continue capturando ideias e processando-as
                    regularmente." - David Allen
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Header da lista */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card/80 border-border shadow-xl backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-card-foreground mb-2 text-2xl font-bold">
                        Notas para Processar
                      </h2>
                      <p className="text-muted-foreground">
                        Selecione uma ação para cada nota seguindo o método GTD
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-primary text-4xl font-bold">
                        {unprocessedNotes.length}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {unprocessedNotes.length === 1
                          ? 'nota pendente'
                          : 'notas pendentes'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lista de notas */}
            <div className="space-y-6">
              <AnimatePresence>
                {unprocessedNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <Card className="bg-card/80 border-border group overflow-hidden shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl">
                      <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <CardHeader className="relative pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-card-foreground mb-2 text-xl font-semibold">
                              {note.titulo || 'Sem título'}
                            </CardTitle>
                            <div className="text-muted-foreground flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                📅{' '}
                                {new Date(note.criado_em).toLocaleDateString(
                                  'pt-BR'
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                🕒{' '}
                                {new Date(note.criado_em).toLocaleTimeString(
                                  'pt-BR',
                                  { hour: '2-digit', minute: '2-digit' }
                                )}
                              </span>
                            </div>
                          </div>

                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {note.tags.map(tag => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-primary/10 text-primary text-xs font-medium"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="relative">
                        {/* Conteúdo da nota */}
                        <div className="mb-6">
                          <div className="bg-muted/30 border-primary rounded-xl border-l-4 p-4">
                            <p className="text-foreground leading-relaxed">
                              {note.conteudo}
                            </p>
                          </div>
                        </div>

                        {/* Ações GTD */}
                        <div className="border-border border-t pt-6">
                          <div className="mb-4 flex items-center gap-2">
                            <span className="text-2xl">🤔</span>
                            <p className="text-foreground text-sm font-medium">
                              O que fazer com esta nota?
                            </p>
                          </div>

                          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                            {/* Converter em Tarefa */}
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => handleConvertToTask(note)}
                                disabled={processingNoteId === note.id}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground group relative h-12 w-full overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl"
                              >
                                <div className="bg-primary-foreground/10 absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                <div className="relative flex items-center justify-center gap-2">
                                  <span className="text-lg">✅</span>
                                  <span className="font-medium">Tarefa</span>
                                </div>
                                {processingNoteId === note.id && (
                                  <div className="bg-primary-foreground/20 absolute inset-0 flex items-center justify-center">
                                    <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                  </div>
                                )}
                              </Button>
                            </motion.div>

                            {/* Converter em Meta */}
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => handleConvertToGoal(note)}
                                disabled={processingNoteId === note.id}
                                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground group relative h-12 w-full overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl"
                              >
                                <div className="bg-secondary-foreground/10 absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                <div className="relative flex items-center justify-center gap-2">
                                  <span className="text-lg">🎯</span>
                                  <span className="font-medium">Meta</span>
                                </div>
                                {processingNoteId === note.id && (
                                  <div className="bg-secondary-foreground/20 absolute inset-0 flex items-center justify-center">
                                    <div className="border-secondary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                  </div>
                                )}
                              </Button>
                            </motion.div>

                            {/* Manter como Nota */}
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => handleKeepAsNote(note)}
                                disabled={processingNoteId === note.id}
                                className="bg-success hover:bg-success/90 text-success-foreground group relative h-12 w-full overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl"
                              >
                                <div className="bg-success-foreground/10 absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                <div className="relative flex items-center justify-center gap-2">
                                  <span className="text-lg">📝</span>
                                  <span className="font-medium">Nota</span>
                                </div>
                                {processingNoteId === note.id && (
                                  <div className="bg-success-foreground/20 absolute inset-0 flex items-center justify-center">
                                    <div className="border-success-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                  </div>
                                )}
                              </Button>
                            </motion.div>

                            {/* Conversão Avançada */}
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => setConvertingNote(note)}
                                disabled={processingNoteId === note.id}
                                variant="outline"
                                className="bg-muted hover:bg-muted/80 text-muted-foreground border-border hover:border-accent h-12 w-full shadow-lg transition-all duration-200 hover:shadow-xl"
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-lg">⚙️</span>
                                  <span className="font-medium">Avançado</span>
                                </div>
                              </Button>
                            </motion.div>
                          </div>

                          {/* Ação secundária - Arquivar */}
                          <div className="text-center">
                            <motion.button
                              onClick={() => handleArchiveNote(note)}
                              disabled={processingNoteId === note.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-200"
                            >
                              <span>📦</span>
                              Arquivar para depois
                            </motion.button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Dicas GTD */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <Card className="bg-primary/5 border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-primary mb-4 flex items-center gap-2 text-lg font-semibold">
                    <span className="text-2xl">💡</span>
                    Dicas GTD para Processamento Eficaz
                  </h3>
                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">✅</span>
                        <div>
                          <strong className="text-primary">Tarefa:</strong>
                          <p className="text-primary/80 text-sm">
                            Ação específica que você pode completar
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">🎯</span>
                        <div>
                          <strong className="text-primary">Meta:</strong>
                          <p className="text-primary/80 text-sm">
                            Resultado que você quer alcançar
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">📝</span>
                        <div>
                          <strong className="text-primary">Nota:</strong>
                          <p className="text-primary/80 text-sm">
                            Informação para referência futura
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">📦</span>
                        <div>
                          <strong className="text-primary">Arquivo:</strong>
                          <p className="text-primary/80 text-sm">
                            Talvez útil algum dia
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-primary text-center text-sm italic">
                      💭 "Se leva menos de 2 minutos para fazer, faça agora.
                      Senão, capture como tarefa."
                      <span className="font-medium"> - David Allen</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
