import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen bg-background">
      {/* Header da página */}
      <div className="px-4 sm:px-6 py-8 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            TimeCraft Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Bem-vindo ao seu hub de produtividade pessoal
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-8 space-y-8">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
                <span>Notas de Hoje</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {todaysNotes.length}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {todaysNotes.length === 1 ? 'nota capturada hoje' : 'notas capturadas hoje'}
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-muted rounded-full flex-1">
                  <div 
                    className="h-2 bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((todaysNotes.length / 10) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {Math.round((todaysNotes.length / 10) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "border bg-card shadow-sm hover:shadow-md transition-shadow duration-200",
            unprocessedNotes.length > 0 ? "border-warning/20 bg-warning/5" : "border-success/20 bg-success/5"
          )}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  unprocessedNotes.length > 0 ? "bg-warning/10" : "bg-success/10"
                )}>
                  <span className="text-lg">
                    {unprocessedNotes.length > 0 ? "📥" : "✅"}
                  </span>
                </div>
                <span>Inbox GTD</span>
                {unprocessedNotes.length > 0 && (
                  <span className="bg-warning text-warning-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ml-auto">
                    {unprocessedNotes.length > 99 ? '99+' : unprocessedNotes.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {unprocessedNotes.length}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {unprocessedNotes.length === 1 ? 'nota para processar' : 'notas para processar'}
              </p>
              {unprocessedNotes.length > 0 && (
                <button className="w-full bg-warning hover:bg-warning/90 text-warning-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Processar agora
                </button>
              )}
              {unprocessedNotes.length === 0 && (
                <div className="bg-success/10 text-success px-3 py-2 rounded-lg text-sm font-medium text-center">
                  🎉 Inbox limpo!
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <span>Total de Notas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {notes.length}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {notes.length === 1 ? 'nota total no sistema' : 'notas totais no sistema'}
              </p>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Crescimento mensal</div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-success rounded-full w-3/4 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção principal com notas recentes e próximos passos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">📋</span>
                </div>
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
                  <div className="space-y-4">
                    {notes.slice(0, 5).map((note) => (
                      <div 
                        key={note.id}
                        className="p-4 rounded-lg border border-border bg-muted/50 hover:bg-muted/70 transition-colors duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-1 h-12 bg-primary rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground text-sm mb-1 truncate">
                              {note.titulo || 'Sem título'}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {note.conteudo}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">🚀</span>
                </div>
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
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg border transition-colors duration-200",
                        item.color === 'green' && "bg-success/5 border-success/20",
                        item.color === 'yellow' && "bg-warning/5 border-warning/20",
                        item.color === 'gray' && "bg-muted/50 border-border"
                      )}
                    >
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <span className={cn(
                        "text-sm font-medium flex-1",
                        item.color === 'green' && "text-success",
                        item.color === 'yellow' && "text-warning",
                        item.color === 'gray' && "text-muted-foreground"
                      )}>
                        {item.text}
                      </span>
                      {item.status === 'progress' && (
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-warning w-3/5 transition-all duration-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-sm text-primary font-medium mb-2 flex items-center gap-2">
                    <span>💡</span>
                    Metodologia GTD
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    "Sua mente é para ter ideias, não para guardá-las." Capture tudo no sistema e processe regularmente para manter a mente clara e focada.
                  </div>
                </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}