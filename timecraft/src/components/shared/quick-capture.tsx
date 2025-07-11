import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotesStore } from '@/stores/notes-store'
import { QUICK_CAPTURE_SHORTCUTS } from '@/lib/constants'
import { MESSAGES } from '@/lib/messages'

const quickCaptureSchema = z.object({
  conteudo: z.string().min(1, MESSAGES.capture.error_content_required),
  titulo: z.string().optional(),
})

type QuickCaptureData = z.infer<typeof quickCaptureSchema>

export function QuickCapture() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const { createNote } = useNotesStore()

  const form = useForm<QuickCaptureData>({
    resolver: zodResolver(quickCaptureSchema),
    defaultValues: {
      conteudo: '',
      titulo: '',
    },
  })

  const detectContentType = (content: string) => {
    const lowerContent = content.toLowerCase()
    
    const taskKeywords = QUICK_CAPTURE_SHORTCUTS.task
    if (taskKeywords.some(keyword => lowerContent.includes(keyword))) {
      return 'projeto' as const
    }
    
    const goalKeywords = QUICK_CAPTURE_SHORTCUTS.goal
    if (goalKeywords.some(keyword => lowerContent.includes(keyword))) {
      return 'projeto' as const
    }
    
    return 'rapida' as const
  }

  const onSubmit = async (data: QuickCaptureData) => {
    try {
      setLoading(true)
      
      const tipo = detectContentType(data.conteudo)
      
      await createNote({
        titulo: data.titulo || undefined,
        conteudo: data.conteudo,
        tipo,
        tags: [],
      })

      form.reset()
      setIsExpanded(false)
      
      toast.success(MESSAGES.capture.success)
    } catch (error: unknown) {
      console.error('Erro ao capturar nota:', error instanceof Error ? error.message : 'Unknown error')
      toast.error(MESSAGES.capture.error_generic)
    } finally {
      setLoading(false)
    }
  }

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
        >
          
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Captura Rápida
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Input
              {...form.register('titulo')}
              placeholder={MESSAGES.capture.placeholder_title}
              disabled={loading}
            />
            
            <Textarea
              {...form.register('conteudo')}
              placeholder={MESSAGES.capture.placeholder_content}
              rows={3}
              disabled={loading}
            />
            
            {form.formState.errors.conteudo && (
              <p className="text-sm text-red-500">
                {form.formState.errors.conteudo.message}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? MESSAGES.capture.loading : MESSAGES.capture.button_capture}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
                disabled={loading}
              >
                {MESSAGES.capture.button_cancel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}