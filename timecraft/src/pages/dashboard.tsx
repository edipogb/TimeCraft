import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MagicCard } from '@/components/magicui/magic-card'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { useNotesStore } from '@/stores/notes-store'
import { cn } from '@/lib/utils'

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
    <div className="relative min-h-screen">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0 opacity-50"
      />
      
      {/* Header da página */}
      <div className="relative z-10 px-4 sm:px-6 py-6 border-b border-border/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
            ✨ TimeCraft Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-lg">
            Bem-vindo ao seu hub de produtividade pessoal
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 py-8 space-y-8">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group cursor-pointer"
          >
            <MagicCard className="h-full" gradientFrom="#3b82f6" gradientTo="#06b6d4">
              <Card className="h-full bg-card/90 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-3 text-card-foreground">
                    <span className="text-xl sm:text-2xl">📝</span>
                    <span className="truncate">Notas de Hoje</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    {todaysNotes.length}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    {todaysNotes.length === 1 ? 'nota capturada hoje' : 'notas capturadas hoje'}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-muted rounded-full flex-1">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((todaysNotes.length / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-primary font-medium">
                      {Math.round((todaysNotes.length / 10) * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </MagicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "group cursor-pointer",
              unprocessedNotes.length > 0 && "animate-pulse"
            )}
          >
            <MagicCard 
              className="h-full" 
              gradientFrom={unprocessedNotes.length > 0 ? "#f97316" : "#10b981"}
              gradientTo={unprocessedNotes.length > 0 ? "#ef4444" : "#059669"}
            >
              <Card className="h-full bg-card/90 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-card-foreground">
                    <span className="text-xl sm:text-2xl">
                      {unprocessedNotes.length > 0 ? "📥" : "✅"}
                    </span>
                    <span className="truncate">Inbox GTD</span>
                    {unprocessedNotes.length > 0 && (
                      <motion.span 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center ml-auto"
                      >
                        {unprocessedNotes.length > 99 ? '99+' : unprocessedNotes.length}
                      </motion.span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl sm:text-4xl font-bold mb-2 text-primary">
                    {unprocessedNotes.length}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                    {unprocessedNotes.length === 1 ? 'nota para processar' : 'notas para processar'}
                  </p>
                  {unprocessedNotes.length > 0 && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-warning text-warning-foreground px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-center hover:bg-warning/80 transition-colors"
                    >
                      👆 Processar agora
                    </motion.div>
                  )}
                  {unprocessedNotes.length === 0 && (
                    <div className="bg-success/10 text-success px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-center">
                      🎉 Inbox limpo!
                    </div>
                  )}
                </CardContent>
              </Card>
            </MagicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group cursor-pointer"
          >
            <MagicCard className="h-full" gradientFrom="#10b981" gradientTo="#059669">
              <Card className="h-full bg-card/90 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-3 text-card-foreground">
                    <span className="text-xl sm:text-2xl">📊</span>
                    <span className="truncate">Total de Notas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    {notes.length}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    {notes.length === 1 ? 'nota total no sistema' : 'notas totais no sistema'}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Crescimento mensal</div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-success rounded-full w-3/4 transition-all duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MagicCard>
          </motion.div>
        </div>

        {/* Seção principal com notas recentes e próximos passos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MagicCard className="h-full" gradientFrom="#6366f1" gradientTo="#8b5cf6">
              <Card className="h-full bg-card/90 backdrop-blur-lg shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-3 text-card-foreground">
                    <span className="text-xl sm:text-2xl">📋</span>
                    Notas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
                    <span className="ml-3 text-muted-foreground">Carregando...</span>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl sm:text-6xl mb-4">📝</div>
                    <div className="text-muted-foreground mb-2">Nenhuma nota ainda</div>
                    <div className="text-sm text-muted-foreground/80">Use o Quick Capture para começar!</div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {notes.slice(0, 5).map((note, index) => (
                      <motion.div 
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="group p-3 sm:p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-1 h-8 sm:h-12 bg-primary rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-card-foreground text-sm mb-1 truncate">
                              {note.titulo || 'Sem título'}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {note.conteudo}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground/80">
                              <span className="flex items-center gap-1">
                                📅 {new Date(note.criado_em).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                🕒 {new Date(note.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {note.tipo !== 'rapida' && (
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                  {note.tipo}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </MagicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MagicCard className="h-full" gradientFrom="#f59e0b" gradientTo="#ef4444">
              <Card className="h-full bg-card/90 backdrop-blur-lg shadow-xl border-border/50 hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-3 text-card-foreground">
                    <span className="text-xl sm:text-2xl">🚀</span>
                    Próximos Passos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { icon: "✅", text: "Sistema de autenticação", status: "completed", color: "green" },
                    { icon: "✅", text: "Quick Capture funcionando", status: "completed", color: "green" },
                    { icon: "✅", text: "Migração para Magic UI", status: "completed", color: "green" },
                    { icon: "⏳", text: "Implementar gestão de tarefas", status: "progress", color: "yellow" },
                    { icon: "⭕", text: "Sistema de metas", status: "pending", color: "gray" },
                    { icon: "⭕", text: "Tracking de hábitos", status: "pending", color: "gray" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={cn(
                        "flex items-center gap-3 sm:gap-4 p-3 rounded-lg transition-all duration-200",
                        item.color === 'green' && "bg-success/10 border border-success/20",
                        item.color === 'yellow' && "bg-warning/10 border border-warning/20",
                        item.color === 'gray' && "bg-muted/50 border border-border"
                      )}
                    >
                      <span className="text-base sm:text-lg flex-shrink-0">{item.icon}</span>
                      <span className={cn(
                        "text-sm font-medium flex-1 min-w-0",
                        item.color === 'green' && "text-success",
                        item.color === 'yellow' && "text-warning",
                        item.color === 'gray' && "text-muted-foreground"
                      )}>
                        {item.text}
                      </span>
                      {item.status === 'progress' && (
                        <div className="w-12 sm:w-16 h-2 bg-muted rounded-full overflow-hidden flex-shrink-0">
                          <motion.div 
                            className="h-full bg-warning"
                            initial={{ width: 0 }}
                            animate={{ width: "60%" }}
                            transition={{ delay: 1, duration: 1 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="text-sm text-primary font-medium mb-2">💡 Metodologia GTD</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    "Sua mente é para ter ideias, não para guardá-las." Capture tudo no sistema e processe regularmente para manter a mente clara e focada.
                  </div>
                </div>
              </CardContent>
            </Card>
            </MagicCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}