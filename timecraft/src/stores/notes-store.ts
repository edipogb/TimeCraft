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

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,

  createNote: async (data: NotaFormData) => {
    const { data: note, error } = await supabase
      .from('notas')
      .insert([{
        titulo: data.titulo,
        conteudo: data.conteudo,
        tipo: data.tipo,
        categoria_para: data.categoria_para,
        tags: data.tags,
      }])
      .select()
      .single()

    if (error) throw error

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
    const { error } = await supabase
      .from('notas')
      .update(data)
      .eq('id', id)

    if (error) throw error

    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...data } : note
      ),
    }))
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