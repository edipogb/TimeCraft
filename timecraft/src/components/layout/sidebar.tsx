import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { useNotesStore } from '@/stores/notes-store'
import { useMemo } from 'react'

export function Sidebar() {
  const { notes } = useNotesStore()
  
  const unprocessedCount = useMemo(() => {
    return notes.filter(note => note.tipo === 'rapida').length
  }, [notes])

  const navigation = [
    { name: 'Dashboard', href: ROUTES.dashboard, icon: '🏠', color: 'blue' },
    { name: 'Inbox GTD', href: '/inbox', icon: '📥', badge: unprocessedCount > 0 ? unprocessedCount : undefined, color: 'orange' },
    { name: 'Tarefas', href: ROUTES.tasks, icon: '✅', color: 'green' },
    { name: 'Metas', href: ROUTES.goals, icon: '🎯', color: 'purple' },
    { name: 'Notas', href: ROUTES.notes, icon: '📝', color: 'indigo' },
    { name: 'Hábitos', href: ROUTES.habits, icon: '🔄', color: 'pink' },
    { name: 'Calendário', href: ROUTES.calendar, icon: '📅', color: 'cyan' },
  ]

  const currentPath = window.location.pathname

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40">
      <div className="flex-1 flex flex-col min-h-0 bg-card border-r border-border shadow-2xl">
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-6 py-6 border-b border-border"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-2xl"
          >
            ⏰
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              TimeCraft
            </h1>
            <p className="text-xs text-muted-foreground">Produtividade & GTD</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item, index) => {
              const isActive = currentPath === item.href
              const hasNotifications = item.badge && item.badge > 0
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={item.href}
                    className={cn(
                      "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02]",
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary rounded-xl"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="relative flex items-center w-full">
                      <motion.span 
                        className="text-xl mr-3"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {item.icon}
                      </motion.span>
                      
                      <span className="flex-1">{item.name}</span>
                      
                      {/* Badge com animação */}
                      {hasNotifications && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          className={cn(
                            "inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full ml-2 min-w-[20px] h-5",
                            item.name === 'Inbox GTD' 
                              ? "bg-destructive text-destructive-foreground animate-pulse"
                              : "bg-primary text-primary-foreground"
                          )}
                        >
                          {item.badge! > 99 ? '99+' : item.badge}
                        </motion.span>
                      )}
                    </div>
                    
                    {/* Hover effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-accent/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200" />
                    )}
                  </a>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer com estatísticas rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="px-4 pt-6 border-t border-border"
          >
            <div className="bg-muted rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-2 font-medium">Status do Sistema</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total de Notas</span>
                  <span className="text-foreground font-semibold">{notes.length}</span>
                </div>
                {unprocessedCount > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-warning">Pendentes</span>
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-warning font-semibold"
                    >
                      {unprocessedCount}
                    </motion.span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-success">Processadas</span>
                  <span className="text-success font-semibold">
                    {notes.length - unprocessedCount}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GTD Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="px-4 pt-4"
          >
            <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
              <p className="text-xs text-primary italic text-center leading-relaxed">
                "Sua mente é para ter ideias, não para guardá-las."
              </p>
              <p className="text-xs text-primary text-center mt-1 font-medium">
                - David Allen
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}