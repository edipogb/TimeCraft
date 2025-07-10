import { AuthProvider } from '@/features/auth/auth-provider'
import { AppLayout } from '@/components/layout/app-layout'
import { QuickCapture } from '@/components/shared/quick-capture'
import { Dashboard } from '@/pages/dashboard'
import { Toaster } from 'sonner'

function App() {
  return (
    <AuthProvider>
      <AppLayout>
        <Dashboard />
        <QuickCapture />
      </AppLayout>
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </AuthProvider>
  )
}

export default App