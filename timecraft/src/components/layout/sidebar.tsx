import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

const navigation = [
  { name: 'Dashboard', href: ROUTES.dashboard, icon: '<à' },
  { name: 'Tarefas', href: ROUTES.tasks, icon: '' },
  { name: 'Metas', href: ROUTES.goals, icon: '<¯' },
  { name: 'Notas', href: ROUTES.notes, icon: '=Ý' },
  { name: 'Hábitos', href: ROUTES.habits, icon: '=' },
  { name: 'Calendário', href: ROUTES.calendar, icon: '=Å' },
]

export function Sidebar() {
  const currentPath = window.location.pathname

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  currentPath === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}