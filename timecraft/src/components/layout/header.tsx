import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useAuthStore } from '@/stores/auth-store'
import { Icon } from '@/components/ui/icon'

export function Header() {
  const { user, signOut } = useAuthStore()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/95 border-border sticky top-0 z-40 border-b px-6 py-4 shadow-lg backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="from-primary to-primary/80 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg"
          >
            <Icon
              name="zap"
              emoji="⚡"
              size={24}
              aria-label="TimeCraft logo"
              className="text-primary-foreground"
            />
          </motion.div>
          <div>
            <h1 className="text-foreground text-2xl font-bold">TimeCraft</h1>
            <p className="text-muted-foreground text-xs font-medium">
              Personal Productivity Hub
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="text-right">
            <div className="text-foreground text-sm font-medium">
              {user?.email}
            </div>
            <div className="text-muted-foreground text-xs">Usuário ativo</div>
          </div>

          <ModeToggle />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="hover:bg-destructive hover:border-destructive hover:text-destructive-foreground font-medium transition-all duration-200"
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
