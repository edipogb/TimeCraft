import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Tarefa, TarefaFormData } from '@/types/app'

interface TasksState {
  tasks: Tarefa[]
  loading: boolean
  createTask: (data: TarefaFormData) => Promise<Tarefa>
  createTaskFromNote: (
    noteId: string,
    data: Partial<TarefaFormData>
  ) => Promise<Tarefa>
  fetchTasks: () => Promise<void>
  updateTask: (id: string, data: Partial<TarefaFormData>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTasksStore = create<TasksState>(set => ({
  tasks: [],
  loading: false,

  createTask: async (data: TarefaFormData) => {
    // Verificar se usu�rio est� autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Erro ao verificar usu�rio:', authError)
      throw new Error('Erro de autentica��o: ' + authError.message)
    }

    if (!user) {
      throw new Error('Usu�rio n�o autenticado')
    }

    const { data: task, error } = await supabase
      .from('tarefas')
      .insert([
        {
          titulo: data.titulo,
          descricao: data.descricao,
          prioridade: data.prioridade,
          status: 'a_fazer',
          projeto: data.projeto,
          data_vencimento: data.data_vencimento,
          minutos_estimados: data.minutos_estimados,
          meta_id: data.meta_id,
          usuario_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar tarefa:', error)
      throw error
    }

    set(state => ({
      tasks: [task, ...state.tasks],
    }))

    return task
  },

  createTaskFromNote: async (noteId: string, data: Partial<TarefaFormData>) => {
    // Verificar se usu�rio est� autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('Usu�rio n�o autenticado')
    }

    // Buscar nota original
    const { data: note, error: noteError } = await supabase
      .from('notas')
      .select('*')
      .eq('id', noteId)
      .single()

    if (noteError) {
      throw new Error('Nota n�o encontrada')
    }

    // Criar tarefa
    const { data: task, error } = await supabase
      .from('tarefas')
      .insert([
        {
          titulo: data.titulo || note.titulo || note.conteudo.substring(0, 50),
          descricao: data.descricao || note.conteudo,
          prioridade: data.prioridade || 'media',
          status: 'a_fazer',
          projeto: data.projeto,
          data_vencimento: data.data_vencimento,
          minutos_estimados: data.minutos_estimados,
          meta_id: data.meta_id,
          nota_id: noteId,
          usuario_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar tarefa da nota:', error)
      throw error
    }

    // Marcar nota como processada
    console.log('Tentando marcar nota como processada:', noteId)
    const { error: updateError } = await supabase
      .from('notas')
      .update({
        tipo: 'referencia', // Mudando para 'referencia' que é permitido pelo schema
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', noteId)

    if (updateError) {
      console.error('Erro ao marcar nota como processada:', updateError)
      console.error(
        'Detalhes completos do erro:',
        JSON.stringify(updateError, null, 2)
      )
      // Não throw aqui para não impedir a criação da tarefa
    } else {
      console.log('Nota marcada como processada com sucesso')
    }

    set(state => ({
      tasks: [task, ...state.tasks],
    }))

    return task
  },

  fetchTasks: async () => {
    set({ loading: true })

    const { data: tasks, error } = await supabase
      .from('tarefas')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) {
      console.error('Erro ao buscar tarefas:', error)
      throw error
    }

    set({ tasks: tasks || [], loading: false })
  },

  updateTask: async (id: string, data: Partial<TarefaFormData>) => {
    const { error } = await supabase
      .from('tarefas')
      .update({
        ...data,
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar tarefa:', error)
      throw error
    }

    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...data } : task
      ),
    }))
  },

  deleteTask: async (id: string) => {
    const { error } = await supabase.from('tarefas').delete().eq('id', id)

    if (error) {
      console.error('Erro ao deletar tarefa:', error)
      throw error
    }

    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id),
    }))
  },
}))
