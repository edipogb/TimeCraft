# AGENTS.md - TimeCraft  
*Last updated 2025-01-15*  

> **purpose** – Este arquivo é o manual de integração para todo assistente de IA (Claude, Cursor, GPT, etc.) e todo desenvolvedor que edita este repositório.  
> Ele codifica nossos padrões de código, diretrizes e truques de workflow para que a *parte humana 30%* (arquitetura, testes, julgamento de domínio) permaneça nas mãos humanas.[^1]

---

## 0. Visão Geral do Projeto

TimeCraft é uma aplicação pessoal de produtividade que unifica gestão de tarefas, agenda, hábitos e metas em uma experiência integrada. Implementa metodologias GTD (Getting Things Done) e PARA Method com interface moderna e PWA nativo. Componentes principais:

- **src/features**: Módulos organizados por funcionalidade (tasks, goals, notes, habits, calendar)
- **src/components**: Componentes reutilizáveis UI (Shadcn/ui + Magic UI)
- **src/lib**: Configurações, utilitários e helpers (Supabase, GTD, PARA)
- **src/stores**: Gerenciamento de estado global (Zustand)
- **src/hooks**: Hooks customizados para lógica reutilizável

**Regra de ouro**: Quando incerto sobre detalhes de implementação ou requisitos, SEMPRE consulte o desenvolvedor ao invés de fazer suposições.

---

## 1. Regras de ouro não-negociáveis

| #: | IA *pode* fazer                                                            | IA *NÃO deve* fazer                                                                    |
|---|------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| G-0 | Sempre que incerto sobre algo relacionado ao projeto, pergunte ao desenvolvedor para esclarecimento antes de fazer mudanças.    |  ❌ Escrever mudanças ou usar ferramentas quando não tem certeza sobre algo específico do projeto, ou se não tem contexto para uma feature/decisão específica. |
| G-1 | Gerar código **apenas dentro** de diretórios de source relevantes (ex: `src/features/`, `src/components/`, `src/lib/`) ou arquivos explicitamente indicados.    | ❌ Tocar em `tests/`, `docs/PRD.md`, ou qualquer arquivo `*.test.ts` / `*.spec.ts` (humanos controlam testes & specs). |
| G-2 | Adicionar/atualizar **comentários âncora `AIDEV-NOTE:`** próximo ao código editado não-trivial. | ❌ Deletar ou corromper comentários `AIDEV-` existentes.                                     |
| G-3 | Seguir configurações de lint/estilo (`eslint.config.js`, `.prettierrc`, `tailwind.config.js`). Usar o linter configurado do projeto ao invés de reformatar código manualmente. | ❌ Reformatar código para qualquer outro estilo.                                               |
| G-4 | Para mudanças >300 LOC ou >3 arquivos, **pedir confirmação**.            | ❌ Refatorar módulos grandes sem orientação humana.                                     |
| G-5 | Manter-se dentro do contexto da tarefa atual. Informar o dev se seria melhor começar do zero.                                  | ❌ Continuar trabalho de um prompt anterior após "nova tarefa" – iniciar sessão fresh.      |

---

## 2. Comandos de build, teste & utilitários

Use comandos `npm` para consistência (garantem variáveis de ambiente e configuração corretas).

```bash
# Desenvolvimento, lint, type-check, test, build
npm run dev          # Vite dev server com hot reload
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run type-check   # TypeScript check sem emit
npm run format       # Prettier format
npm run format:check # Prettier check
npm run test         # Vitest unit tests
npm run test:ui      # Vitest UI interface
npm run test:e2e     # Playwright E2E tests (futuro)
```

Para scripts TypeScript simples: `npx tsx scripts/script-name.ts` (garantir CWD correto).

---

## 3. Padrões de código

*   **Frontend**: React 18+, TypeScript 5+, Vite, `async/await` preferido.
*   **Formatação**: Prettier com linhas de 100 chars, aspas duplas, imports organizados.
*   **Tipagem**: Estrita (modelos Zod + TypeScript); `import type` para tipos.
*   **Nomenclatura**: `camelCase` (funções/variáveis), `PascalCase` (componentes/tipos), `SCREAMING_SNAKE` (constantes).
*   **Tratamento de Erro**: Error boundaries; try/catch para async; toast notifications.
*   **Documentação**: JSDoc para funções/componentes públicos complexos.
*   **Testes**: Arquivos de teste separados com padrão `*.test.ts`.

**Padrões de tratamento de erro**:
- Use error boundaries para componentes que carregam dados
- Catch erros específicos, não `Error` genérico
- Use toast notifications para feedback ao usuário
- Para código async, sempre trate erros adequadamente

Exemplo:
```typescript
import { toast } from 'sonner'
import { createTarefa } from '@/lib/api'

async function handleCreateTask(data: TaskData) {
  try {
    const task = await createTarefa(data)
    toast.success('Tarefa criada com sucesso!')
    return task
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    toast.error('Erro ao criar tarefa. Tente novamente.')
    throw error
  }
}
```

---

## 4. Layout do projeto & Componentes principais

| Diretório                         | Descrição                                       |
| --------------------------------- | ------------------------------------------------- |
| `src/features/`               | Módulos organizados por funcionalidade (tasks, goals, notes, habits, calendar, dashboard, auth)             |
| `src/components/ui/`          | Componentes Shadcn/ui (auto-gerados)     |
| `src/components/magic/`       | Componentes Magic UI customizados            |
| `src/components/shared/`      | Componentes compartilhados (QuickCapture, etc)   |
| `src/components/layout/`      | Layouts da aplicação (AppLayout, Sidebar, etc)            |
| `src/lib/`                    | Configurações, utils, validações (Supabase, GTD, PARA) |
| `src/stores/`                 | Stores Zustand para estado global                 |
| `src/hooks/`                  | Hooks customizados reutilizáveis                 |
| `src/types/`                  | **Source-of-truth** para tipos TypeScript |
| `src/pages/`                  | Componentes de página/rota                      |

Veja `README.md` para diagrama completo da arquitetura.

**Modelos de domínio principais**:
- **Tarefa**: Itens acionáveis com prioridade, status e vinculação a metas
- **Meta**: Objetivos com tracking de progresso e marcos
- **Nota**: Sistema de captura rápida com organização PARA
- **Hábito**: Tracking de consistência com streaks
- **Usuário**: Perfil e configurações via Supabase Auth

---

## 5. Comentários âncora

Adicione comentários especialmente formatados através do codebase, onde apropriado, para você mesmo como conhecimento inline que pode ser facilmente `grep`ado.

### Diretrizes:

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, ou `AIDEV-QUESTION:` (prefixo maiúsculo) para comentários direcionados a IA e desenvolvedores.
- Mantenha-os concisos (≤ 120 chars).
- **Importante:** Antes de escanear arquivos, sempre primeiro tente **localizar âncoras existentes** `AIDEV-*` em subdiretórios relevantes.
- **Atualize âncoras relevantes** ao modificar código associado.
- **Não remova `AIDEV-NOTE`s** sem instrução humana explícita.
- Adicione comentários âncora relevantes sempre que um arquivo ou pedaço de código for:
  * muito longo, ou
  * muito complexo, ou
  * muito importante, ou
  * confuso, ou
  * possa ter um bug não relacionado à tarefa atual.

Exemplo:
```typescript
// AIDEV-NOTE: GTD core-flow; Quick Capture sempre disponível (ver PRD seção 3.4)
export function QuickCapture({ trigger }: QuickCaptureProps) {
  // AIDEV-TODO: Implementar auto-save para evitar perda de dados
  ...
}
```

---

## 6. Disciplina de commit

*   **Commits granulares**: Uma mudança lógica por commit.
*   **Tag commits gerados por IA**: ex: `feat: otimizar dashboard loading [AI]`.
*   **Mensagens claras**: Explique o *porquê*; link para issues/PRDs se arquitetural.
*   **Use `git worktree`** para branches paralelas/longas (ex: `git worktree add ../wip-foo -b wip-foo`).
*   **Revise código gerado por IA**: Nunca faça merge de código que não entende.

---

## 7. Modelos de API & tipagem

*   Para modificar modelos da API (ex: tipos em `src/types/`), **edite arquivos TypeScript** em `src/types/app.ts`.
*   **Regenere tipos Supabase** após mudanças no schema: `npm run db:types` (gera `src/types/database.ts`).
*   **NÃO edite manualmente** arquivos gerados (ex: `database.ts`) pois serão sobrescritos.

**Padrões de API**:
```typescript
// Definição de service
export async function createTarefa(data: TarefaFormData): Promise<Tarefa> {
  const { data: tarefa, error } = await supabase
    .from('tarefas')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return tarefa
}

// Hook customizado
export function useTarefas() {
  return useQuery({
    queryKey: ['tarefas'],
    queryFn: fetchTarefas,
    staleTime: 5 * 60 * 1000 // 5 minutos
  })
}
```

---

## 8. Workflow GTD e validações (features)

*   Sistema GTD implementado via Quick Capture e processamento de notas.
*   Use `validateGTDCapture()` de `src/lib/gtd-helpers.ts` para validações estáticas.
*   Notas têm acesso a categorização PARA automática e manual.
*   Teste validações: `npx tsx src/lib/test-gtd.ts`
*   Validação de tarefas lida com dados raw e modelos Zod.
*   Links universais entre tarefas, metas, notas e hábitos via `note_links` table.

**Exemplo de expressão GTD**:
```typescript
// Auto-detecção de tipo baseada em conteúdo
const taskKeywords = ['fazer', 'completar', 'terminar', 'enviar']
const isActionable = taskKeywords.some(keyword => 
  content.toLowerCase().includes(keyword)
)

// Sugestão de categoria PARA
const category = suggestPARACategory(content) // 'projetos' | 'areas' | 'recursos' | 'arquivo'
```

---

## 9. Framework de testes Vitest

*   Use nomes de teste descritivos: `test('deve criar tarefa com dados válidos')`.
*   Ative ambiente Node: configurado em `vitest.config.ts`.
*   Garanta diretório de trabalho correto e importações relativas.
*   Filtre testes: `npm run test -- --grep "padrão_para_buscar"`.
*   Limite falhas para feedback rápido: `npm run test -- --reporter=verbose`.

---

## 10. Arquivos AGENTS.md específicos de diretório

*   **Sempre verifique arquivos `AGENTS.md` em diretórios específicos** antes de trabalhar em código dentro deles. Estes arquivos contêm contexto direcionado.
*   Se um `AGENTS.md` de diretório estiver desatualizado ou incorreto, **atualize-o**.
*   Se você fizer mudanças significativas na estrutura, padrões ou detalhes críticos de implementação de um diretório, **documente isso em seu `AGENTS.md`**.
*   Se um diretório não tem `AGENTS.md` mas contém lógica complexa ou padrões que vale documentar para IA/humanos, **sugira criar um**.

---

## 11. Armadilhas comuns

*   Misturar sintaxe Vitest & Jest (Vitest usa `test()` e `expect()`, sem fixtures especiais).
*   Esquecer de usar `npm run dev` para development server.
*   Diretório de trabalho (CWD) errado para comandos (garanta que está na raiz do projeto).
*   Refatorações grandes de IA em commit único (dificulta `git bisect`).
*   Delegar escrita de teste/spec inteiramente à IA (pode levar a falsa confiança).
*   **Nota sobre imports**: Use imports relativos para código do projeto, absolutos com `@/` para src.

---

## 12. Convenções de versionamento

TimeCraft usa Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`) conforme especificado no `package.json`.

*   **MAJOR**: Para mudanças incompatíveis de API.
*   **MINOR**: Para adicionar funcionalidade de forma backward-compatible.
*   **PATCH**: Para correções backward-compatible.

---

## 13. Referências de arquivos & padrões principais

Esta seção fornece ponteiros para arquivos importantes e padrões comuns no codebase.

*   **Definições de componentes React**:
    *   Localização: `src/features/*/components/` e `src/components/`
    *   Padrão: Componentes funcionais, TypeScript, hooks, props tipadas.
*   **Stores Zustand**:
    *   Localização: `src/stores/`
    *   Padrão: Estado tipado, actions assíncronas, persistência quando necessário.
*   **Modelos Zod**:
    *   Localização: `src/lib/validations.ts`
    *   Padrão: Validação de dados, serialização, type inference.
*   **Hooks customizados**:
    *   Localização: `src/hooks/` e `src/features/*/hooks/`
    *   Padrão: Lógica reutilizável, side effects, state management local.
*   **Configuração Supabase**:
    *   Localização: `src/lib/supabase.ts`
    *   Padrão: Cliente tipado, RLS, auth, realtime subscriptions.

---

## 14. Terminologia específica do domínio

*   **Tarefa**: Item acionável com prioridade, status, projeto e vinculação a metas. Modelo core em `src/types/app.ts`.
*   **Meta**: Objetivo com tracking de progresso, marcos e deadline. Suporta tipos resultado/processo/aprendizado.
*   **Nota**: Captura rápida de informações com categorização PARA e linking universal. Core do sistema GTD.
*   **Hábito**: Atividade recorrente com tracking de streak e vinculação a metas de processo.
*   **Quick Capture**: Botão flutuante sempre disponível para captura rápida seguindo metodologia GTD.
*   **PARA**: Método de organização (Projects/Areas/Resources/Archive) implementado nas notas.
*   **GTD**: Getting Things Done - metodologia de produtividade implementada via capture → clarify → organize → reflect → engage.
*   **Shadcn/ui**: Biblioteca de componentes UI copiáveis e customizáveis usado como base.
*   **Magic UI**: Componentes avançados com animações para experiência premium.
*   **Zustand**: Biblioteca de state management leve e performática.
*   **TanStack Query**: Biblioteca para data fetching com cache e sincronização.

---

## 15. Meta: Diretrizes para atualizar arquivos AGENTS.md

### Elementos que seriam úteis adicionar:

1. **Fluxograma de decisão**: Árvore de decisão simples para "quando usar X vs Y" para escolhas arquiteturais principais.
2. **Links de referência**: Links para arquivos principais ou exemplos de implementação que demonstram best practices.
3. **Terminologia específica do domínio**: Pequeno glossário de termos específicos do projeto.
4. **Convenções de versionamento**: Como o projeto lida com versionamento, tanto para APIs quanto componentes internos.

### Preferências de formato:

1. **Syntax highlighting consistente**: Garantir que todos os blocos de código tenham tags de linguagem apropriadas (`typescript`, `bash`, etc.).
2. **Organização hierárquica**: Considerar usar numeração hierárquica para subseções para facilitar referência.
3. **Formato tabular para fatos principais**: As tabelas são muito úteis - mais dados estruturados em formato tabular seria valioso.
4. **Keywords ou tags**: Adicionar marcadores semânticos (como `#performance` ou `#gtd`) a certas seções ajudaria a localizar orientação relevante rapidamente.

[^1]: Este princípio enfatiza supervisão humana para aspectos críticos como arquitetura, testes e decisões específicas do domínio, garantindo que IA assista ao invés de ditar completamente o desenvolvimento.

---

## 16. Arquivos para NÃO modificar

Estes arquivos controlam quais arquivos devem ser ignorados por ferramentas de IA e sistemas de indexação:

*   `.gitignore`: Especifica arquivos que devem ser ignorados pelo Git, incluindo:
    *   Diretórios de build e distribuição (`dist/`, `build/`)
    *   Arquivos de ambiente e configuração (`.env*`)
    *   Cache e node_modules
    *   Arquivos de log
    *   Arquivos de IDE

*   `.eslintignore`: Controla quais arquivos são excluídos do ESLint:
    *   Arquivos gerados (`dist/`, `src/types/database.ts`)
    *   Configurações e cache
    *   Assets estáticos

**Nunca modifique estes arquivos de ignore** sem permissão explícita, pois são cuidadosamente configurados para otimizar performance do IDE enquanto garantem que todo código relevante seja devidamente indexado.

**Ao adicionar novos arquivos ou diretórios**, verifique estes padrões de ignore para garantir que seus arquivos sejam devidamente incluídos nas funcionalidades de indexação e assistência da IA.

---

## Workflow do Assistente de IA: Metodologia Passo-a-Passo

Quando responder a instruções do usuário, o assistente de IA (Claude, Cursor, GPT, etc.) deve seguir este processo para garantir clareza, correção e manutenibilidade:

1. **Consultar Orientação Relevante**: Quando o usuário der uma instrução, consulte as instruções relevantes dos arquivos `AGENTS.md` (tanto raiz quanto específicos de diretório) para a requisição.
2. **Esclarecer Ambiguidades**: Baseado no que você conseguiu reunir, veja se há necessidade de esclarecimentos. Se sim, faça perguntas direcionadas ao usuário antes de prosseguir.
3. **Quebrar & Planejar**: Quebre a tarefa em partes e trace um plano rough para executá-la, referenciando convenções do projeto e best practices.
4. **Tarefas Triviais**: Se o plano/requisição for trivial, prossiga e comece imediatamente.
5. **Tarefas Não-Triviais**: Caso contrário, apresente o plano ao usuário para revisão e itere baseado no feedback.
6. **Acompanhar Progresso**: Use uma lista de tarefas (internamente, ou opcionalmente em arquivo `TODOS.md`) para acompanhar progresso em tarefas multi-step ou complexas.
7. **Se Travado, Re-planejar**: Se ficar travado ou bloqueado, retorne ao passo 3 para reavaliar e ajustar seu plano.
8. **Atualizar Documentação**: Uma vez que a requisição do usuário seja cumprida, atualize comentários âncora relevantes (`AIDEV-NOTE`, etc.) e arquivos `AGENTS.md` nos arquivos e diretórios que você tocou.
9. **Revisão do Usuário**: Após completar a tarefa, peça ao usuário para revisar o que você fez, e repita o processo conforme necessário.
10. **Limites de Sessão**: Se a requisição do usuário não está diretamente relacionada ao contexto atual e pode ser seguramente iniciada em sessão fresh, sugira começar do zero para evitar confusão de contexto.