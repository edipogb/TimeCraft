import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MagicCard } from '@/components/ui/magic-card'
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
    <div className="bg-background min-h-screen">
      {/* Header da página */}
      <div className="border-border border-b px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            TimeCraft Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Bem-vindo ao seu hub de produtividade pessoal
          </p>
        </div>
      </div>

      <div className="space-y-8 px-4 py-8 sm:px-6">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MagicCard className="from-card to-primary/5 border-border border bg-gradient-to-br shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="from-primary to-primary/80 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
                  <span className="text-primary-foreground text-lg">📝</span>
                </div>
                <span className="text-foreground">Notas de Hoje</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-primary mb-2 text-3xl font-bold">
                {todaysNotes.length}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                {todaysNotes.length === 1
                  ? 'nota capturada hoje'
                  : 'notas capturadas hoje'}
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-muted h-3 flex-1 rounded-full">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((todaysNotes.length / 10) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-primary text-xs font-semibold">
                  {Math.round((todaysNotes.length / 10) * 100)}%
                </span>
              </div>
            </CardContent>
          </MagicCard>

          <MagicCard
            className={cn(
              'border-border border shadow-md',
              unprocessedNotes.length > 0
                ? 'from-card to-warning/5 bg-gradient-to-br'
                : 'from-card to-success/5 bg-gradient-to-br'
            )}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl shadow-lg',
                    unprocessedNotes.length > 0
                      ? 'from-warning to-warning/80 bg-gradient-to-br'
                      : 'from-success to-success/80 bg-gradient-to-br'
                  )}
                >
                  <span className="text-lg text-white">
                    {unprocessedNotes.length > 0 ? '📥' : '✅'}
                  </span>
                </div>
                <span className="text-foreground">Inbox GTD</span>
                {unprocessedNotes.length > 0 && (
                  <span className="bg-warning text-warning-foreground ml-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-md">
                    {unprocessedNotes.length > 99
                      ? '99+'
                      : unprocessedNotes.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'mb-2 text-3xl font-bold',
                  unprocessedNotes.length > 0 ? 'text-warning' : 'text-success'
                )}
              >
                {unprocessedNotes.length}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                {unprocessedNotes.length === 1
                  ? 'nota para processar'
                  : 'notas para processar'}
              </p>
              {unprocessedNotes.length > 0 && (
                <button className="bg-warning hover:bg-warning/90 text-warning-foreground w-full rounded-lg px-3 py-2 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg">
                  Processar agora
                </button>
              )}
              {unprocessedNotes.length === 0 && (
                <div className="bg-success/10 text-success border-success/20 rounded-lg border px-3 py-2 text-center text-sm font-medium">
                  🎉 Inbox limpo!
                </div>
              )}
            </CardContent>
          </MagicCard>

          <MagicCard className="from-card to-info/5 border-border border bg-gradient-to-br shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="from-info to-info/80 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
                  <span className="text-info-foreground text-lg">📊</span>
                </div>
                <span className="text-foreground">Total de Notas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-info mb-2 text-3xl font-bold">
                {notes.length}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                {notes.length === 1
                  ? 'nota total no sistema'
                  : 'notas totais no sistema'}
              </p>
              <div className="space-y-2">
                <div className="text-info text-xs font-medium">
                  Crescimento mensal
                </div>
                <div className="bg-muted h-3 rounded-full">
                  <div className="bg-info h-3 w-3/4 rounded-full transition-all duration-500" />
                </div>
                <div className="text-info flex justify-between text-xs">
                  <span>+75%</span>
                  <span>Meta: 100 notas</span>
                </div>
              </div>
            </CardContent>
          </MagicCard>
        </div>

        {/* Seção principal com notas recentes e próximos passos */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="from-card to-primary/3 border-border border bg-gradient-to-br shadow-md transition-all duration-200 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <div className="from-primary to-primary/80 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
                  <span className="text-primary-foreground text-lg">📋</span>
                </div>
                <span className="text-foreground">Notas Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="border-muted border-t-primary h-8 w-8 animate-spin rounded-full border-4"></div>
                  <span className="text-muted-foreground ml-3">
                    Carregando...
                  </span>
                </div>
              ) : notes.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mb-4 text-4xl sm:text-6xl">📝</div>
                  <div className="text-foreground mb-2 font-medium">
                    Nenhuma nota ainda
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Use o Quick Capture para começar!
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.slice(0, 5).map(note => (
                    <div
                      key={note.id}
                      className="bg-secondary border-border hover:bg-accent rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-primary h-12 w-1 flex-shrink-0 rounded-full"></div>
                        <div className="min-w-0 flex-1">
                          <div className="text-foreground mb-1 truncate text-sm font-semibold">
                            {note.titulo || 'Sem título'}
                          </div>
                          <div className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                            {note.conteudo}
                          </div>
                          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
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
                            {note.tipo !== 'rapida' && (
                              <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-1 text-xs font-medium">
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

          <Card className="from-card to-success/3 border-border border bg-gradient-to-br shadow-md transition-all duration-200 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <div className="from-success to-success/80 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
                  <span className="text-success-foreground text-lg">🚀</span>
                </div>
                <span className="text-foreground">Próximos Passos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    icon: '✅',
                    text: 'Sistema de autenticação',
                    status: 'completed',
                    color: 'green',
                  },
                  {
                    icon: '✅',
                    text: 'Quick Capture funcionando',
                    status: 'completed',
                    color: 'green',
                  },
                  {
                    icon: '✅',
                    text: 'Migração para Magic UI',
                    status: 'completed',
                    color: 'green',
                  },
                  {
                    icon: '⏳',
                    text: 'Implementar gestão de tarefas',
                    status: 'progress',
                    color: 'yellow',
                  },
                  {
                    icon: '⭕',
                    text: 'Sistema de metas',
                    status: 'pending',
                    color: 'gray',
                  },
                  {
                    icon: '⭕',
                    text: 'Tracking de hábitos',
                    status: 'pending',
                    color: 'gray',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-4 rounded-xl border p-3 transition-all duration-200 hover:shadow-sm',
                      item.color === 'green' &&
                        'bg-success/5 border-success/20',
                      item.color === 'yellow' &&
                        'bg-warning/5 border-warning/20',
                      item.color === 'gray' && 'bg-muted border-border'
                    )}
                  >
                    <span className="flex-shrink-0 text-lg">{item.icon}</span>
                    <span
                      className={cn(
                        'flex-1 text-sm font-semibold',
                        item.color === 'green' && 'text-success',
                        item.color === 'yellow' && 'text-warning',
                        item.color === 'gray' && 'text-muted-foreground'
                      )}
                    >
                      {item.text}
                    </span>
                    {item.status === 'progress' && (
                      <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
                        <div className="bg-warning h-full w-3/5 transition-all duration-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 border-primary/20 mt-6 rounded-xl border p-4">
                <div className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold">
                  <span>💡</span>
                  Metodologia GTD
                </div>
                <div className="text-muted-foreground text-sm leading-relaxed">
                  "Sua mente é para ter ideias, não para guardá-las." Capture
                  tudo no sistema e processe regularmente para manter a mente
                  clara e focada.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
