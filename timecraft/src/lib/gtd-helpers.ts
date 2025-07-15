// AIDEV-NOTE: Helpers para metodologia GTD - processamento de captura r�pida e organiza��o
export function generateTitle(content: string): string {
  if (!content || !content.trim()) {
    return 'Sem t�tulo'
  }

  const cleanContent = content.trim()

  if (cleanContent.length <= 50) {
    return cleanContent
  }

  const withoutCommands = cleanContent.replace(/^\/\w+\s*/, '')
  const words = withoutCommands.split(' ').filter(word => word.length > 0)

  if (words.length <= 8) {
    return withoutCommands
  }

  const truncated = words.slice(0, 8).join(' ')
  return truncated.length > 47
    ? `${truncated.substring(0, 47)}...`
    : `${truncated}...`
}

export function extractTags(content: string, context?: string): string[] {
  const tags: string[] = []

  const contextMatches = content.match(/@[\w\u00C0-\u017F]+/g)
  if (contextMatches) {
    tags.push(...contextMatches.map(tag => tag.toLowerCase()))
  }

  if (context && context.trim()) {
    const contextTag = context.trim().toLowerCase()
    const formattedContext = contextTag.startsWith('@')
      ? contextTag
      : `@${contextTag}`
    if (!tags.includes(formattedContext)) {
      tags.push(formattedContext)
    }
  }

  const hashMatches = content.match(/#[\w\u00C0-\u017F]+/g)
  if (hashMatches) {
    tags.push(...hashMatches.map(tag => tag.toLowerCase()))
  }

  const lowerContent = content.toLowerCase()

  if (lowerContent.match(/(urgente|prioridade|importante|asap|hoje mesmo)/)) {
    tags.push('#urgente')
  }

  if (lowerContent.match(/(quick|r�pido|liga��o|email|5min)/)) {
    tags.push('#energia-baixa')
  }

  if (
    lowerContent.match(/(escrever|criar|planejar|analisar|estudar|reuni�o)/)
  ) {
    tags.push('#energia-alta')
  }

  return [...new Set(tags)]
}

export function detectEnergyLevel(content: string): 'baixa' | 'media' | 'alta' {
  const lowerContent = content.toLowerCase()

  const highEnergyKeywords = [
    'escrever',
    'criar',
    'planejar',
    'analisar',
    'estudar',
    'desenvolver',
    'projetar',
    'pesquisar',
    'estrat�gia',
    'reuni�o',
    'apresenta��o',
    'relat�rio',
    'c�digo',
    'programar',
  ]

  if (highEnergyKeywords.some(keyword => lowerContent.includes(keyword))) {
    return 'alta'
  }

  const lowEnergyKeywords = [
    'ligar',
    'comprar',
    'enviar',
    'pagar',
    'lembrar',
    'agendar',
    'confirmar',
    'verificar',
    'responder',
    'arquivar',
    'deletar',
    'quick',
    'r�pido',
    '5min',
    'email',
  ]

  if (lowEnergyKeywords.some(keyword => lowerContent.includes(keyword))) {
    return 'baixa'
  }

  if (lowerContent.match(/(ligar para|enviar para|comprar na|pagar o)/)) {
    return 'baixa'
  }

  return 'media'
}

export function processTemplateCommand(content: string): string {
  const templates = {
    '/tarefa': (input: string) => (input ? `Fazer ${input}` : ''),
    '/meta': (input: string) => (input ? `Alcan�ar ${input}` : ''),
    '/habito': (input: string) => (input ? `${input} diariamente` : ''),
    '/lembrete': (input: string) => (input ? `Lembrar de ${input}` : ''),
    '/comprar': (input: string) => (input ? `Comprar ${input}` : ''),
    '/ligar': (input: string) => (input ? `Ligar para ${input}` : ''),
    '/email': (input: string) => (input ? `Enviar email para ${input}` : ''),
  }

  for (const [command, template] of Object.entries(templates)) {
    if (content.toLowerCase().startsWith(command)) {
      const input = content.substring(command.length).trim()
      const processed = template(input)
      if (processed) {
        return processed
      }
    }
  }

  return content
}

export function shouldAutoConvert(suggestion: {
  confidence: string
  type: string
}): boolean {
  return (
    suggestion.confidence === 'high' &&
    ['tarefa', 'meta'].includes(suggestion.type)
  )
}

export function getGTDCategory(
  content: string
): 'action' | 'reference' | 'someday' | 'project' {
  const lowerContent = content.toLowerCase()

  if (lowerContent.match(/^(fazer|preciso|devo|tenho que|vou)/)) {
    return 'action'
  }

  if (lowerContent.match(/(projeto|plano|organizar|preparar para)/)) {
    return 'project'
  }

  if (
    lowerContent.match(/(talvez|futuro|um dia|quando|se poss�vel|gostaria)/)
  ) {
    return 'someday'
  }

  if (lowerContent.match(/(informa��o|dados|refer�ncia|documentar|anotar)/)) {
    return 'reference'
  }

  return 'action'
}

export function generateMetadata(content: string, context?: string) {
  return {
    energia: detectEnergyLevel(content),
    categoria_gtd: getGTDCategory(content),
    tags: extractTags(content, context),
    processado_em: new Date().toISOString(),
  }
}
