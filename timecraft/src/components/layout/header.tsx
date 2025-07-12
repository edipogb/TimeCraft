import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useAuthStore } from '@/stores/auth-store'

export function Header() {
  const { user, signOut } = useAuthStore()

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4 sticky top-0 z-40 shadow-lg"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-2xl"
          >
            ⏰
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              TimeCraft
            </h1>
            <p className="text-xs text-muted-foreground font-medium">Produtividade & GTD</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{user?.email}</div>
            <div className="text-xs text-muted-foreground">Usuário ativo</div>
          </div>
          
          <ModeToggle />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="hover:bg-destructive hover:border-destructive hover:text-destructive-foreground transition-all duration-200 font-medium"
            >
              <span className="mr-2">🚪</span>
              Sair
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  )
}