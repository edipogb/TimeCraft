import { toast } from 'sonner'
import { MESSAGES } from '@/lib/messages'

// AIDEV-NOTE: Hook helper para facilitar uso de toasts em português em toda aplicação
export function useToastMessages() {
  return {
    // Métodos de conveniência para auth
    auth: {
      signupSuccess: () => toast.success(MESSAGES.auth.signup_success),
      loginSuccess: () => toast.success(MESSAGES.auth.login_success),
      logoutSuccess: () => toast.success(MESSAGES.auth.logout_success),
      error: (message?: string) =>
        toast.error(message || MESSAGES.auth.error_generic),
    },

    // Métodos para notes
    notes: {
      createSuccess: () => toast.success(MESSAGES.notes.create_success),
      updateSuccess: () => toast.success(MESSAGES.notes.update_success),
      deleteSuccess: () => toast.success(MESSAGES.notes.delete_success),
      createError: () => toast.error(MESSAGES.notes.error_create),
      updateError: () => toast.error(MESSAGES.notes.error_update),
      deleteError: () => toast.error(MESSAGES.notes.error_delete),
    },

    // Métodos para tasks
    tasks: {
      createSuccess: () => toast.success(MESSAGES.tasks.create_success),
      updateSuccess: () => toast.success(MESSAGES.tasks.update_success),
      completeSuccess: () => toast.success(MESSAGES.tasks.complete_success),
      deleteSuccess: () => toast.success(MESSAGES.tasks.delete_success),
      createError: () => toast.error(MESSAGES.tasks.error_create),
      updateError: () => toast.error(MESSAGES.tasks.error_update),
      deleteError: () => toast.error(MESSAGES.tasks.error_delete),
    },

    // Métodos para goals
    goals: {
      createSuccess: () => toast.success(MESSAGES.goals.create_success),
      updateSuccess: () => toast.success(MESSAGES.goals.update_success),
      completeSuccess: () => toast.success(MESSAGES.goals.complete_success),
      deleteSuccess: () => toast.success(MESSAGES.goals.delete_success),
      createError: () => toast.error(MESSAGES.goals.error_create),
      updateError: () => toast.error(MESSAGES.goals.error_update),
      deleteError: () => toast.error(MESSAGES.goals.error_delete),
    },

    // Métodos para habits
    habits: {
      createSuccess: () => toast.success(MESSAGES.habits.create_success),
      updateSuccess: () => toast.success(MESSAGES.habits.update_success),
      completeSuccess: () => toast.success(MESSAGES.habits.complete_success),
      deleteSuccess: () => toast.success(MESSAGES.habits.delete_success),
      streakMilestone: (days: number) =>
        toast.success(
          MESSAGES.habits.streak_milestone.replace('{{days}}', days.toString())
        ),
      streakBroken: () => toast.warning(MESSAGES.habits.streak_broken),
      createError: () => toast.error(MESSAGES.habits.error_create),
      updateError: () => toast.error(MESSAGES.habits.error_update),
      deleteError: () => toast.error(MESSAGES.habits.error_delete),
    },

    // Métodos para sistema
    system: {
      connectionSuccess: () =>
        toast.success(MESSAGES.system.connection_success),
      connectionError: () => toast.error(MESSAGES.system.connection_error),
      genericError: () => toast.error(MESSAGES.system.error_generic),
      networkError: () => toast.error(MESSAGES.system.error_network),
      serverError: () => toast.error(MESSAGES.system.error_server),
    },

    // Métodos genéricos para uso direto
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) => toast.warning(message),
    info: (message: string) => toast.info(message),

    // Promessas com toast automático
    promise: <T>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string
        error: string
      }
    ) => {
      return toast.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      })
    },
  }
}

// Export individual para casos específicos
export const toastMessages = {
  auth: {
    signupSuccess: () => toast.success(MESSAGES.auth.signup_success),
    loginSuccess: () => toast.success(MESSAGES.auth.login_success),
    logoutSuccess: () => toast.success(MESSAGES.auth.logout_success),
  },
  capture: {
    success: () => toast.success(MESSAGES.capture.success),
    error: () => toast.error(MESSAGES.capture.error_generic),
  },
}
