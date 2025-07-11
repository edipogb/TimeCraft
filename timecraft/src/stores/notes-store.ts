import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Nota, NotaFormData } from '@/types/app'

interface NotesState {
  notes: Nota[]
  loading: boolean
  createNote: (data: NotaFormData) => Promise<Nota>
  fetchNotes: () => Promise<void>
  updateNote: (id: string, data: Partial<NotaFormData>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  loading: false,

  createNote: async (data: NotaFormData) => {
    // Verificar se usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Erro ao verificar usuário:', authError)
      throw new Error('Erro de autenticação: ' + authError.message)
    }
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    console.log('Usuário autenticado:', user.id)

    const { data: note, error } = await supabase
      .from('notas')
      .insert([{
        titulo: data.titulo,
        conteudo: data.conteudo,
        tipo: data.tipo,
        categoria_para: data.categoria_para,
        tags: data.tags,
        usuario_id: user.id, // Adicionar usuario_id necessário
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao inserir nota:', error)
      throw error
    }

    set((state) => ({
      notes: [note, ...state.notes],
    }))

    return note
  },

  fetchNotes: async () => {
    set({ loading: true })
    
    const { data: notes, error } = await supabase
      .from('notas')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) throw error

    set({ notes: notes || [], loading: false })
  },

  updateNote: async (id: string, data: Partial<NotaFormData>) => {
    console.log('updateNote chamado:', id, data)
    const { error } = await supabase
      .from('notas')
      .update({
        ...data,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar nota:', error)
      console.error('Detalhes completos do erro:', JSON.stringify(error, null, 2))
      throw error
    }

    console.log('Nota atualizada com sucesso no banco')

    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, ...data } : note
      )
      console.log('Estado atualizado:', {
        noteId: id,
        oldNote: state.notes.find(n => n.id === id),
        newData: data,
        updatedNote: updatedNotes.find(n => n.id === id)
      })
      return { notes: updatedNotes }
    })

    console.log('Estado local atualizado')
  },

  deleteNote: async (id: string) => {
    const { error } = await supabase
      .from('notas')
      .delete()
      .eq('id', id)

    if (error) throw error

    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }))
  },
}))