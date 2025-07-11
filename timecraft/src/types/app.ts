// Enums do banco
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta'
export type StatusTarefa = 'a_fazer' | 'fazendo' | 'concluida'
export type FrequenciaHabito = 'diaria' | 'semanal'
export type TipoMeta = 'resultado' | 'processo' | 'aprendizado'
export type StatusMeta = 'ativa' | 'pausada' | 'concluida' | 'cancelada'
export type TipoNota = 'rapida' | 'projeto' | 'referencia' | 'algum_dia' | 'processada'
export type CategoriaPara = 'projetos' | 'areas' | 'recursos' | 'arquivo'
export type TipoEntidadeVinculada = 'tarefa' | 'habito' | 'meta' | 'nota' | 'evento'

// Interfaces principais
export interface Usuario {
  id: string
  email: string
  nome_completo?: string
  criado_em: string
  atualizado_em: string
}

export interface Tarefa {
  id: string
  usuario_id: string
  titulo: string
  descricao?: string
  status: StatusTarefa
  prioridade: PrioridadeTarefa
  projeto?: string
  data_vencimento?: string
  minutos_estimados?: number
  meta_id?: string
  nota_id?: string
  criado_em: string
  atualizado_em: string
}

export interface Meta {
  id: string
  usuario_id: string
  titulo: string
  descricao?: string
  tipo: TipoMeta
  status: StatusMeta
  prazo?: string
  progresso: number
  categoria?: string
  criado_em: string
  atualizado_em: string
}

export interface Nota {
  id: string
  usuario_id: string
  titulo?: string
  conteudo: string
  tipo: TipoNota
  categoria_para?: CategoriaPara
  tags: string[]
  criado_em: string
  atualizado_em: string
}

export interface Habito {
  id: string
  usuario_id: string
  nome: string
  frequencia: FrequenciaHabito
  sequencia: number
  ultima_conclusao?: string
  esta_ativo: boolean
  meta_id?: string
  criado_em: string
  atualizado_em: string
}

export interface Marco {
  id: string
  meta_id: string
  titulo: string
  data_alvo?: string
  concluido: boolean
  concluido_em?: string
  criado_em: string
  atualizado_em: string
}

export interface VinculoNota {
  id: string
  nota_id: string
  tipo_vinculado: TipoEntidadeVinculada
  id_vinculado: string
  criado_em: string
  atualizado_em: string
}

export interface ConclusaoHabito {
  id: string
  habito_id: string
  data_conclusao: string
  criado_em: string
  atualizado_em: string
}

// Form data types
export interface TarefaFormData {
  titulo: string
  descricao?: string
  prioridade: PrioridadeTarefa
  projeto?: string
  data_vencimento?: string
  minutos_estimados?: number
  meta_id?: string
}

export interface MetaFormData {
  titulo: string
  descricao?: string
  tipo: TipoMeta
  prazo?: string
  categoria?: string
  progresso?: number
}

export interface NotaFormData {
  titulo?: string
  conteudo: string
  tipo: TipoNota
  categoria_para?: CategoriaPara
  tags: string[]
}

export interface HabitoFormData {
  nome: string
  frequencia: FrequenciaHabito
  meta_id?: string
}