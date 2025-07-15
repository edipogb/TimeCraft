import { useMemo } from 'react'
import { QUICK_CAPTURE_SHORTCUTS } from '@/lib/constants'

// AIDEV-NOTE: Hook para detecção inteligente GTD - analisa conteúdo e sugere tipo de item
interface Suggestion {
  confidence: 'none' | 'low' | 'medium' | 'high'
  type: 'tarefa' | 'meta' | 'nota' | 'habito'
  reason: string
}

export function useQuickCaptureDetection() {
  const detectType = (content: string): Suggestion => {
    if (!content || content.length < 3) {
      return { confidence: 'none', type: 'nota', reason: '' }
    }

    const lowerContent = content.toLowerCase()

    // ALTA CONFIANÇA - padrões claros e específicos

    // Comandos de template
    if (lowerContent.startsWith('/tarefa')) {
      return {
        confidence: 'high',
        type: 'tarefa',
        reason: 'Comando template /tarefa usado',
      }
    }

    if (lowerContent.startsWith('/meta')) {
      return {
        confidence: 'high',
        type: 'meta',
        reason: 'Comando template /meta usado',
      }
    }

    if (lowerContent.startsWith('/habito')) {
      return {
        confidence: 'high',
        type: 'habito',
        reason: 'Comando template /habito usado',
      }
    }

    // Padrões de tarefas
    if (
      lowerContent.match(
        /^(fazer|preciso|devo|tenho que|comprar|ligar|enviar|pagar)\s/
      )
    ) {
      return {
        confidence: 'high',
        type: 'tarefa',
        reason: 'Começa com verbo de ação típico de tarefa',
      }
    }

    // Padrões de metas
    if (
      lowerContent.match(
        /(meta:|objetivo:|alcançar|conseguir|atingir|objetivo de)/
      )
    ) {
      return {
        confidence: 'high',
        type: 'meta',
        reason: 'Contém indicadores explícitos de meta/objetivo',
      }
    }

    // Padrões de hábitos
    if (
      lowerContent.match(
        /(diariamente|todo dia|todos os dias|sempre|hábito|rotina|toda manhã|toda noite)/
      )
    ) {
      return {
        confidence: 'high',
        type: 'habito',
        reason: 'Indica frequência regular ou rotina',
      }
    }

    // MÉDIA CONFIANÇA - múltiplas palavras-chave
    const taskKeywords = QUICK_CAPTURE_SHORTCUTS.task
    const goalKeywords = QUICK_CAPTURE_SHORTCUTS.goal

    const taskMatches = taskKeywords.filter(keyword =>
      lowerContent.includes(keyword)
    )
    const goalMatches = goalKeywords.filter(keyword =>
      lowerContent.includes(keyword)
    )

    if (taskMatches.length >= 2) {
      return {
        confidence: 'medium',
        type: 'tarefa',
        reason: `Múltiplas palavras de tarefa: ${taskMatches.slice(0, 2).join(', ')}`,
      }
    }

    if (goalMatches.length >= 1) {
      return {
        confidence: 'medium',
        type: 'meta',
        reason: `Palavras relacionadas a meta: ${goalMatches[0]}`,
      }
    }

    // BAIXA CONFIANÇA - indicadores sutis
    if (taskMatches.length === 1) {
      return {
        confidence: 'low',
        type: 'tarefa',
        reason: `Possível tarefa (palavra-chave: ${taskMatches[0]})`,
      }
    }

    // Padrões de números/quantidades podem indicar metas
    if (
      lowerContent.match(
        /\d+\s*(kg|quilos|km|livros|páginas|horas|dias|semanas|meses|anos)/
      )
    ) {
      return {
        confidence: 'low',
        type: 'meta',
        reason: 'Contém quantidade mensurável',
      }
    }

    // DEFAULT - nota geral para GTD inbox
    return {
      confidence: 'low',
      type: 'nota',
      reason: 'Será processado durante review',
    }
  }

  const getSuggestion = useMemo(() => {
    return (content: string): Suggestion => {
      return detectType(content)
    }
  }, [])

  const getTemplateHint = (content: string): string | null => {
    if (content.startsWith('/')) {
      const command = content.split(' ')[0]
      const templates = {
        '/tarefa': 'Fazer [sua tarefa]',
        '/meta': 'Alcançar [seu objetivo]',
        '/habito': '[atividade] diariamente',
        '/lembrete': 'Lembrar de [algo]',
      }
      return templates[command as keyof typeof templates] || null
    }
    return null
  }

  return {
    detectType,
    getSuggestion,
    getTemplateHint,
  }
}
