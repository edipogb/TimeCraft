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
import { generateTitle, extractTags, generateMetadata, processTemplateCommand } from '@/lib/gtd-helpers'
import { MESSAGES } from '@/lib/messages'

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
          description: 'Disponível para conversão durante o review'
        })
      } else {
        toast.success(MESSAGES.capture.success, {
          description: 'Adicionado ao seu inbox GTD'
        })
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Erro ao capturar:', errorMessage)
      
      // Traduzir mensagens de erro específicas
      if (errorMessage.includes('Usuário não autenticado')) {
        toast.error('Você precisa estar logado para capturar notas')
      } else if (errorMessage.includes('auth') || errorMessage.includes('403')) {
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
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'tarefa': return '✅'
      case 'meta': return '🎯'
      case 'habito': return '🔄'
      case 'nota': return '📝'
      default: return '📝'
    }
  }

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full h-16 w-16 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl">⚡</span>
            <span className="text-xs font-medium">Captura</span>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Captura Rápida</span>
              {suggestion.confidence !== 'none' && (
                <Badge variant={getBadgeVariant(suggestion.confidence)} className="text-xs">
                  {getBadgeIcon(suggestion.type)} {suggestion.type}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              ✕
            </Button>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Capture qualquer coisa. Use comandos: /tarefa, /meta, /habito, /lembrete
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...form.register('titulo')}
              placeholder={MESSAGES.capture.placeholder_title}
              disabled={loading}
              className="bg-white/50 border-gray-200 focus:border-blue-400"
            />
            
            <div className="space-y-2">
              <Textarea
                {...form.register('conteudo')}
                placeholder={MESSAGES.capture.placeholder_content}
                rows={3}
                disabled={loading}
                onChange={(e) => {
                  form.setValue('conteudo', e.target.value)
                  handleTemplateCommand(e.target.value)
                }}
                className="bg-white/50 border-gray-200 focus:border-blue-400 resize-none"
              />
              
              {templateHint && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  💡 Template: {templateHint}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Input
                {...form.register('contexto')}
                placeholder="Contexto (@casa, @trabalho, @telefone)"
                disabled={loading}
                className="bg-white/50 border-gray-200 focus:border-blue-400 flex-1"
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
              <div className={`border rounded-lg p-3 ${
                suggestion.confidence === 'high' 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 text-sm">
                  <span>{suggestion.confidence === 'high' ? '🎯' : '💡'}</span>
                  <span className={suggestion.confidence === 'high' ? 'text-blue-800' : 'text-gray-700'}>
                    Parece ser uma <strong>{suggestion.type}</strong>
                    {suggestion.confidence === 'high' && ' - sugestão de alta confiança'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{suggestion.reason}</p>
              </div>
            )}

            {form.formState.errors.conteudo && (
              <p className="text-sm text-red-500">
                {form.formState.errors.conteudo.message}
              </p>
            )}

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? MESSAGES.capture.loading : `⚡ ${MESSAGES.capture.button_capture}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
                disabled={loading}
                className="border-gray-200 hover:bg-gray-50"
              >
                {MESSAGES.capture.button_cancel}
              </Button>
            </div>
          </form>
          
          <div className="text-xs text-gray-500 border-t pt-3 space-y-1">
            <div className="flex items-center gap-2">
              <span>📥</span>
              <span><strong>GTD:</strong> Tudo vai para seu inbox primeiro</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🗂️</span>
              <span><strong>PARA:</strong> Organize durante o weekly review</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span><strong>Energia:</strong> Detectada automaticamente para GTD</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}