import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Meta, MetaFormData } from '@/types/app'

interface GoalsState {
  goals: Meta[]
  loading: boolean
  createGoal: (data: MetaFormData) => Promise<Meta>
  createGoalFromNote: (
    noteId: string,
    data: Partial<MetaFormData>
  ) => Promise<Meta>
  fetchGoals: () => Promise<void>
  updateGoal: (id: string, data: Partial<MetaFormData>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
}

export const useGoalsStore = create<GoalsState>(set => ({
  goals: [],
  loading: false,

  createGoal: async (data: MetaFormData) => {
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

    const { data: goal, error } = await supabase
      .from('metas')
      .insert([
        {
          titulo: data.titulo,
          descricao: data.descricao,
          tipo: data.tipo || 'resultado',
          status: 'ativa',
          progresso: data.progresso || 0,
          prazo: data.prazo,
          categoria: data.categoria,
          usuario_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar meta:', error)
      throw error
    }

    set(state => ({
      goals: [goal, ...state.goals],
    }))

    return goal
  },

  createGoalFromNote: async (noteId: string, data: Partial<MetaFormData>) => {
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

    // Criar meta
    const { data: goal, error } = await supabase
      .from('metas')
      .insert([
        {
          titulo: data.titulo || note.titulo || note.conteudo.substring(0, 50),
          descricao: data.descricao || note.conteudo,
          tipo: data.tipo || 'resultado',
          status: 'ativa',
          progresso: data.progresso || 0,
          prazo: data.prazo,
          categoria: data.categoria,
          usuario_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar meta da nota:', error)
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
      // Não throw aqui para não impedir a criação da meta
    } else {
      console.log('Nota marcada como processada com sucesso')
    }

    set(state => ({
      goals: [goal, ...state.goals],
    }))

    return goal
  },

  fetchGoals: async () => {
    set({ loading: true })

    const { data: goals, error } = await supabase
      .from('metas')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) {
      console.error('Erro ao buscar metas:', error)
      throw error
    }

    set({ goals: goals || [], loading: false })
  },

  updateGoal: async (id: string, data: Partial<MetaFormData>) => {
    const { error } = await supabase
      .from('metas')
      .update({
        ...data,
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar meta:', error)
      throw error
    }

    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === id ? { ...goal, ...data } : goal
      ),
    }))
  },

  deleteGoal: async (id: string) => {
    const { error } = await supabase.from('metas').delete().eq('id', id)

    if (error) {
      console.error('Erro ao deletar meta:', error)
      throw error
    }

    set(state => ({
      goals: state.goals.filter(goal => goal.id !== id),
    }))
  },
}))
