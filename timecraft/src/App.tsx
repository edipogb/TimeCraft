import { AuthProvider } from '@/features/auth/auth-provider'
import { AppLayout } from '@/components/layout/app-layout'
import { QuickCaptureEnhanced } from '@/features/capture/quick-capture-enhanced'
import { Dashboard } from '@/pages/dashboard'
import { InboxPage } from '@/pages/inbox'
import { Toaster } from 'sonner'

function App() {
  // Simple routing based on pathname
  const currentPath = window.location.pathname

  const renderPage = () => {
    switch (currentPath) {
      case '/inbox':
        return <InboxPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <AuthProvider>
      <AppLayout>
        {renderPage()}
        <QuickCaptureEnhanced />
      </AppLayout>
      <Toaster position="top-right" richColors closeButton duration={4000} />
    </AuthProvider>
  )
}

export default App
