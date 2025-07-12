 TimeCraft MVP - Product Requirements Document (PRD)

## 1. Visão Geral do Produto

### 1.1 Resumo Executivo
**TimeCraft** é uma aplicação pessoal de produtividade que unifica gestão de tarefas, agenda e hábitos em uma experiência simples e inteligente. Desenvolvido inicialmente para uso pessoal, com arquitetura SaaS para futura escalabilidade.

### 1.2 Problema a Resolver
- **Fragmentação**: Múltiplas ferramentas para tarefas, agenda e hábitos
- **Falta de insights**: Dificuldade em identificar padrões produtivos
- **Complexidade**: Interfaces pesadas que prejudicam o uso consistente
- **Sincronização**: Desalinhamento entre calendário e gestão de tarefas

### 1.3 Proposta de Valor MVP
- **Unificação simples**: Hub central para organização pessoal
- **Interface moderna**: UI avançada com Magic UI + animações fluidas
- **Insights básicos**: Análise simples de produtividade
- **PWA nativo**: Funciona offline, sincroniza online

## 2. Público-Alvo (Mantido)

### 2.1 Personas Principais

**Persona 1: Profissional Executivo (Foco inicial)**
- Idade: 30-45 anos
- Múltiplas responsabilidades
- Usa calendário intensivamente
- Valoriza simplicidade e eficiência

**Persona 2: Empreendedor/Freelancer**
- Idade: 25-40 anos
- Equilibra múltiplos projetos
- Gerencia própria agenda
- Precisa de tracking de progresso

**Persona 3: Estudante/Acadêmico**
- Idade: 18-30 anos
- Organiza estudos e prazos
- Busca desenvolvimento de hábitos
- Valoriza simplicidade

## 3. Implementação dos Frameworks GTD e PARA

### 3.1 Getting Things Done (GTD) Workflow

#### 3.1.1 Capture (Sempre Disponível)
```typescript
// Quick Capture Component - Always accessible
import { AnimatedButton } from "@/components/magic/animated-button"
import { GradientInput } from "@/components/magic/gradient-input"

const QuickCapture = () => {
  const [mode, setMode] = useState<'note' | 'task' | 'auto'>('auto');
  
  return (
    <AnimatedButton className="fixed bottom-6 right-6 z-50">
      <GradientInput 
        placeholder="Capture anything..."
        className="backdrop-blur-lg"
        onSubmit={(text) => {
          if (mode === 'auto') {
            // AI/Rules decide if it's a task or note
            const isTask = detectTaskPattern(text);
            isTask ? createTask(text) : createNote(text);
          }
        }}
      />
    </AnimatedButton>
  );
};
```

#### 3.1.2 Clarify (Review Process)
- **Inbox Review**: `/notes?type=quick&status=unprocessed`
- **2-minute Rule**: Tasks < 2min get "do now" suggestion
- **Actionable Decision**: Note → Task, Goal, Reference, or Trash

#### 3.1.3 Organize (PARA Integration)
- **Projects**: Active outcomes requiring multiple steps
- **Areas**: Ongoing responsibilities to maintain
- **Resources**: Future reference topics
- **Archive**: Inactive items from above categories

#### 3.1.4 Reflect (Weekly Review)
```typescript
interface WeeklyReview {
  unprocessedNotes: Note[];
  overdueActions: Task[];
  upcomingDeadlines: (Task | Goal)[];
  habitConsistency: HabitStats[];
  goalProgress: GoalProgress[];
}
```

#### 3.1.5 Engage (Daily Execution)
- Context-based task lists (@calls, @computer, @errands)
- Energy-based filtering (high/medium/low energy tasks)
- Time-based blocking (calendar integration)

### 3.2 PARA Method Integration

#### 3.2.1 Automatic Categorization
```typescript
const suggestPARACategory = (note: Note, context: UserContext) => {
  // AI/Rules-based suggestion
  if (hasActionItems(note.content)) return 'projects';
  if (isOngoingResponsibility(note.content)) return 'areas';
  if (isReferenceContent(note.content)) return 'resources';
  return 'archive';
};
```

#### 3.2.2 Cross-Feature PARA
- **Notes**: Primary PARA organization
- **Tasks**: Inherit PARA from linked notes/projects
- **Goals**: Map to Projects and Areas
- **Habits**: Link to Areas for ongoing maintenance

## 4. Funcionalidades MVP (Core Essencial)

### 3.1 Gestão de Tarefas (Core)

#### 3.1.1 Estrutura Básica
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  project?: string;
  dueDate?: Date;
  estimatedMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Funcionalidades MVP:**
- ✅ CRUD completo de tarefas
- ✅ Priorização simples (Low/Medium/High)
- ✅ Status básico (Todo/Doing/Done)
- ✅ Projetos simples (string tags)
- ✅ Due dates
- ✅ Quick add com input inteligente
- ✅ Estimativa de tempo

#### 3.1.2 Visualizações MVP
- **Lista**: View principal com filtros básicos
- **Hoje**: Tarefas do dia atual
- **Esta Semana**: Visão semanal
- **Projetos**: Agrupamento por projeto

### 3.2 Calendário Integrado (Core)

#### 3.2.1 Funcionalidades MVP
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'task' | 'event' | 'habit';
  source: 'internal' | 'google';
}
```

**Features essenciais:**
- ✅ Calendário mensal/semanal/diário
- ✅ Visualização de tarefas com due date
- ✅ Criação rápida de eventos
- ✅ Time blocking manual simples
- ✅ Sync read-only com Google Calendar (v1.1)

### 3.3 Hábitos Básicos (Core)

#### 3.3.1 Sistema Simples
```typescript
interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  lastCompleted?: Date;
  isActive: boolean;
  createdAt: Date;
}
```

**Funcionalidades MVP:**
- ✅ Criação de hábitos diários/semanais
- ✅ Check-in simples (feito/não feito)
- ✅ Tracking de streak
- ✅ Lista simples de hábitos ativos

### 3.4 Sistema de Notas (Core - GTD/PARA)

#### 3.4.1 Estrutura de Notas
```typescript
interface Note {
  id: string;
  title?: string;
  content: string;
  type: 'quick' | 'project' | 'reference' | 'someday';
  tags: string[];
  linkedTo?: {
    tasks?: string[];
    habits?: string[];
    events?: string[];
    notes?: string[];
  };
  paraCategory?: 'projects' | 'areas' | 'resources' | 'archive';
  createdAt: Date;
  updatedAt: Date;
}
```

**Funcionalidades MVP:**
- ✅ **Quick Capture**: Criação rápida de notas (GTD Inbox)
- ✅ **Rich Text Editor**: Formatação básica (markdown)
- ✅ **Linking System**: Conectar notas a tarefas/hábitos/eventos
- ✅ **Note → Task**: Converter notas em tarefas facilmente
- ✅ **PARA Organization**: Categorização por Projects/Areas/Resources/Archive
- ✅ **Tag System**: Tags livres para organização adicional
- ✅ **Search & Filter**: Busca por conteúdo e tags

#### 3.4.2 Fluxo GTD Integrado
1. **Capture**: Quick note creation (sempre disponível)
2. **Clarify**: Review de notas → decidir ação
3. **Organize**: Categorizar (PARA) ou converter em task
4. **Review**: Weekly review de notas não processadas

### 3.5 Gestão de Metas (Core)

#### 3.5.1 Estrutura Simplificada
```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'outcome' | 'process' | 'learning';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  deadline?: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  relatedTasks: string[];
  relatedNotes: string[];
  createdAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  targetDate?: Date;
  completed: boolean;
  completedAt?: Date;
}
```

**Funcionalidades MVP:**
- ✅ **CRUD de Metas**: Criar, editar, arquivar metas
- ✅ **Progress Tracking**: Atualização manual de progresso (0-100%)
- ✅ **Milestones**: Marcos intermediários para metas grandes
- ✅ **Task Connection**: Vincular tarefas às metas
- ✅ **Note Connection**: Vincular notas de planejamento às metas
- ✅ **Visual Progress**: Barras de progresso e indicadores visuais
- ✅ **Goal Categories**: Pessoal, Profissional, Saúde, etc.

### 3.6 Dashboard Integrado (Core)

#### 3.6.1 Visão Geral Diária
- **Tarefas do dia**: Lista priorizada com metas relacionadas
- **Hábitos pendentes**: Check-ins do dia
- **Próximos eventos**: Calendário resumido
- **Progresso de metas**: Metas ativas com % progresso
- **Notas recentes**: Quick access para notas não processadas
- **Quick Capture**: Botão flutuante sempre disponível

### 3.7 Notificações Básicas (Core)

```typescript
interface Notification {
  id: string;
  type: 'task_due' | 'habit_reminder' | 'goal_deadline' | 'note_review';
  title: string;
  scheduledFor: Date;
  delivered: boolean;
}
```

**MVP Features:**
- ✅ Lembretes de tarefas com due date
- ✅ Lembretes de hábitos (horário fixo)
- ✅ Alertas de deadline de metas
- ✅ Weekly review reminder (notas não processadas)
- ✅ Notificações PWA básicas
- ✅ Configuração on/off simples

## 4. Arquitetura Técnica Simplificada

### 4.1 Stack Tecnológico (Free Tier)

#### 4.1.1 Frontend
```json
{
  "core": ["React 18", "TypeScript", "Vite", "Tailwind CSS v4"],
  "ui": ["Magic UI", "Framer Motion", "@headlessui/react"],
  "state": ["TanStack Query", "Zustand"],
  "forms": ["React Hook Form", "Zod"],
  "dates": ["date-fns"],
  "pwa": ["Vite PWA Plugin"]
}
```

#### 4.1.2 Backend (Free Tier)
```json
{
  "database": "Supabase Free (500MB, 2GB bandwidth)",
  "auth": "Supabase Auth",
  "hosting": "Vercel Free (100GB bandwidth)",
  "domain": "vercel.app subdomain"
}
```

#### 4.1.3 Limitações Free Tier
- **Supabase**: 500MB storage, 2GB bandwidth/mês
- **Vercel**: 100GB bandwidth, 100 deployments/mês
- **Sem integrações pagas**: Google Calendar via API gratuita

### 4.2 Estrutura de Projeto Simplificada

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── magic/           # Magic UI components with animations
│   └── shared/          # Shared custom components
├── features/
│   ├── auth/            # Authentication
│   ├── tasks/           # Task management
│   ├── calendar/        # Calendar integration
│   ├── habits/          # Habit tracking
│   ├── goals/           # Goal management
│   ├── notes/           # Note system (GTD/PARA)
│   └── dashboard/       # Main dashboard
├── hooks/               # Custom hooks
├── lib/
│   ├── supabase.ts      # Supabase client
│   ├── utils.ts         # Utilities
│   ├── gtd.ts           # GTD workflow helpers
│   └── types.ts         # TypeScript types
├── stores/              # Zustand stores
│   ├── auth.ts
│   ├── tasks.ts
│   ├── goals.ts
│   └── notes.ts
└── pages/               # Route components
    ├── Dashboard.tsx
    ├── Tasks.tsx
    ├── Calendar.tsx
    ├── Habits.tsx
    ├── Goals.tsx
    └── Notes.tsx
```

### 4.3 Database Schema MVP

```sql
-- Esquema completo para MVP com Notas e Metas
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  project VARCHAR(50),
  due_date DATE,
  estimated_minutes INTEGER,
  goal_id UUID REFERENCES goals(id),
  note_id UUID REFERENCES notes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  frequency VARCHAR(20) DEFAULT 'daily',
  streak INTEGER DEFAULT 0,
  last_completed DATE,
  is_active BOOLEAN DEFAULT true,
  goal_id UUID REFERENCES goals(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(20) DEFAULT 'outcome',
  status VARCHAR(20) DEFAULT 'active',
  deadline DATE,
  progress INTEGER DEFAULT 0,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  target_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200),
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'quick',
  para_category VARCHAR(20),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE note_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  linked_type VARCHAR(20) NOT NULL, -- 'task', 'habit', 'goal', 'note'
  linked_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_goal ON tasks(goal_id);
CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_goals_user_status ON goals(user_id, status);
CREATE INDEX idx_notes_user_type ON notes(user_id, type);
CREATE INDEX idx_notes_para ON notes(user_id, para_category);
CREATE INDEX idx_note_links_note ON note_links(note_id);
CREATE INDEX idx_note_links_linked ON note_links(linked_type, linked_id);

-- RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks" 
ON tasks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own habits" 
ON habits FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goals" 
ON goals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notes" 
ON notes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own note links" 
ON note_links FOR ALL USING (
  EXISTS (SELECT 1 FROM notes WHERE notes.id = note_links.note_id AND notes.user_id = auth.uid())
);
```

## 5. UX/UI Simplificado

### 5.1 Design System (Magic UI)

#### 5.1.1 Componentes Base
```typescript
// Magic UI como stack principal
import { AnimatedButton } from "@/components/magic/animated-button"
import { GradientCard } from "@/components/magic/gradient-card"
import { GlassPanel } from "@/components/magic/glass-panel"
import { FloatingInput } from "@/components/magic/floating-input"
import { ProgressRing } from "@/components/magic/progress-ring"

// Animações fluidas com Framer Motion
import { motion, AnimatePresence } from "framer-motion"
```

#### 5.1.2 Layout Principal
```typescript
// Layout com animações e glassmorphism
const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sidebar backdrop-blur-lg bg-white/80 dark:bg-gray-900/80"
    >
      <Sidebar />
    </motion.div>
    <main className="pl-64 p-6">
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </main>
  </div>
);
```

### 5.2 Páginas Principais MVP

1. **Dashboard** - `/` (visão geral integrada com animações)
2. **Tarefas** - `/tasks` (lista e gestão com transições fluidas)
3. **Calendário** - `/calendar` (view mensal/semanal animada)
4. **Hábitos** - `/habits` (tracking com progress rings)
5. **Metas** - `/goals` (gestão e progresso com gradients)
6. **Notas** - `/notes` (capture, organize, link com glassmorphism)
7. **Configurações** - `/settings` (básicas com tema switching)

#### 5.2.1 Fluxo GTD Integrado nas Páginas
- **Quick Capture**: Botão flutuante animado em todas as páginas
- **Inbox Processing**: `/notes?type=quick` para processar notas
- **PARA Organization**: Filtros por categoria nas notas
- **Note → Task**: Modal de conversão com animações suaves

### 5.3 PWA Features Essenciais

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
            },
          },
        ],
      },
      manifest: {
        name: 'TimeCraft',
        short_name: 'TimeCraft',
        description: 'Personal Productivity Hub',
        theme_color: '#3b82f6',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 6. Roadmap MVP Focado

### 6.1 Sprint 1 (Semanas 1-2): Setup + Auth + Notes Foundation
**Objetivo**: Base sólida com sistema de capture

- ✅ Setup Vite + React + TypeScript
- ✅ Configurar Magic UI + Tailwind v4
- ✅ Setup Supabase + schemas completos
- ✅ Autenticação básica (email/password)
- ✅ Layout responsivo com animações
- ✅ **Quick Capture**: Sistema básico de notas
- ✅ Deploy na Vercel

### 6.2 Sprint 2 (Semanas 3-4): Tarefas + Metas Core
**Objetivo**: CRUD de tarefas com vinculação a metas

- ✅ Página de tarefas com lista animada
- ✅ Criar/editar/excluir tarefas
- ✅ Sistema de prioridades com indicators
- ✅ Status workflow (todo → doing → done)
- ✅ **CRUD básico de metas**
- ✅ **Vinculação tarefas ↔ metas**
- ✅ Quick add com animações

### 6.3 Sprint 3 (Semanas 5-6): Calendário + Notes Organization
**Objetivo**: Visão temporal + sistema PARA

- ✅ Componente calendário com transições
- ✅ Visualizar tarefas por data
- ✅ **Sistema PARA para notas** (Projects/Areas/Resources/Archive)
- ✅ **Note linking system** (notas ↔ tarefas/metas)
- ✅ **Note → Task conversion**
- ✅ Dashboard integrado com cards glassmorphism

### 6.4 Sprint 4 (Semanas 7-8): Hábitos + Goals Progress + PWA
**Objetivo**: Tracking completo + app nativo

- ✅ CRUD de hábitos com progress rings
- ✅ Check-in diário animado
- ✅ **Vinculação hábitos ↔ metas**
- ✅ **Progress tracking de metas** com gradients
- ✅ **Milestones system** com timeline
- ✅ PWA completo com offline
- ✅ Notificações básicas

### 6.5 Sprint 5 (Semanas 9-10): GTD Workflow + Polish
**Objetivo**: Fluxo completo GTD/PARA + polish

- ✅ **Weekly Review automático** (notas não processadas)
- ✅ **Search & filter** avançado para notas
- ✅ **Dashboard insights** (progresso metas, hábitos)
- ✅ Testes unitários críticos
- ✅ UX polish e micro-interações Magic UI
- ✅ Performance optimization

## 7. Considerações Free Tier

### 7.1 Limitações e Workarounds

#### 7.1.1 Supabase Free (500MB)
- **Otimizar queries** com select específicos
- **Cleanup automático** de dados antigos (6 meses)
- **Compressão** de texto longo
- **Pagination** em listas grandes

#### 7.1.2 Vercel Free (100GB/mês)
- **Otimizar bundle size** com tree shaking
- **Image optimization** nativa do Next.js
- **CDN caching** agressivo para assets
- **Lazy loading** de componentes

### 7.2 Monitoramento Simples

```typescript
// Analytics simples sem ferramentas pagas
const trackEvent = (event: string, data?: any) => {
  if (typeof window !== 'undefined') {
    console.log('Event:', event, data);
    // Futuro: enviar para analytics simples
  }
};
```

## 8. Migração para SaaS (Futuro)

### 8.1 Preparação Arquitetural
- **Multi-tenancy** já implementado via RLS
- **Billing** estrutura preparada (user.plan)
- **Feature flags** simples para tier control
- **API structure** preparada para expansão

### 8.2 Sinais de Viabilidade SaaS
- **Uso pessoal consistente** por 3+ meses
- **Feedback positivo** de 5+ beta testers
- **Métricas de engajamento** sólidas
- **Feature requests** indicando value add

### 8.3 Modelo de Monetização Futuro
```typescript
// Preparação para tiers
interface UserPlan {
  id: string;
  type: 'free' | 'pro' | 'business';
  maxTasks: number;
  maxProjects: number;
  hasAnalytics: boolean;
  hasIntegrations: boolean;
}

const PLAN_LIMITS = {
  free: { maxTasks: 50, maxProjects: 3 },
  pro: { maxTasks: -1, maxProjects: -1 },
  business: { maxTasks: -1, maxProjects: -1 }
};
```

## 9. Implementação Imediata

### 9.1 Setup Inicial (Esta Semana)
```bash
# 1. Criar projeto
npm create vite@latest timecraft -- --template react-ts
cd timecraft

# 2. Instalar dependências essenciais Magic UI
npm install @supabase/supabase-js
npm install @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install date-fns

# 3. Setup Magic UI stack
npm install tailwindcss@next
npm install framer-motion @headlessui/react
npm install lucide-react class-variance-authority
npm install clsx tailwind-merge

# 4. PWA setup
npm install vite-plugin-pwa workbox-window
```

### 9.2 Estrutura de Pastas Inicial
```
src/
├── components/
│   ├── ui/                 # Base UI components
│   ├── magic/              # Magic UI components
│   └── layout/             # Layout components
├── features/
│   ├── auth/
│   ├── tasks/
│   ├── calendar/
│   └── habits/
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── types.ts
├── stores/
│   └── auth.ts
└── pages/
    ├── Dashboard.tsx
    ├── Tasks.tsx
    └── Calendar.tsx
```

### 9.3 Exemplo de Integração Prática

#### 9.3.1 Fluxo Completo: Nota → Tarefa → Meta
```typescript
// 1. Capture rápido com Magic UI
import { AnimatedInput } from "@/components/magic/animated-input"

const note = await createNote({
  content: "Estudar React Testing Library para melhorar qualidade do código",
  type: "quick"
});

// 2. Process durante review
const task = await convertNoteToTask(note.id, {
  title: "Estudar React Testing Library",
  project: "Skill Development",
  estimatedMinutes: 120,
  goalId: "improve-coding-skills-2024"
});

// 3. Link automático criado
await createNoteLink({
  noteId: note.id,
  linkedType: "task",
  linkedId: task.id
});

// 4. Progress tracking automático
await updateGoalProgress("improve-coding-skills-2024");
```

#### 9.3.2 Dashboard Integration
```typescript
import { GradientCard } from "@/components/magic/gradient-card"
import { ProgressRing } from "@/components/magic/progress-ring"
import { AnimatedList } from "@/components/magic/animated-list"

const DashboardView = () => {
  const todaysTasks = useTasks({ dueDate: today });
  const activeGoals = useGoals({ status: 'active' });
  const unprocessedNotes = useNotes({ type: 'quick', processed: false });
  const habitsDue = useHabits({ due: today });

  return (
    <div className="dashboard-grid">
      <QuickCapture />
      <GradientCard>
        <AnimatedList>
          <TasksList tasks={todaysTasks} showGoalProgress />
        </AnimatedList>
      </GradientCard>
      <GradientCard>
        <GoalsProgress goals={activeGoals} />
      </GradientCard>
      <ProgressRing value={habitsCompletion}>
        <HabitsTracker habits={habitsDue} />
      </ProgressRing>
      <NotesInbox notes={unprocessedNotes} />
    </div>
  );
};
```

## 10. Métricas de Sucesso MVP

### 10.1 Pessoal (Primeiro Tester)
- ✅ **Uso diário** por 30+ dias consecutivos
- ✅ **>80% completion rate** das tarefas criadas
- ✅ **>5 notas capturadas** por semana (GTD capture working)
- ✅ **Weekly review** completado por 4+ semanas
- ✅ **Pelo menos 3 metas ativas** com progresso trackado
- ✅ **<3 clicks** para ações principais (capture, task creation, etc.)
- ✅ **<2s load time** em mobile

### 10.2 Funcionalidades (Validação GTD/PARA)
- ✅ **Note → Task conversion** usado pelo menos 10x
- ✅ **PARA categorization** de 80%+ das notas
- ✅ **Goal-task linking** em 60%+ das tarefas importantes
- ✅ **Search functionality** usado semanalmente
- ✅ **Habit-goal connection** estabelecida para hábitos principais

### 10.3 Técnicas
- ✅ **>90% uptime** na Vercel
- ✅ **<500ms** response time médio
- ✅ **Zero data loss** (backup automático)
- ✅ **PWA score >90** no Lighthouse
- ✅ **Offline functionality** working para capture

### 10.4 Transição para Beta
- ✅ **3 meses** de uso pessoal estável
- ✅ **GTD workflow** completamente implementado
- ✅ **PARA system** funcionando com linking
- ✅ **5+ beta testers** onboardados com sucesso
- ✅ **Weekly review** automático funcionando
- ✅ **Analytics** básicos para tracking de uso

Este MVP atualizado implementa corretamente os frameworks GTD e PARA Method através de um sistema integrado de notas, tarefas, metas e hábitos, utilizando **Magic UI** como stack principal para interfaces modernas e animações fluidas.

## Principais Mudanças na Stack UI

### 🎨 **Magic UI como Stack Principal**
- **Animações avançadas** com Framer Motion integrado
- **Componentes glassmorphism** para modernidade
- **Gradients inteligentes** para hierarquia visual
- **Micro-interações** que aumentam engajamento

### 🚀 **Performance Otimizada**
- **Tailwind v4** para melhor performance
- **Tree shaking automático** dos componentes não utilizados
- **Bundle size reduzido** comparado ao Shadcn/ui
- **Loading states** mais fluidos

### ✨ **Experiência Premium**
- **Floating elements** para quick capture
- **Progress rings** para hábitos e metas
- **Smooth transitions** entre estados
- **Backdrop blur** para depth e modernidade