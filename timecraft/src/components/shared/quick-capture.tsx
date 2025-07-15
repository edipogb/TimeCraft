import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotesStore } from '@/stores/notes-store'
import { QUICK_CAPTURE_SHORTCUTS } from '@/lib/constants'
import { MESSAGES } from '@/lib/messages'
import { cn } from '@/lib/utils'

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
      console.error(
        'Erro ao capturar nota:',
        error instanceof Error ? error.message : 'Unknown error'
      )
      toast.error(MESSAGES.capture.error_generic)
    } finally {
      setLoading(false)
    }
  }

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="fixed right-6 bottom-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={() => setIsExpanded(true)}
            size="lg"
            className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary group relative h-16 w-16 overflow-hidden rounded-full border-0 bg-gradient-to-br shadow-2xl transition-all duration-300 hover:shadow-2xl"
          >
            {/* Efeito de brilho */}
            <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />

            {/* Ícone */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="relative z-10"
            >
              <span className="text-2xl">⚡</span>
            </motion.div>
          </Button>

          {/* Pulse animado */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-primary/60 absolute inset-0 -z-10 rounded-full"
          />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="fixed right-6 bottom-6 z-50 w-96"
    >
      <Card className="bg-card border-border overflow-hidden border shadow-2xl backdrop-blur-xl">
        {/* Header com gradiente */}
        <CardHeader className="bg-primary text-primary-foreground pb-4">
          <CardTitle className="flex items-center justify-between text-xl font-semibold">
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                ⚡
              </motion.span>
              Quick Capture
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </CardTitle>
          <p className="text-primary-foreground/80 mt-1 text-sm">
            Capture suas ideias instantaneamente
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo título */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                {...form.register('titulo')}
                placeholder={MESSAGES.capture.placeholder_title}
                disabled={loading}
                className="bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-200 focus:ring-2"
              />
            </motion.div>

            {/* Campo conteúdo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Textarea
                {...form.register('conteudo')}
                placeholder={MESSAGES.capture.placeholder_content}
                rows={4}
                disabled={loading}
                className="bg-background border-border focus:border-primary focus:ring-primary/20 resize-none transition-all duration-200 focus:ring-2"
              />
            </motion.div>

            {/* Erro de validação */}
            <AnimatePresence>
              {form.formState.errors.conteudo && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-destructive bg-destructive/10 border-destructive/20 flex items-center gap-2 rounded-lg border p-3 text-sm"
                >
                  <span>⚠️</span>
                  {form.formState.errors.conteudo.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dicas de uso */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-primary/5 border-primary/20 rounded-lg border p-3"
            >
              <div className="text-primary text-xs">
                <div className="mb-1 font-medium">💡 Dicas rápidas:</div>
                <div className="space-y-1">
                  <div>• Use "fazer", "completar" para tarefas automáticas</div>
                  <div>• Use "objetivo", "meta" para metas automáticas</div>
                  <div>• Sem palavras-chave = processamento manual</div>
                </div>
              </div>
            </motion.div>

            {/* Botões de ação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 pt-2"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'bg-primary hover:bg-primary/90 text-primary-foreground group relative w-full overflow-hidden py-3 font-semibold shadow-lg transition-all duration-200 hover:shadow-lg',
                    loading && 'cursor-not-allowed opacity-70'
                  )}
                >
                  {loading && (
                    <div className="bg-primary-foreground/10 absolute inset-0 flex items-center justify-center">
                      <div className="border-primary-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                    </div>
                  )}

                  <div className="from-primary-foreground/0 via-primary-foreground/25 to-primary-foreground/0 absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative flex items-center justify-center gap-2">
                    {!loading && <span>💾</span>}
                    {loading
                      ? MESSAGES.capture.loading
                      : MESSAGES.capture.button_capture}
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  disabled={loading}
                  className="bg-secondary hover:bg-accent border-border px-6 py-3 transition-all duration-200"
                >
                  {MESSAGES.capture.button_cancel}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
