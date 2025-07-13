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
      console.error('Erro ao capturar nota:', error instanceof Error ? error.message : 'Unknown error')
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
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={() => setIsExpanded(true)}
            size="lg"
            className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-2xl transition-all duration-300 border-0 group overflow-hidden relative"
          >
            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/25 to-primary-foreground/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            {/* Ícone */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative z-10"
            >
              <span className="text-2xl">💭</span>
            </motion.div>
          </Button>
          
          {/* Pulse animado */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary/60 -z-10"
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
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="fixed bottom-6 right-6 z-50 w-96"
    >
      <Card className="bg-card/90 backdrop-blur-xl shadow-2xl border border-border overflow-hidden">
        {/* Header com gradiente */}
        <CardHeader className="bg-primary text-primary-foreground pb-4">
          <CardTitle className="text-xl flex items-center justify-between font-semibold">
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
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1 rounded-full hover:bg-primary-foreground/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </CardTitle>
          <p className="text-primary-foreground/80 text-sm mt-1">
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
                className="bg-card/70 backdrop-blur-sm border-border focus:border-primary focus:bg-card/90 transition-all duration-200"
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
                className="bg-card/70 backdrop-blur-sm border-border focus:border-primary focus:bg-card/90 transition-all duration-200 resize-none"
              />
            </motion.div>
            
            {/* Erro de validação */}
            <AnimatePresence>
              {form.formState.errors.conteudo && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20"
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
              className="bg-primary/5 p-3 rounded-lg border border-primary/20"
            >
              <div className="text-xs text-primary">
                <div className="font-medium mb-1">💡 Dicas rápidas:</div>
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
                    "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-lg transition-all duration-200 relative overflow-hidden group",
                    loading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {loading && (
                    <div className="absolute inset-0 bg-primary-foreground/10 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/25 to-primary-foreground/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <span className="relative flex items-center justify-center gap-2">
                    {!loading && <span>💾</span>}
                    {loading ? MESSAGES.capture.loading : MESSAGES.capture.button_capture}
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
                  className="px-6 py-3 bg-card/70 backdrop-blur-sm border-border hover:bg-card/90 transition-all duration-200"
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