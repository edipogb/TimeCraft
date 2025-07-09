# TimeCraft

<div align="center">

![TimeCraft Logo](./docs/assets/logo.png)

**Personal Productivity Hub**

Uma aplicação moderna de produtividade pessoal que unifica gestão de tarefas, agenda, hábitos e metas em uma experiência integrada, implementando metodologias GTD e PARA Method.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Demo](https://timecraft.vercel.app) • [Documentação](./docs/) • [Roadmap](./docs/ROADMAP.md)

</div>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Características Principais](#-características-principais)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Setup e Instalação](#-setup-e-instalação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Metodologias Implementadas](#-metodologias-implementadas)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Visão Geral

TimeCraft é uma aplicação **Progressive Web App (PWA)** que combina as melhores práticas de produtividade pessoal em uma interface moderna e intuitiva. Desenvolvido com foco na metodologia **Getting Things Done (GTD)** de David Allen e **PARA Method** de Tiago Forte.

### Problema Resolvido

- **Fragmentação** entre múltiplas ferramentas de produtividade
- **Falta de insights** sobre padrões de produtividade pessoal
- **Complexidade** de interfaces que prejudicam uso consistente
- **Desalinhamento** entre calendário e gestão de tarefas

### Solução

Uma plataforma unificada que integra **tarefas**, **metas**, **notas**, **hábitos** e **calendário** com:
- **Quick Capture** sempre disponível (core GTD)
- **Sistema de linking** universal entre todas as entidades
- **Insights inteligentes** sobre produtividade
- **Interface moderna** com Shadcn/ui + Magic UI

---

## ✨ Características Principais

### 🧠 **Sistema GTD Completo**
- **Capture** → Quick Capture sempre disponível
- **Clarify** → Processamento automático e manual de notas
- **Organize** → Categorização PARA (Projects/Areas/Resources/Archive)
- **Reflect** → Weekly Review automático
- **Engage** → Dashboard integrado para execução

### 🔗 **Linking Universal**
- Conexões bidirecionais entre tarefas, metas, notas e hábitos
- Auto-vinculação baseada em contexto
- Rastreamento de relacionamentos complexos

### 📊 **Tracking Inteligente**
- Progresso de metas com milestones
- Streaks de hábitos com análise de consistência
- Insights de produtividade baseados em dados
- Time blocking automático

### 📱 **PWA Nativo**
- Funciona offline com sincronização automática
- Notificações push inteligentes
- Instalável como app nativo
- Performance otimizada para mobile

---

## 🏗️ Arquitetura

### Arquitetura Geral

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        A[PWA App] --> B[Components Layer]
        B --> C[Features Layer]
        C --> D[Stores Layer]
        D --> E[Services Layer]
    end
    
    subgraph "Backend (Supabase)"
        F[PostgreSQL Database]
        G[Authentication]
        H[Real-time Subscriptions]
        I[Storage]
    end
    
    subgraph "External Services"
        J[Google Calendar API]
        K[Calendly API]
        L[Web Push API]
    end
    
    E --> F
    E --> G
    E --> H
    A --> L
    C --> J
    C --> K
    
    style A fill:#e1f5fe
    style F fill:#f3e5f5
    style J fill:#fff3e0
```

### Arquitetura de Features

```mermaid
graph LR
    subgraph "Core Features"
        A[Quick Capture] --> B[Notes System]
        B --> C[Tasks Management]
        C --> D[Goals Tracking]
        D --> E[Habits System]
        E --> F[Calendar Integration]
    end
    
    subgraph "Cross-cutting"
        G[Linking System]
        H[GTD Workflow]
        I[PARA Organization]
        J[Analytics Engine]
    end
    
    A -.-> G
    B -.-> H
    C -.-> I
    D -.-> J
    
    style A fill:#4caf50
    style G fill:#ff9800
```

### Fluxo de Dados

```mermaid
sequenceDiagram
    participant U as User
    participant QC as Quick Capture
    participant GTD as GTD Processor
    participant DB as Supabase
    participant UI as Dashboard
    
    U->>QC: Capture "Estudar React"
    QC->>GTD: Process content
    GTD->>GTD: Auto-detect type (task)
    GTD->>DB: Store as task
    DB-->>UI: Real-time update
    UI->>U: Show in dashboard
    
    Note over GTD: PARA categorization
    Note over DB: Row Level Security
    Note over UI: Optimistic updates
```

### Estrutura de Banco de Dados

```mermaid
erDiagram
    usuarios ||--o{ tarefas : possui
    usuarios ||--o{ metas : possui
    usuarios ||--o{ notas : possui
    usuarios ||--o{ habitos : possui
    
    tarefas }o--|| metas : vinculada_a
    tarefas }o--|| notas : originada_de
    
    metas ||--o{ marcos : possui
    
    notas ||--o{ vinculos_notas : tem
    vinculos_notas }o--|| tarefas : referencia
    vinculos_notas }o--|| metas : referencia
    vinculos_notas }o--|| habitos : referencia
    
    habitos ||--o{ conclusoes_habito : possui
    habitos }o--|| metas : contribui_para
    
    usuarios {
        uuid id
        string email
        string nome_completo
        timestamp criado_em
    }
    
    tarefas {
        uuid id
        string titulo
        string status
        string prioridade
        date data_vencimento
        uuid meta_id
        uuid nota_id
    }
    
    notas {
        uuid id
        text conteudo
        string tipo
        string categoria_para
        string[] tags
    }
```

---

## 🛠️ Tecnologias

### Frontend Core
- **[React 18](https://reactjs.org/)** - UI library com Concurrent Features
- **[TypeScript 5](https://typescriptlang.org/)** - Type safety e DX
- **[Vite](https://vitejs.dev/)** - Build tool e dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS

### UI/UX
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes acessíveis e customizáveis
- **[Magic UI](https://magicui.design/)** - Componentes avançados com animações
- **[Lucide React](https://lucide.dev/)** - Ícones SVG otimizados
- **[Framer Motion](https://framer.com/motion/)** - Animações fluidas

### Estado e Dados
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management leve
- **[TanStack Query](https://tanstack.com/query)** - Data fetching e cache
- **[React Hook Form](https://react-hook-form.com/)** - Formulários performáticos
- **[Zod](https://zod.dev/)** - Schema validation

### Backend/Database
- **[Supabase](https://supabase.com/)** - Backend completo
  - PostgreSQL com RLS
  - Authentication
  - Real-time subscriptions
  - Storage
- **[Date-fns](https://date-fns.org/)** - Manipulação de datas

### PWA/Mobile
- **[Vite PWA](https://vite-pwa-org.netlify.app/)** - Service Worker e manifest
- **[Workbox](https://developer.chrome.com/docs/workbox/)** - Caching strategies

### Desenvolvimento
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code quality
- **[Vitest](https://vitest.dev/)** - Unit testing
- **[Playwright](https://playwright.dev/)** - E2E testing (futuro)

---

## 📁 Estrutura do Projeto

```
timecraft/
├── public/                     # Assets estáticos
│   ├── icon-192.png           # PWA icons
│   └── manifest.json          # PWA manifest
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── magic/            # Magic UI components
│   │   ├── shared/           # Componentes compartilhados
│   │   └── layout/           # Layouts da aplicação
│   ├── features/             # Módulos por funcionalidade
│   │   ├── auth/             # Autenticação
│   │   ├── tasks/            # Gestão de tarefas
│   │   ├── goals/            # Gestão de metas
│   │   ├── notes/            # Sistema de notas (GTD)
│   │   ├── habits/           # Tracking de hábitos
│   │   ├── calendar/         # Integração de calendário
│   │   └── dashboard/        # Dashboard principal
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Configurações e utils
│   │   ├── supabase.ts       # Cliente Supabase
│   │   ├── gtd-helpers.ts    # Helpers GTD
│   │   ├── para-helpers.ts   # Helpers PARA
│   │   ├── utils.ts          # Utilitários gerais
│   │   ├── constants.ts      # Constantes da app
│   │   └── validations.ts    # Schemas Zod
│   ├── stores/               # Zustand stores
│   │   ├── auth-store.ts     # Estado de autenticação
│   │   ├── tasks-store.ts    # Estado de tarefas
│   │   ├── goals-store.ts    # Estado de metas
│   │   ├── notes-store.ts    # Estado de notas
│   │   └── app-store.ts      # Estado global da app
│   ├── types/                # Definições TypeScript
│   │   ├── database.ts       # Tipos gerados do Supabase
│   │   ├── app.ts            # Tipos específicos da app
│   │   └── index.ts          # Re-exports
│   ├── pages/                # Componentes de rota
│   │   ├── dashboard.tsx     # Dashboard principal
│   │   ├── tasks.tsx         # Página de tarefas
│   │   ├── goals.tsx         # Página de metas
│   │   ├── notes.tsx         # Página de notas
│   │   ├── habits.tsx        # Página de hábitos
│   │   ├── calendar.tsx      # Página de calendário
│   │   └── settings.tsx      # Configurações
│   └── styles/               # Estilos globais
│       └── globals.css       # CSS global + Tailwind
├── docs/                     # Documentação
│   ├── PRD.md               # Product Requirements Document
│   ├── AGENTS.md            # Guia para assistentes IA
│   └── assets/              # Assets da documentação
├── tests/                    # Testes
│   ├── unit/                # Testes unitários
│   └── e2e/                 # Testes E2E (futuro)
├── .env.example             # Variáveis de ambiente exemplo
├── package.json             # Dependências e scripts
├── tailwind.config.js       # Configuração Tailwind
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── vitest.config.ts         # Configuração de testes
```

---

## 🚀 Setup e Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **npm** 9+
- **Conta Supabase** (free tier)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/timecraft.git
cd timecraft
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Configure o banco de dados

Execute o schema SQL fornecido no seu projeto Supabase:

```bash
# Copie o conteúdo de docs/database-schema.sql
# Cole no SQL Editor do Supabase Dashboard
```

### 5. Configure Shadcn/ui

```bash
npx shadcn-ui@latest init
```

Responda as configurações:
- TypeScript: **Yes**
- Style: **Default**
- Base color: **Slate**
- CSS file: **src/styles/globals.css**
- Import alias: **@/***

### 6. Instale componentes UI necessários

```bash
npx shadcn-ui@latest add button card input label
npx shadcn-ui@latest add textarea badge progress calendar
npx shadcn-ui@latest add sheet dialog command select
npx shadcn-ui@latest add dropdown-menu tabs toast sonner
```

### 7. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev          # Servidor de desenvolvimento (Vite)
npm run build        # Build para produção
npm run preview      # Preview do build local
```

### Qualidade de Código

```bash
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check apenas
npm run type-check   # TypeScript check sem emit
```

### Testes

```bash
npm run test         # Vitest unit tests
npm run test:ui      # Vitest UI interface
npm run test:watch   # Vitest watch mode
npm run test:coverage # Coverage report
```

### Database

```bash
npm run db:types     # Gerar tipos TypeScript do Supabase
npm run db:migrate   # Aplicar migrações (futuro)
```

### PWA

```bash
npm run build:pwa    # Build com PWA otimizado
npm run preview:pwa  # Preview PWA local
```

---

## 📈 Metodologias Implementadas

### Getting Things Done (GTD)

```mermaid
graph LR
    A[Capture] --> B[Clarify]
    B --> C[Organize]
    C --> D[Reflect]
    D --> E[Engage]
    E --> A
    
    A1[Quick Capture] -.-> A
    B1[Note Processing] -.-> B
    C1[PARA Method] -.-> C
    D1[Weekly Review] -.-> D
    E1[Dashboard] -.-> E
    
    style A fill:#4caf50
    style B fill:#2196f3
    style C fill:#ff9800
    style D fill:#9c27b0
    style E fill:#f44336
```

#### Implementação GTD

1. **Capture** - Quick Capture sempre disponível
   ```typescript
   // Botão flutuante global
   <QuickCapture />
   ```

2. **Clarify** - Processamento automático de notas
   ```typescript
   // Auto-detecção de tipo de conteúdo
   const type = detectContentType(text) // 'task' | 'note' | 'goal'
   ```

3. **Organize** - Sistema PARA integrado
   ```typescript
   // Categorização automática
   const category = suggestPARACategory(content)
   ```

4. **Reflect** - Weekly Review automático
   ```typescript
   // Notificação semanal + dashboard review
   const unprocessedNotes = useUnprocessedNotes()
   ```

5. **Engage** - Dashboard integrado para execução
   ```typescript
   // Context-based task lists
   const contextTasks = useTasksByContext('@computer')
   ```

### PARA Method

```mermaid
graph TB
    subgraph "PARA Organization"
        A[Projects] --> A1[Specific outcomes<br/>with deadline]
        B[Areas] --> B1[Ongoing responsibilities<br/>to maintain]
        C[Resources] --> C1[Topics of ongoing<br/>interest]
        D[Archive] --> D1[Inactive items from<br/>other categories]
    end
    
    subgraph "TimeCraft Implementation"
        E[Notes] --> A
        E --> B
        E --> C
        E --> D
        
        F[Tasks] --> A
        G[Goals] --> A
        G --> B
        H[Habits] --> B
    end
    
    style A fill:#4caf50
    style B fill:#2196f3
    style C fill:#ff9800
    style D fill:#9e9e9e
```

#### Implementação PARA

```typescript
// Auto-categorização baseada em conteúdo
export function suggestPARACategory(content: string): CategoriaPara {
  if (isActionableNote(content) && content.length > 50) {
    return 'projetos' // Specific outcome with multiple steps
  }
  
  if (hasOngoingKeywords(content)) {
    return 'areas' // Ongoing responsibility
  }
  
  if (hasLearningKeywords(content)) {
    return 'recursos' // Future reference
  }
  
  return isActionableNote(content) ? 'projetos' : 'recursos'
}
```

---

## 🔗 Integrações

### Google Calendar

```typescript
// Sincronização read-only implementada
const { data: events } = await syncGoogleCalendar()
```

### Calendly (Futuro)

```typescript
// Integração para agendamentos
const { data: bookings } = await fetchCalendlyBookings()
```

### Web Push API

```typescript
// Notificações nativas
const registration = await navigator.serviceWorker.register('/sw.js')
await registration.showNotification(title, options)
```

---

## 🎨 Design System

### Paleta de Cores

```css
:root {
  /* Primary - Blue */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-900: #1e3a8a;
  
  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #06b6d4;
}
```

### Componentes Base

- **Shadcn/ui** - Componentes acessíveis e customizáveis
- **Magic UI** - Animações e micro-interações
- **Design tokens** - Consistência visual
- **Dark/Light mode** - Suporte completo

---

## 📊 Performance

### Métricas Alvo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: > 90

### Otimizações Implementadas

- **Code splitting** automático por rota
- **Tree shaking** para reduzir bundle size
- **Service Worker** para cache inteligente
- **Lazy loading** de componentes pesados
- **Image optimization** automática

---

## 🧪 Testes

### Estratégia de Testes

```mermaid
pyramid
    title Testing Strategy
    
    section E2E Tests
        Playwright : 5
    
    section Integration Tests
        Vitest + Testing Library : 15
    
    section Unit Tests
        Vitest : 80
```

### Exemplo de Teste

```typescript
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { QuickCapture } from '@/components/shared/quick-capture'

test('deve detectar tipo de conteúdo automaticamente', async () => {
  render(<QuickCapture />)
  
  const input = screen.getByPlaceholderText(/digite qualquer coisa/i)
  await user.type(input, 'fazer compras no supermercado')
  
  expect(screen.getByText(/tarefa/i)).toBeInTheDocument()
})
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Configuração de Environment

No dashboard da Vercel, adicione:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### PWA Setup

O build automaticamente gera:
- Service Worker otimizado
- Manifest.json configurado
- Ícones em múltiplos tamanhos
- Offline fallbacks

---

## 🤝 Contribuição

### Workflow de Desenvolvimento

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. **Commit** suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. **Push** para a branch (`git push origin feature/amazing-feature`)
5. **Abra** um Pull Request

### Padrões de Commit

Usamos [Conventional Commits](https://conventionalcommits.org/):

```bash
feat: adicionar quick capture para metas
fix: corrigir sincronização com google calendar
docs: atualizar readme com novos scripts
style: formatar código com prettier
refactor: reorganizar estrutura de stores
test: adicionar testes para gtd helpers
```

### Code Review

- ✅ Código segue padrões ESLint/Prettier
- ✅ Componentes são testáveis e acessíveis
- ✅ TypeScript sem `any` types
- ✅ Performance mantida (Lighthouse > 90)
- ✅ PWA funcionalidades preservadas

### Configuração para Desenvolvimento

```bash
# Setup completo para contribuidores
git clone https://github.com/seu-usuario/timecraft.git
cd timecraft
npm install
cp .env.example .env.local
# Configurar credenciais Supabase
npm run dev
```

---

## 📋 Roadmap

### ✅ MVP (v1.0) - Concluído
- [x] Sistema GTD completo
- [x] CRUD de tarefas, metas, notas, hábitos
- [x] Quick Capture universal
- [x] Dashboard integrado
- [x] PWA básico

### 🚧 v1.1 - Em Desenvolvimento
- [ ] Google Calendar sync (read/write)
- [ ] Time blocking automático
- [ ] Notificações inteligentes
- [ ] Temas customizáveis

### 🔮 v1.2 - Planejado
- [ ] Colaboração básica
- [ ] Analytics avançados
- [ ] Calendly integration
- [ ] Mobile app nativo

### 🌟 v2.0 - Futuro
- [ ] IA para sugestões personalizadas
- [ ] API pública
- [ ] Integrações com Slack/Notion
- [ ] Multi-workspace

---

## 📖 Documentação Adicional

- **[Product Requirements Document](./docs/PRD.md)** - Especificação completa do produto
- **[AGENTS.md](./AGENTS.md)** - Guia para assistentes de IA
- **[Database Schema](./docs/database-schema.sql)** - Schema completo do banco
- **[API Documentation](./docs/api.md)** - Documentação da API interna
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - Guia detalhado para contribuição

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- **[David Allen](https://gettingthingsdone.com/)** pela metodologia GTD
- **[Tiago Forte](https://fortelabs.co/)** pelo PARA Method
- **[Shadcn](https://ui.shadcn.com/)** pelos componentes UI incríveis
- **[Supabase](https://supabase.com/)** pela plataforma backend completa
- **Comunidade Open Source** pelas ferramentas que tornaram este projeto possível

---

<div align="center">

**[⬆ Voltar ao topo](#timecraft)**

Feito com ❤️ e ☕ por [Édipo Bezerra](https://github.com/edipogb)

[Website](https://timecraft.vercel.app) • [Twitter](https://twitter.com/seu-usuario) • [LinkedIn](https://linkedin.com/in/seu-usuario)

</div>