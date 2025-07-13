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
import { BlurFade } from '@/components/magicui/blur-fade'

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Auth error:', errorMessage)
      
      // Traduzir mensagens de erro comuns
      let translatedErrorMessage = MESSAGES.auth.error_generic
      if (errorMessage.includes('Invalid login credentials')) {
        translatedErrorMessage = MESSAGES.auth.error_invalid_credentials
      } else if (errorMessage.includes('User already registered')) {
        translatedErrorMessage = MESSAGES.auth.error_email_exists
      } else if (errorMessage.includes('Password should be at least')) {
        translatedErrorMessage = MESSAGES.auth.error_weak_password
      }
      
      toast.error(translatedErrorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <BlurFade delay={0.1} className="w-full max-w-md">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <BlurFade delay={0.2}>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
            </BlurFade>
            <BlurFade delay={0.3}>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                TimeCraft
              </CardTitle>
            </BlurFade>
            <BlurFade delay={0.4}>
              <CardDescription className="text-muted-foreground">
                {isSignUp ? 'Criar nova conta' : 'Acesse sua conta'}
              </CardDescription>
            </BlurFade>
          </CardHeader>
          <CardContent>
            <BlurFade delay={0.5}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Input
                      {...form.register('fullName')}
                      placeholder="Nome completo"
                      disabled={loading}
                      className="h-11"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Input
                    {...form.register('email')}
                    type="email"
                    placeholder="Email"
                    disabled={loading}
                    className="h-11"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    {...form.register('password')}
                    type="password"
                    placeholder="Senha"
                    disabled={loading}
                    className="h-11"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 font-medium" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {isSignUp ? 'Criando conta...' : 'Entrando...'}
                    </div>
                  ) : (
                    isSignUp ? 'Criar Conta' : 'Entrar'
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    disabled={loading}
                  >
                    {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar nova'}
                  </button>
                </div>
              </form>
            </BlurFade>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  )
}