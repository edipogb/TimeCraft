import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotesStore } from '@/stores/notes-store'
import { useAuthStore } from '@/stores/auth-store'
import { useQuickCaptureDetection } from '@/hooks/use-quick-capture-detection'
import {
  generateTitle,
  extractTags,
  generateMetadata,
  processTemplateCommand,
} from '@/lib/gtd-helpers'
import { MESSAGES } from '@/lib/messages'
import { BlurFade } from '@/components/magicui/blur-fade'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'

// AIDEV-NOTE: Quick Capture Enhanced - implementação completa GTD + PARA com detecção inteligente
const quickCaptureSchema = z.object({
  conteudo: z.string().min(1, MESSAGES.capture.error_content_required),
  titulo: z.string().optional(),
  contexto: z.string().optional(),
  urgente: z.boolean().default(false),
})

type QuickCaptureData = z.infer<typeof quickCaptureSchema>

export function QuickCaptureEnhanced() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const { createNote } = useNotesStore()
  const { user } = useAuthStore()
  const { getSuggestion, getTemplateHint } = useQuickCaptureDetection()

  const form = useForm<QuickCaptureData>({
    resolver: zodResolver(quickCaptureSchema),
    defaultValues: {
      conteudo: '',
      titulo: '',
      contexto: '',
      urgente: false,
    },
  })

  const watchedContent = form.watch('conteudo')
  const suggestion = getSuggestion(watchedContent)
  const templateHint = getTemplateHint(watchedContent)

  const handleTemplateCommand = (content: string) => {
    const processed = processTemplateCommand(content)
    if (processed !== content) {
      form.setValue('conteudo', processed)
    }
  }

  const onSubmit = async (data: QuickCaptureData) => {
    try {
      setLoading(true)

      // Verificar se usuário está autenticado
      if (!user) {
        toast.error('Você precisa estar logado para capturar notas')
        return
      }

      // Processar template commands
      const processedContent = processTemplateCommand(data.conteudo)

      // GTD: Tudo vai para inbox primeiro (tipo: 'rapida')
      const noteData = {
        titulo: data.titulo || generateTitle(processedContent),
        conteudo: processedContent,
        tipo: 'rapida' as const, // GTD Inbox
        tags: extractTags(processedContent, data.contexto),
        categoria_para: undefined, // Será definida durante weekly review
      }

      await createNote(noteData)

      // Metadata adicional para processamento GTD
      generateMetadata(processedContent, data.contexto)

      form.reset()
      setIsExpanded(false)

      // Toast baseado na confiança da sugestão
      if (suggestion.confidence === 'high') {
        toast.success(`Capturado! Sugerido como ${suggestion.type}`, {
          description: 'Disponível para conversão durante o review',
        })
      } else {
        toast.success(MESSAGES.capture.success, {
          description: 'Adicionado ao seu inbox GTD',
        })
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      console.error('Erro ao capturar:', errorMessage)

      // Traduzir mensagens de erro específicas
      if (errorMessage.includes('Usuário não autenticado')) {
        toast.error('Você precisa estar logado para capturar notas')
      } else if (
        errorMessage.includes('auth') ||
        errorMessage.includes('403')
      ) {
        toast.error('Erro de autenticação. Tente fazer login novamente')
      } else if (errorMessage.includes('JWT')) {
        toast.error('Sessão expirada. Faça login novamente')
      } else {
        toast.error(MESSAGES.capture.error_generic)
        console.error('Erro detalhado:', errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const getBadgeVariant = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'tarefa':
        return '✅'
      case 'meta':
        return '🎯'
      case 'habito':
        return '🔄'
      case 'nota':
        return '📝'
      default:
        return '📝'
    }
  }

  if (!isExpanded) {
    return (
      <BlurFade delay={0.1} className="fixed right-6 bottom-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="btn-gradient h-14 w-14 rounded-full shadow-2xl hover:shadow-2xl hover:-translate-y-1 hover:scale-110 transition-all duration-300 border-0 text-white text-xl"
        >
          <div className="flex flex-col items-center">
            <span className="text-xl">⚡</span>
          </div>
        </Button>
      </BlurFade>
    )
  }

  return (
    <BlurFade delay={0.1} className="fixed right-6 bottom-6 z-50 w-96">
      <Card className="glass-panel border-0 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span>Captura Rápida</span>
              {suggestion.confidence !== 'none' && (
                <Badge
                  variant={getBadgeVariant(suggestion.confidence)}
                  className="text-xs"
                >
                  {getBadgeIcon(suggestion.type)} {suggestion.type}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="hover:bg-muted h-8 w-8 p-0"
            >
              ✕
            </Button>
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Capture qualquer coisa. Use comandos: /tarefa, /meta, /habito,
            /lembrete
          </p>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 rounded-b-2xl overflow-hidden">
            <AnimatedGridPattern
              numSquares={30}
              maxOpacity={0.1}
              duration={3}
              className="text-primary"
            />
          </div>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-10">
            <Input
              {...form.register('titulo')}
              placeholder={MESSAGES.capture.placeholder_title}
              disabled={loading}
              className="h-10"
            />

            <div className="space-y-2">
              <Textarea
                {...form.register('conteudo')}
                placeholder={MESSAGES.capture.placeholder_content}
                rows={3}
                disabled={loading}
                onChange={e => {
                  form.setValue('conteudo', e.target.value)
                  handleTemplateCommand(e.target.value)
                }}
                className="resize-none"
              />

              {templateHint && (
                <div className="text-muted-foreground bg-muted/50 rounded p-2 text-xs">
                  💡 Template: {templateHint}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Input
                {...form.register('contexto')}
                placeholder="Contexto (@casa, @trabalho, @telefone)"
                disabled={loading}
                className="h-10 flex-1"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...form.register('urgente')}
                  disabled={loading}
                  className="rounded border-gray-300"
                />
                <span className="text-red-500">🔥</span>
                <span>Urgente</span>
              </label>
            </div>

            {suggestion.confidence !== 'none' && (
              <div
                className={`rounded-lg border p-3 ${
                  suggestion.confidence === 'high'
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span>{suggestion.confidence === 'high' ? '🎯' : '💡'}</span>
                  <span
                    className={
                      suggestion.confidence === 'high'
                        ? 'text-primary'
                        : 'text-foreground'
                    }
                  >
                    Parece ser uma <strong>{suggestion.type}</strong>
                    {suggestion.confidence === 'high' &&
                      ' - sugestão de alta confiança'}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {suggestion.reason}
                </p>
              </div>
            )}

            {form.formState.errors.conteudo && (
              <p className="text-destructive text-sm">
                {form.formState.errors.conteudo.message}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="h-10 flex-1">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {MESSAGES.capture.loading}
                  </div>
                ) : (
                  `⚡ ${MESSAGES.capture.button_capture}`
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
                disabled={loading}
                className="h-10"
              >
                {MESSAGES.capture.button_cancel}
              </Button>
            </div>
          </form>

          <div className="text-muted-foreground bg-muted/30 border-primary/20 rounded border-l-4 p-3 text-xs">
            <div className="text-foreground mb-1 font-medium">
              💡 Dicas GTD & PARA:
            </div>
            <div className="space-y-1">
              <div>
                • <strong>/tarefa</strong> - Cria uma tarefa acionável
              </div>
              <div>
                • <strong>/meta</strong> - Define um objetivo de longo prazo
              </div>
              <div>
                • <strong>/habito</strong> - Estabelece uma rotina
              </div>
              <div>
                • <strong>/lembrete</strong> - Agenda um lembrete
              </div>
              <div>
                • Use <strong>@contexto</strong> para organizar por
                local/situação
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </BlurFade>
  )
}
