import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { useNotesStore } from '@/stores/notes-store'
import { useMemo } from 'react'
import { Icon } from '@/components/ui/icon'

export function Sidebar() {
  const { notes } = useNotesStore()

  const unprocessedCount = useMemo(() => {
    return notes.filter(note => note.tipo === 'rapida').length
  }, [notes])

  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.dashboard,
      icon: '🏠',
      lucideIcon: 'home' as const,
      ariaLabel: 'Dashboard principal',
      category: 'primary',
    },
    {
      name: 'Inbox GTD',
      href: '/inbox',
      icon: '📥',
      lucideIcon: 'inbox' as const,
      ariaLabel: 'Caixa de entrada para processamento GTD',
      badge: unprocessedCount > 0 ? unprocessedCount : undefined,
      category: 'warning',
    },
    {
      name: 'Projetos',
      href: ROUTES.tasks,
      icon: '🎯',
      lucideIcon: 'target' as const,
      ariaLabel: 'Gerenciar projetos e tarefas',
      category: 'projects',
    },
    {
      name: 'Áreas',
      href: ROUTES.goals,
      icon: '🔄',
      lucideIcon: 'rotate-ccw' as const,
      ariaLabel: 'Áreas de responsabilidade',
      category: 'areas',
    },
    {
      name: 'Recursos',
      href: ROUTES.notes,
      icon: '📚',
      lucideIcon: 'book' as const,
      ariaLabel: 'Recursos e materiais de referência',
      category: 'resources',
    },
    {
      name: 'Arquivo',
      href: ROUTES.habits,
      icon: '📦',
      lucideIcon: 'archive' as const,
      ariaLabel: 'Arquivo de itens inativos',
      category: 'archive',
    },
    {
      name: 'Calendário',
      href: ROUTES.calendar,
      icon: '📅',
      lucideIcon: 'calendar' as const,
      ariaLabel: 'Visualizar calendário e eventos',
      category: 'primary',
    },
  ]

  const currentPath = window.location.pathname

  return (
    <div className="z-40 hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="bg-card/95 border-border flex min-h-0 flex-1 flex-col border-r shadow-2xl backdrop-blur-xl">
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border flex items-center gap-3 border-b px-6 py-6"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="from-primary to-primary/80 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-lg"
          >
            <span className="text-primary-foreground text-lg">⚡</span>
          </motion.div>
          <div>
            <h1 className="text-foreground text-xl font-bold">TimeCraft</h1>
            <p className="text-muted-foreground text-xs">
              Personal Productivity Hub
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
          <nav className="flex-1 space-y-2 px-4">
            {navigation.map((item, index) => {
              const isActive = currentPath === item.href
              const hasNotifications = item.badge && item.badge > 0

              const getCategoryColor = (category: string) => {
                switch (category) {
                  case 'projects':
                    return 'hsl(var(--para-projects))'
                  case 'areas':
                    return 'hsl(var(--para-areas))'
                  case 'resources':
                    return 'hsl(var(--para-resources))'
                  case 'archive':
                    return 'hsl(var(--para-archive))'
                  case 'warning':
                    return 'hsl(var(--warning))'
                  default:
                    return 'hsl(var(--primary))'
                }
              }

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
                      'group relative flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]',
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                    style={
                      isActive
                        ? { backgroundColor: getCategoryColor(item.category) }
                        : {}
                    }
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          backgroundColor: getCategoryColor(item.category),
                        }}
                        initial={false}
                        transition={{
                          type: 'spring',
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}

                    {/* Content */}
                    <div className="relative flex w-full items-center">
                      <motion.div
                        className="mr-3 flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Icon
                          name={item.lucideIcon}
                          emoji={item.icon}
                          size={20}
                          aria-label={item.ariaLabel}
                          className={cn(
                            'transition-colors duration-200',
                            isActive ? 'text-white' : 'text-foreground'
                          )}
                        />
                      </motion.div>

                      <span className="flex-1">{item.name}</span>

                      {/* Badge com animação */}
                      {hasNotifications && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          className="ml-2 inline-flex h-5 min-w-[20px] animate-pulse items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-md"
                          style={{
                            backgroundColor: getCategoryColor(item.category),
                          }}
                        >
                          {item.badge! > 99 ? '99+' : item.badge}
                        </motion.span>
                      )}
                    </div>

                    {/* Hover effect */}
                    {!isActive && (
                      <div className="bg-accent absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
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
            className="border-border border-t px-4 pt-6"
          >
            <div className="bg-muted rounded-xl p-4">
              <div className="text-muted-foreground mb-2 text-xs font-medium">
                Status do Sistema
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total de Notas</span>
                  <span className="text-foreground font-semibold">
                    {notes.length}
                  </span>
                </div>
                {unprocessedCount > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'hsl(var(--warning))' }}>
                      Pendentes
                    </span>
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="font-semibold"
                      style={{ color: 'hsl(var(--warning))' }}
                    >
                      {unprocessedCount}
                    </motion.span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'hsl(var(--success))' }}>
                    Processadas
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: 'hsl(var(--success))' }}
                  >
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
            <div className="bg-accent border-border rounded-xl border p-3">
              <p className="text-accent-foreground text-center text-xs leading-relaxed italic">
                "Sua mente é para ter ideias, não para guardá-las."
              </p>
              <p className="text-accent-foreground mt-1 text-center text-xs font-medium">
                - David Allen
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
