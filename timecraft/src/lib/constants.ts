export const APP_CONFIG = {
  name: 'TimeCraft',
  description: 'Personal Productivity Hub',
  version: '1.0.0',
  author: 'TimeCraft Team'
} as const

export const PRIORIDADES = {
  baixa: { label: 'Baixa', color: 'gray', icon: '⚪' },
  media: { label: 'Média', color: 'blue', icon: '🔵' },
  alta: { label: 'Alta', color: 'orange', icon: '🟠' }
} as const

export const STATUS_TAREFA = {
  a_fazer: { label: 'A Fazer', color: 'gray', icon: '⭕' },
  fazendo: { label: 'Fazendo', color: 'blue', icon: '🔵' },
  concluida: { label: 'Concluída', color: 'green', icon: '✅' }
} as const

export const STATUS_META = {
  ativa: { label: 'Ativa', color: 'green' },
  pausada: { label: 'Pausada', color: 'yellow' },
  concluida: { label: 'Concluída', color: 'blue' },
  cancelada: { label: 'Cancelada', color: 'red' }
} as const

export const CATEGORIAS_PARA = {
  projetos: { 
    label: 'Projetos', 
    description: 'Resultados específicos com múltiplas ações',
    icon: '🎯',
    color: 'blue'
  },
  areas: { 
    label: 'Áreas', 
    description: 'Responsabilidades contínuas a manter',
    icon: '🏗️',
    color: 'green'
  },
  recursos: { 
    label: 'Recursos', 
    description: 'Tópicos de interesse futuro',
    icon: '📚',
    color: 'purple'
  },
  arquivo: { 
    label: 'Arquivo', 
    description: 'Itens inativos das categorias acima',
    icon: '📦',
    color: 'gray'
  }
} as const

export const QUICK_CAPTURE_SHORTCUTS = {
  task: ['fazer', 'tarefa', 'todo', 'completar', 'terminar'],
  note: ['nota', 'lembrar', 'anotar', 'observação'],
  goal: ['meta', 'objetivo', 'alcançar', 'conquistar']
} as const

export const ROUTES = {
  dashboard: '/',
  tasks: '/tasks',
  goals: '/goals', 
  notes: '/notes',
  habits: '/habits',
  calendar: '/calendar',
  settings: '/settings'
} as const