import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { MESSAGES } from '@/lib/messages'

const authSchema = z.object({
  email: z.string().email(MESSAGES.validation.invalid_email),
  password: z.string().min(6, MESSAGES.validation.password_min_length),
  fullName: z.string().optional(),
})

type AuthFormData = z.infer<typeof authSchema>

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuthStore()

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  })

  const onSubmit = async (data: AuthFormData) => {
    try {
      setLoading(true)
      
      if (isSignUp) {
        await signUp(data.email, data.password, data.fullName)
        toast.success(MESSAGES.auth.signup_success)
      } else {
        await signIn(data.email, data.password)
        toast.success(MESSAGES.auth.login_success)
      }
    } catch (error: any) {
      console.error('Auth error:', error.message)
      
      // Traduzir mensagens de erro comuns
      let errorMessage = MESSAGES.auth.error_generic
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = MESSAGES.auth.error_invalid_credentials
      } else if (error.message.includes('User already registered')) {
        errorMessage = MESSAGES.auth.error_email_exists
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = MESSAGES.auth.error_weak_password
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🚀 TimeCraft</CardTitle>
          <CardDescription>
            {isSignUp ? 'Criar nova conta' : 'Fazer login na sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <div>
                <Input
                  {...form.register('fullName')}
                  placeholder="Nome completo"
                  disabled={loading}
                />
              </div>
            )}
            
            <div>
              <Input
                {...form.register('email')}
                type="email"
                placeholder="Email"
                disabled={loading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...form.register('password')}
                type="password"
                placeholder="Senha"
                disabled={loading}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? 'Criando...' : 'Entrando...') : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-600 hover:underline"
                disabled={loading}
              >
                {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar nova'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}