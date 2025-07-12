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
  const [preselectedType, setPreselectedType] = useState<'tarefa' | 'meta'>('tarefa')
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
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button 
              variant="outline" 
              onClick={() => setConvertingNote(null)}
              className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
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
    <div className="min-h-screen bg-background">
      {/* Header com gradiente */}
      <div className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-foreground">
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
                className="bg-warning text-warning-foreground px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2"
              >
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="text-lg font-bold">{unprocessedNotes.length}</div>
                  <div className="text-xs opacity-90">
                    {unprocessedNotes.length === 1 ? 'nota pendente' : 'notas pendentes'}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-foreground text-lg">Carregando suas notas...</p>
              <p className="text-muted-foreground text-sm mt-2">Preparando o processamento GTD</p>
            </div>
          </div>
        ) : unprocessedNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Card className="bg-card/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-border max-w-2xl mx-auto overflow-hidden">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-8xl mb-6"
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold text-card-foreground mb-4">
                  Inbox Limpo!
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Parabéns! Você processou todas as suas notas capturadas.
                </p>
                <div className="bg-success/10 p-6 rounded-2xl border border-success/20">
                  <div className="text-sm text-success-foreground font-medium mb-2">✨ Metodologia GTD</div>
                  <p className="text-sm text-success-foreground leading-relaxed">
                    "Manter o inbox vazio é fundamental para uma mente tranquila e produtiva. 
                    Continue capturando ideias e processando-as regularmente." - David Allen
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
              <Card className="bg-card/80 backdrop-blur-lg shadow-xl border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-card-foreground mb-2">
                        Notas para Processar
                      </h2>
                      <p className="text-muted-foreground">
                        Selecione uma ação para cada nota seguindo o método GTD
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-4xl font-bold text-primary">
                        {unprocessedNotes.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {unprocessedNotes.length === 1 ? 'nota pendente' : 'notas pendentes'}
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
                    <Card className="bg-card/80 backdrop-blur-lg shadow-xl border-border overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <CardHeader className="relative pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-semibold text-card-foreground mb-2">
                              {note.titulo || 'Sem título'}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                📅 {new Date(note.criado_em).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                🕒 {new Date(note.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          
                          {note.tags.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {note.tags.map((tag) => (
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
                          <div className="bg-muted/30 rounded-xl p-4 border-l-4 border-primary">
                            <p className="text-foreground leading-relaxed">
                              {note.conteudo}
                            </p>
                          </div>
                        </div>

                        {/* Ações GTD */}
                        <div className="border-t border-border pt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🤔</span>
                            <p className="text-sm font-medium text-foreground">
                              O que fazer com esta nota?
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            {/* Converter em Tarefa */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={() => handleConvertToTask(note)}
                                disabled={processingNoteId === note.id}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group h-12"
                              >
                                <div className="absolute inset-0 bg-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                <div className="relative flex items-center justify-center gap-2">
                                  <span className="text-lg">✅</span>
                                  <span className="font-medium">Tarefa</span>
                                </div>
                                {processingNoteId === note.id && (
                                  <div className="absolute inset-0 bg-primary-foreground/20 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </Button>
                            </motion.div>

                            {/* Converter em Meta */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={() => handleConvertToGoal(note)}
                                disabled={processingNoteId === note.id}
                                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group h-12"
                              >
                                <div className="absolute inset-0 bg-secondary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                <div className="relative flex items-center justify-center gap-2">
                                  <span className="text-lg">🎯</span>
                                  <span className="font-medium">Meta</span>
                                </div>
                                {processingNoteId === note.id && (
                                  <div className="absolute inset-0 bg-secondary-foreground/20 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </Button>
                            </motion.div>

                            {/* Manter como Nota */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={() => handleKeepAsNote(note)}
                                disabled={processingNoteId === note.id}
                                className="w-full bg-success hover:bg-success/90 text-success-foreground shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group h-12"
                              >
                                <div className="absolute inset-0 bg-success-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                <div className="relative flex items-center justify-center gap-2">
                                  <span className="text-lg">📝</span>
                                  <span className="font-medium">Nota</span>
                                </div>
                                {processingNoteId === note.id && (
                                  <div className="absolute inset-0 bg-success-foreground/20 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-success-foreground border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </Button>
                            </motion.div>

                            {/* Conversão Avançada */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={() => setConvertingNote(note)}
                                disabled={processingNoteId === note.id}
                                variant="outline"
                                className="w-full bg-muted hover:bg-muted/80 text-muted-foreground border-border hover:border-accent shadow-lg hover:shadow-xl transition-all duration-200 h-12"
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
                              className="text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-all duration-200 inline-flex items-center gap-2"
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
                  <h3 className="font-semibold text-primary mb-4 flex items-center gap-2 text-lg">
                    <span className="text-2xl">💡</span>
                    Dicas GTD para Processamento Eficaz
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">✅</span>
                        <div>
                          <strong className="text-primary">Tarefa:</strong>
                          <p className="text-sm text-primary/80">Ação específica que você pode completar</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">🎯</span>
                        <div>
                          <strong className="text-primary">Meta:</strong>
                          <p className="text-sm text-primary/80">Resultado que você quer alcançar</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">📝</span>
                        <div>
                          <strong className="text-primary">Nota:</strong>
                          <p className="text-sm text-primary/80">Informação para referência futura</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">📦</span>
                        <div>
                          <strong className="text-primary">Arquivo:</strong>
                          <p className="text-sm text-primary/80">Talvez útil algum dia</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-primary italic text-center">
                      💭 "Se leva menos de 2 minutos para fazer, faça agora. Senão, capture como tarefa." 
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