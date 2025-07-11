import { useState } from 'react'
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

interface NoteConverterProps {
  note: Nota
  onConverted: () => void
  onCancel: () => void
  preselectedType?: 'tarefa' | 'meta'
}

export function NoteConverter({ note, onConverted, onCancel, preselectedType = 'tarefa' }: NoteConverterProps) {
  const [converting, setConverting] = useState(false)
  const [targetType, setTargetType] = useState<'tarefa' | 'meta'>(preselectedType)
  const [titulo, setTitulo] = useState(note.titulo || note.conteudo.substring(0, 50))
  const [descricao, setDescricao] = useState(note.conteudo)
  const [prioridade, setPrioridade] = useState<PrioridadeTarefa>('media')
  const [tipoMeta, setTipoMeta] = useState<TipoMeta>('resultado')

  const { createTaskFromNote } = useTasksStore()
  const { createGoalFromNote } = useGoalsStore()
  const { updateNote } = useNotesStore()

  const handleConvert = async () => {
    try {
      setConverting(true)
      console.log('Iniciando conversão:', { noteId: note.id, targetType, titulo, descricao })

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
        console.log('Nota não foi marcada como processada, forçando atualização...')
        await updateNote(note.id, { tipo: 'referencia' })
        console.log('Atualização forçada concluída')
      }
      
      onConverted()
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao converter nota:', error)
      console.error('Detalhes do erro:', {
        message: errorMessage,
        noteId: note.id,
        targetType,
        titulo,
        descricao
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
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔄 Converter Nota
        </CardTitle>
        <p className="text-sm text-gray-600">
          Transformar esta nota em uma tarefa ou meta
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Converter para:</label>
          <Select value={targetType} onChange={(e) => setTargetType(e.target.value as 'tarefa' | 'meta')}>
            <SelectItem value="tarefa">✅ Tarefa</SelectItem>
            <SelectItem value="meta">🎯 Meta</SelectItem>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Título:</label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título da tarefa/meta"
            disabled={converting}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Descrição:</label>
          <Textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            placeholder="Descrição detalhada"
            disabled={converting}
          />
        </div>

        {targetType === 'tarefa' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Prioridade:</label>
            <Select value={prioridade} onChange={(e) => setPrioridade(e.target.value as PrioridadeTarefa)}>
              <SelectItem value="baixa">🟢 Baixa</SelectItem>
              <SelectItem value="media">🟡 Média</SelectItem>
              <SelectItem value="alta">🔴 Alta</SelectItem>
            </Select>
          </div>
        )}

        {targetType === 'meta' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Tipo da Meta:</label>
            <Select value={tipoMeta} onChange={(e) => setTipoMeta(e.target.value as TipoMeta)}>
              <SelectItem value="resultado">🎯 Resultado</SelectItem>
              <SelectItem value="processo">⚡ Processo</SelectItem>
              <SelectItem value="aprendizado">📚 Aprendizado</SelectItem>
            </Select>
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Nota original:</strong> "{note.conteudo.substring(0, 100)}..."
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Capturada em: {new Date(note.criado_em).toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleConvert} disabled={converting} className="flex-1">
            {converting ? 'Convertendo...' : `Criar ${targetType === 'tarefa' ? 'Tarefa' : 'Meta'}`}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={converting}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}