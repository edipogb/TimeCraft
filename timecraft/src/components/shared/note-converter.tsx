import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectItem } from '@/components/ui/select'
import { useTasksStore } from '@/stores/tasks-store'
import { useGoalsStore } from '@/stores/goals-store'
import { useNotesStore } from '@/stores/notes-store'
import { supabase } from '@/lib/supabase'
import type { Nota, PrioridadeTarefa, TipoMeta } from '@/types/app'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface NoteConverterProps {
  note: Nota
  onConverted: () => void
  onCancel: () => void
  preselectedType?: 'tarefa' | 'meta'
}

export function NoteConverter({
  note,
  onConverted,
  onCancel,
  preselectedType = 'tarefa',
}: NoteConverterProps) {
  const [converting, setConverting] = useState(false)
  const [targetType, setTargetType] = useState<'tarefa' | 'meta'>(
    preselectedType
  )
  const [titulo, setTitulo] = useState(
    note.titulo || note.conteudo.substring(0, 50)
  )
  const [descricao, setDescricao] = useState(note.conteudo)
  const [prioridade, setPrioridade] = useState<PrioridadeTarefa>('media')
  const [tipoMeta, setTipoMeta] = useState<TipoMeta>('resultado')

  const { createTaskFromNote } = useTasksStore()
  const { createGoalFromNote } = useGoalsStore()
  const { updateNote } = useNotesStore()

  const handleConvert = async () => {
    try {
      setConverting(true)
      console.log('Iniciando conversão:', {
        noteId: note.id,
        targetType,
        titulo,
        descricao,
      })

      if (targetType === 'tarefa') {
        console.log('Criando tarefa da nota...')
        await createTaskFromNote(note.id, {
          titulo,
          descricao,
          prioridade,
        })
        console.log('Tarefa criada, nota deve estar marcada como processada')

        toast.success('Nota convertida em tarefa com sucesso!')
      } else if (targetType === 'meta') {
        console.log('Criando meta da nota...')
        await createGoalFromNote(note.id, {
          titulo,
          descricao,
          tipo: tipoMeta,
        })
        console.log('Meta criada, nota deve estar marcada como processada')

        toast.success('Nota convertida em meta com sucesso!')
      }

      // Verificar se a nota foi realmente atualizada
      console.log('Verificando se a nota foi processada...')
      const { data: updatedNote } = await supabase
        .from('notas')
        .select('tipo')
        .eq('id', note.id)
        .single()

      console.log('Tipo da nota após conversão:', updatedNote?.tipo)

      // Se a nota ainda não foi marcada como processada, forçar atualização
      if (updatedNote?.tipo !== 'referencia') {
        console.log(
          'Nota não foi marcada como processada, forçando atualização...'
        )
        await updateNote(note.id, { tipo: 'referencia' })
        console.log('Atualização forçada concluída')
      }

      onConverted()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao converter nota:', error)
      console.error('Detalhes do erro:', {
        message: errorMessage,
        noteId: note.id,
        targetType,
        titulo,
        descricao,
      })

      // Mensagens de erro mais específicas
      if (errorMessage.includes('não autenticado')) {
        toast.error('Você precisa estar logado para converter notas')
      } else if (errorMessage.includes('não encontrada')) {
        toast.error('Nota não encontrada. Tente atualizar a página')
      } else if (errorMessage.includes('403')) {
        toast.error('Permissão negada. Verifique sua autenticação')
      } else {
        toast.error('Erro ao converter nota: ' + errorMessage)
      }
    } finally {
      setConverting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="mx-auto w-full max-w-3xl"
    >
      <Card className="bg-card/90 border-border overflow-hidden border shadow-2xl backdrop-blur-xl">
        {/* Header com gradiente */}
        <CardHeader className="bg-primary text-primary-foreground">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-3xl"
              >
                🔄
              </motion.span>
              Converter Nota
            </CardTitle>
            <p className="text-primary-foreground/80 mt-2 text-lg">
              Transformar esta nota em uma tarefa ou meta usando GTD
            </p>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {/* Tipo de conversão */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-foreground mb-3 block text-sm font-semibold">
              Converter para:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTargetType('tarefa')}
                className={cn(
                  'rounded-xl border-2 p-4 text-left transition-all duration-200',
                  targetType === 'tarefa'
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="text-card-foreground font-semibold">
                      Tarefa
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Ação específica para completar
                    </div>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTargetType('meta')}
                className={cn(
                  'rounded-xl border-2 p-4 text-left transition-all duration-200',
                  targetType === 'meta'
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-card-foreground font-semibold">
                      Meta
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Resultado que você quer alcançar
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Campos de entrada */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-foreground block text-sm font-semibold">
                Título:
              </label>
              <Input
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Título da tarefa/meta"
                disabled={converting}
                className="bg-card/70 border-border focus:border-primary focus:bg-card backdrop-blur-sm transition-all duration-200"
              />
            </motion.div>

            {targetType === 'tarefa' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="text-foreground block text-sm font-semibold">
                  Prioridade:
                </label>
                <Select
                  value={prioridade}
                  onChange={e =>
                    setPrioridade(e.target.value as PrioridadeTarefa)
                  }
                  className="bg-card/70 backdrop-blur-sm"
                >
                  <SelectItem value="baixa">🟢 Baixa</SelectItem>
                  <SelectItem value="media">🟡 Média</SelectItem>
                  <SelectItem value="alta">🔴 Alta</SelectItem>
                </Select>
              </motion.div>
            )}

            {targetType === 'meta' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="text-foreground block text-sm font-semibold">
                  Tipo da Meta:
                </label>
                <Select
                  value={tipoMeta}
                  onChange={e => setTipoMeta(e.target.value as TipoMeta)}
                  className="bg-card/70 backdrop-blur-sm"
                >
                  <SelectItem value="resultado">🎯 Resultado</SelectItem>
                  <SelectItem value="processo">⚡ Processo</SelectItem>
                  <SelectItem value="aprendizado">📚 Aprendizado</SelectItem>
                </Select>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <label className="text-foreground block text-sm font-semibold">
              Descrição:
            </label>
            <Textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              rows={4}
              placeholder="Descrição detalhada"
              disabled={converting}
              className="bg-card/70 border-border focus:border-primary focus:bg-card resize-none backdrop-blur-sm transition-all duration-200"
            />
          </motion.div>

          {/* Nota original */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-muted/30 border-border rounded-xl border p-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary h-16 w-1 rounded-full"></div>
              <div className="flex-1">
                <p className="text-foreground mb-2 text-sm font-medium">
                  📝 Nota original:
                </p>
                <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                  "{note.conteudo.substring(0, 150)}
                  {note.conteudo.length > 150 ? '...' : ''}"
                </p>
                <div className="text-muted-foreground/70 flex items-center gap-4 text-xs">
                  <span>
                    📅 {new Date(note.criado_em).toLocaleDateString('pt-BR')}
                  </span>
                  <span>
                    🕒{' '}
                    {new Date(note.criado_em).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {note.tags.length > 0 && (
                    <span>🏷️ {note.tags.join(', ')}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Botões de ação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 pt-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={handleConvert}
                disabled={converting}
                className={cn(
                  'group relative w-full overflow-hidden py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl',
                  'bg-primary hover:bg-primary/90 text-primary-foreground'
                )}
              >
                {converting && (
                  <div className="bg-primary-foreground/10 absolute inset-0 flex items-center justify-center">
                    <div className="border-primary-foreground h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                  </div>
                )}

                <div className="from-primary-foreground/0 via-primary-foreground/25 to-primary-foreground/0 absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative flex items-center justify-center gap-3">
                  {!converting && (
                    <span className="text-2xl">
                      {targetType === 'tarefa' ? '✅' : '🎯'}
                    </span>
                  )}
                  {converting
                    ? 'Convertendo...'
                    : `Criar ${targetType === 'tarefa' ? 'Tarefa' : 'Meta'}`}
                </span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={converting}
                className="bg-card/70 border-border hover:bg-card px-8 py-4 text-lg backdrop-blur-sm transition-all duration-200"
              >
                Cancelar
              </Button>
            </motion.div>
          </motion.div>

          {/* Dica GTD */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-primary/5 border-primary/20 rounded-xl border p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <div className="text-primary mb-1 text-sm font-medium">
                  Metodologia GTD
                </div>
                <div className="text-primary/80 text-xs leading-relaxed">
                  {targetType === 'tarefa'
                    ? 'Uma tarefa é uma ação específica que você pode completar. Seja claro sobre o que precisa ser feito.'
                    : 'Uma meta é um resultado que você quer alcançar. Defina claramente o que constitui o sucesso.'}
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
