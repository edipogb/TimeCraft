// AIDEV-NOTE: Mensagens centralizadas em português para toasts e notificações
export const MESSAGES = {
  // Autenticação
  auth: {
    signup_success: 'Conta criada com sucesso!',
    login_success: 'Login realizado com sucesso!',
    logout_success: 'Logout realizado com sucesso!',
    error_generic: 'Erro na autenticação. Tente novamente.',
    error_invalid_credentials: 'Email ou senha incorretos.',
    error_email_exists: 'Este email já está em uso.',
    error_weak_password: 'A senha deve ter pelo menos 6 caracteres.',
    error_invalid_email: 'Email inválido.',
    required_email: 'Email é obrigatório',
    required_password: 'Senha é obrigatória',
    required_name: 'Nome é obrigatório'
  },

  // Quick Capture
  capture: {
    success: 'Capturado com sucesso!',
    error_generic: 'Erro ao capturar. Tente novamente.',
    error_content_required: 'Conteúdo é obrigatório',
    loading: 'Capturando...',
    button_capture: 'Capturar',
    button_cancel: 'Cancelar',
    placeholder_title: 'Título (opcional)',
    placeholder_content: 'Digite qualquer coisa... (tarefa, nota, ideia, meta)'
  },

  // Notas
  notes: {
    create_success: 'Nota criada com sucesso!',
    update_success: 'Nota atualizada com sucesso!',
    delete_success: 'Nota excluída com sucesso!',
    error_create: 'Erro ao criar nota',
    error_update: 'Erro ao atualizar nota',
    error_delete: 'Erro ao excluir nota'
  },

  // Tarefas
  tasks: {
    create_success: 'Tarefa criada com sucesso!',
    update_success: 'Tarefa atualizada com sucesso!',
    complete_success: 'Tarefa concluída!',
    delete_success: 'Tarefa excluída com sucesso!',
    error_create: 'Erro ao criar tarefa',
    error_update: 'Erro ao atualizar tarefa',
    error_delete: 'Erro ao excluir tarefa'
  },

  // Metas
  goals: {
    create_success: 'Meta criada com sucesso!',
    update_success: 'Meta atualizada com sucesso!',
    complete_success: 'Meta alcançada! Parabéns!',
    delete_success: 'Meta excluída com sucesso!',
    error_create: 'Erro ao criar meta',
    error_update: 'Erro ao atualizar meta',
    error_delete: 'Erro ao excluir meta'
  },

  // Hábitos
  habits: {
    create_success: 'Hábito criado com sucesso!',
    update_success: 'Hábito atualizado com sucesso!',
    complete_success: 'Hábito marcado como concluído!',
    streak_broken: 'Sequência quebrada. Continue tentando!',
    streak_milestone: 'Parabéns! {{days}} dias consecutivos!',
    delete_success: 'Hábito excluído com sucesso!',
    error_create: 'Erro ao criar hábito',
    error_update: 'Erro ao atualizar hábito',
    error_delete: 'Erro ao excluir hábito'
  },

  // Sistema/Conexão
  system: {
    connection_success: 'Conectado com sucesso!',
    connection_error: 'Erro de conexão. Verifique sua internet.',
    loading: 'Carregando...',
    saving: 'Salvando...',
    processing: 'Processando...',
    error_generic: 'Ocorreu um erro inesperado. Tente novamente.',
    error_network: 'Erro de rede. Verifique sua conexão.',
    error_server: 'Erro no servidor. Tente novamente em alguns instantes.'
  },

  // Validação de formulários
  validation: {
    required_field: 'Este campo é obrigatório',
    invalid_email: 'Email inválido',
    password_min_length: 'Senha deve ter pelo menos 6 caracteres',
    passwords_must_match: 'As senhas devem ser iguais'
  },

  // Confirmações
  confirm: {
    delete_item: 'Tem certeza que deseja excluir este item?',
    unsaved_changes: 'Você tem alterações não salvas. Deseja continuar?',
    reset_data: 'Isso irá redefinir todos os dados. Continuar?'
  }
} as const

// Tipo helper para autocompletar
export type MessageKey = keyof typeof MESSAGES
export type AuthMessage = keyof typeof MESSAGES.auth
export type CaptureMessage = keyof typeof MESSAGES.capture
// ... outros tipos conforme necessário