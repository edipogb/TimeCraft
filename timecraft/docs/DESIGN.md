# TimeCraft - Design System & Padrões Visuais

## 🎨 **Visão Geral do Design**

O TimeCraft adota uma abordagem visual **moderna e minimalista** com foco em **produtividade sem distrações**. O design combina elementos de **glassmorphism**, **gradientes sutis** e **micro-animações** para criar uma experiência premium e fluida.

### **Filosofia Visual**
- **Clarity over Complexity**: Interface limpa que não compete com o conteúdo
- **Motion with Purpose**: Animações que guiam e informam, nunca distraem
- **Premium Feel**: Sensação de app nativo moderno
- **Accessibility First**: Contrastes adequados e navegação clara

---

## 🌈 **Sistema de Cores**

### **Paleta Principal**

#### **Primary (Blue Gradient)**
```
Blue 50:  #eff6ff  (backgrounds, hover states)
Blue 100: #dbeafe  (light accents)
Blue 500: #3b82f6  (primary actions, links)
Blue 600: #2563eb  (hover states)
Blue 900: #1e3a8a  (text emphasis, dark accents)
```

#### **Semantic Colors**
```
Success:  #10b981  (completed tasks, positive feedback)
Warning:  #f59e0b  (overdue items, caution states)
Error:    #ef4444  (destructive actions, errors)
Info:     #06b6d4  (informational messages, tips)
```

#### **Neutral Palette**
```
Gray 50:  #f9fafb  (light backgrounds)
Gray 100: #f3f4f6  (subtle backgrounds)
Gray 200: #e5e7eb  (borders, dividers)
Gray 300: #d1d5db  (disabled states)
Gray 400: #9ca3af  (placeholder text)
Gray 500: #6b7280  (secondary text)
Gray 600: #4b5563  (primary text light theme)
Gray 700: #374151  (emphasis text)
Gray 800: #1f2937  (dark text)
Gray 900: #111827  (darkest text)
```

### **Theme Variants**

#### **Light Theme**
- **Background Primary**: `#ffffff` (Pure white)
- **Background Secondary**: `#f9fafb` (Gray 50)
- **Background Tertiary**: `#f3f4f6` (Gray 100)
- **Text Primary**: `#1f2937` (Gray 800)
- **Text Secondary**: `#6b7280` (Gray 500)
- **Border**: `#e5e7eb` (Gray 200)
- **Shadow**: `rgba(0, 0, 0, 0.1)`

#### **Dark Theme**
- **Background Primary**: `#0f172a` (Slate 900)
- **Background Secondary**: `#1e293b` (Slate 800)
- **Background Tertiary**: `#334155` (Slate 700)
- **Text Primary**: `#f1f5f9` (Slate 100)
- **Text Secondary**: `#94a3b8` (Slate 400)
- **Border**: `#475569` (Slate 600)
- **Shadow**: `rgba(0, 0, 0, 0.3)`

### **Glassmorphism Effects**
```
Light Glass: rgba(255, 255, 255, 0.8) + backdrop-blur-lg
Dark Glass:  rgba(15, 23, 42, 0.8) + backdrop-blur-lg
Border:      rgba(255, 255, 255, 0.2) em light / rgba(241, 245, 249, 0.1) em dark
```

---

## 📝 **Tipografia**

### **Font Family**
- **Primary**: `Inter` (variável weight)
- **Fallback**: `system-ui, -apple-system, sans-serif`
- **Monospace**: `'SF Mono', Consolas, monospace` (para código/dados)

### **Type Scale**

#### **Headlines**
- **H1**: 36px / 40px (2.25rem) - font-weight: 700 - Letter-spacing: -0.025em
- **H2**: 30px / 36px (1.875rem) - font-weight: 600 - Letter-spacing: -0.025em
- **H3**: 24px / 32px (1.5rem) - font-weight: 600 - Letter-spacing: -0.025em
- **H4**: 20px / 28px (1.25rem) - font-weight: 600

#### **Body Text**
- **Large**: 18px / 28px (1.125rem) - font-weight: 400
- **Base**: 16px / 24px (1rem) - font-weight: 400
- **Small**: 14px / 20px (0.875rem) - font-weight: 400
- **XSmall**: 12px / 16px (0.75rem) - font-weight: 500

#### **Interface Text**
- **Button**: 14px / 20px - font-weight: 500
- **Label**: 14px / 20px - font-weight: 500
- **Caption**: 12px / 16px - font-weight: 400
- **Overline**: 12px / 16px - font-weight: 600 - Letter-spacing: 0.05em - Uppercase

---

## 🎭 **Logo & Branding**

### **Logo Principal**
- **Symbol**: ⚡ (Lightning bolt) + 🎯 (Target) combinados em ícone custom
- **Wordmark**: "TimeCraft" em Inter Bold
- **Tagline**: "Personal Productivity Hub"

### **Variações do Logo**
- **Full Logo**: Symbol + Wordmark (horizontal)
- **Icon Only**: Apenas o symbol (para favicon, mobile)
- **Wordmark Only**: Apenas texto (para contextos minimalistas)

### **Especificações**
- **Tamanhos mínimos**: 24px altura para icon, 120px largura para full logo
- **Cores**: Primary blue (#3b82f6) ou white/dark conforme background
- **Espaçamento**: Clear space = altura do logo em todos os lados

### **Favicon & PWA Icons**
- **16x16**: Icon simplificado
- **32x32**: Icon com mais detalhes
- **192x192**: PWA icon completo
- **512x512**: PWA icon alta resolução
- **Background**: Gradient blue (#3b82f6 → #2563eb)

---

## 🏗️ **Layout & Grid System**

### **Breakpoints**
```
Mobile:     320px - 767px
Tablet:     768px - 1023px
Desktop:    1024px - 1439px
Large:      1440px+
```

### **Container Widths**
```
Mobile:     100% (padding: 16px)
Tablet:     100% (padding: 24px)
Desktop:    1200px max-width (padding: 32px)
Large:      1400px max-width (padding: 40px)
```

### **Spacing Scale**
```
4px   (0.25rem) - xs
8px   (0.5rem)  - sm
12px  (0.75rem) - 
16px  (1rem)    - base
20px  (1.25rem) - 
24px  (1.5rem)  - lg
32px  (2rem)    - xl
40px  (2.5rem)  - 2xl
48px  (3rem)    - 3xl
64px  (4rem)    - 4xl
```

### **Layout Principal**
- **Sidebar**: 280px fixa em desktop, collapsible em tablet
- **Header**: 72px altura fixa
- **Main Content**: Flex-grow com max-width responsivo
- **Quick Capture**: Fixed bottom-right (24px margin)

---

## 🎨 **Componentes Visuais**

### **Cards & Panels**

#### **Card Padrão**
- **Background**: Glass effect (backdrop-blur-lg)
- **Border**: 1px solid glass border
- **Border Radius**: 12px
- **Shadow**: Soft shadow (0 4px 6px rgba(0,0,0,0.07))
- **Padding**: 24px

#### **Card Hover State**
- **Transform**: translateY(-2px)
- **Shadow**: Enhanced (0 8px 25px rgba(0,0,0,0.15))
- **Transition**: all 0.2s ease

#### **Glass Panel (Dialogs/Modals)**
- **Background**: Glass effect mais intenso
- **Backdrop**: rgba(0,0,0,0.4) com blur
- **Border Radius**: 16px
- **Max Width**: 600px (formulários), 400px (confirmações)

### **Buttons**

#### **Primary Button**
- **Background**: Linear gradient (#3b82f6 → #2563eb)
- **Text**: White, 14px, font-weight: 500
- **Height**: 40px (base), 36px (small), 44px (large)
- **Padding**: 16px 20px
- **Border Radius**: 8px
- **Hover**: Gradient shift + translateY(-1px)

#### **Secondary Button**
- **Background**: Glass effect
- **Border**: 1px solid primary
- **Text**: Primary color
- **Hover**: Background primary + text white

#### **Ghost Button**
- **Background**: Transparent
- **Text**: Primary color
- **Hover**: Light primary background (10% opacity)

### **Form Elements**

#### **Input Fields**
- **Background**: Glass effect sutil
- **Border**: 1px solid border color
- **Border Radius**: 8px
- **Height**: 40px
- **Padding**: 12px 16px
- **Focus**: Border primary + glow effect
- **Placeholder**: Gray 400 (light) / Gray 500 (dark)

#### **Labels**
- **Text**: Gray 700 (light) / Gray 300 (dark)
- **Font**: 14px, font-weight: 500
- **Margin**: 8px bottom

### **Navigation**

#### **Sidebar**
- **Background**: Glass panel
- **Width**: 280px
- **Items Height**: 44px
- **Active State**: Primary background (10% opacity) + border-right (3px primary)
- **Hover**: Gray background (5% opacity)

#### **Breadcrumbs**
- **Text**: 14px, Gray 500
- **Separator**: `/` ou `›`
- **Active**: Primary color

---

## ✨ **Animações & Micro-interações**

### **Transições Base**
```
Fast:    0.15s ease-out (hover states, clicks)
Base:    0.2s ease-out (state changes)
Slow:    0.3s ease-out (page transitions)
Bounce:  0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### **Animações Específicas**

#### **Quick Capture**
- **Entrada**: Scale in (0.8 → 1) + fade in
- **Expansão**: Height smooth transition + content fade in
- **Submit**: Pulse effect + success bounce

#### **Task Completion**
- **Check**: Draw animation + scale bounce
- **Card**: Slide out right + opacity fade
- **Confetti**: Particle effect (sucesso de meta)

#### **Page Transitions**
- **Entrada**: Slide up (20px) + fade in
- **Saída**: Fade out (sem slide)
- **Loading**: Skeleton shimmer effect

#### **Hover States**
- **Cards**: Lift (translateY(-2px)) + shadow enhance
- **Buttons**: Subtle scale (1.02) + brightness increase
- **Icons**: Rotation/scale conforme contexto

---

## 📱 **Estados de Interface**

### **Loading States**
- **Skeleton**: Shimmer effect em gray 200/700
- **Spinners**: Primary color, 20px/24px/32px sizes
- **Progress Bars**: Primary gradient com animação

### **Empty States**
- **Illustration**: Subtle icon (64px)
- **Title**: Gray 600/400, 18px
- **Description**: Gray 500/500, 14px
- **Action**: Primary button (opcional)

### **Error States**
- **Color**: Error red
- **Icon**: ⚠️ ou ❌
- **Background**: Error color 5% opacity
- **Border**: Error color 20% opacity

### **Success States**
- **Color**: Success green
- **Icon**: ✅ ou ⚡
- **Background**: Success color 5% opacity
- **Animation**: Bounce in effect

---

## 🎯 **Elementos Específicos do App**

### **Dashboard Cards**

#### **Task Card**
- **Header**: Título + prioridade badge
- **Content**: Descrição truncada
- **Footer**: Due date + project tag
- **Status**: Color-coded left border

#### **Goal Progress Card**
- **Header**: Goal title + percentage
- **Progress Bar**: Gradient progress ring (Magic UI)
- **Milestones**: Mini timeline dots
- **Background**: Subtle goal category gradient

#### **Habit Tracker**
- **Grid**: 7-day week view
- **Completed**: Primary color circle com checkmark
- **Missed**: Gray outline circle
- **Today**: Pulsing border
- **Streak**: Gradient badge

### **Calendar View**
- **Grid**: Clean month/week/day layout
- **Events**: Rounded rectangles com glassmorphism
- **Today**: Primary color background
- **Selected**: Primary border + slight background
- **Hover**: Subtle scale + shadow

### **Quick Capture (Floating)**
- **Collapsed**: FAB (56px circle) bottom-right
- **Expanded**: Card (400px width) com glass effect
- **Icon**: Lightning bolt com subtle glow
- **Animation**: Organic bounce on new capture

### **Notes Interface**
- **PARA Categories**: Color-coded badges
  - **Projects**: Blue (#3b82f6)
  - **Areas**: Green (#10b981)
  - **Resources**: Purple (#8b5cf6)
  - **Archive**: Gray (#6b7280)
- **Quick Note**: Minimal input com auto-resize
- **Rich Editor**: Clean toolbar com glassmorphism

---

## 🌙 **Dark Mode Specifications**

### **Transição Between Themes**
- **Trigger**: Toggle no header (sun/moon icon)
- **Animation**: 0.3s ease-out para todas as cores
- **Persistence**: localStorage + system preference detection

### **Dark Mode Adjustments**
- **Shadows**: Mais sutis, usando black com baixa opacity
- **Glassmorphism**: Background mais escuro, blur mantido
- **Contrast**: Textos ajustados para WCAG AA compliance
- **Accent Colors**: Slightly more vibrant para melhor contraste

### **Component Dark Variants**
- **Cards**: Darker glass (slate 800 + 80% opacity)
- **Buttons**: Adjusted gradients para melhor contraste
- **Inputs**: Darker backgrounds com subtle borders
- **Navigation**: Darker sidebar com accent preservation

---

## 📐 **Especificações Técnicas**

### **Performance Guidelines**
- **Animações**: 60fps target, GPU acceleration
- **Images**: WebP format, lazy loading
- **Icons**: SVG preferencialmente, font icons como fallback
- **Glass Effects**: Otimizados para não impactar performance

### **Accessibility**
- **Contrast Ratios**: Mínimo 4.5:1 para texto normal, 3:1 para texto grande
- **Focus States**: Visible outline (2px offset, primary color)
- **Color Independence**: Informação não dependente apenas de cor
- **Motion**: Respeitando `prefers-reduced-motion`

### **Responsive Behavior**
- **Mobile**: Stack vertical, touch-friendly (44px min targets)
- **Tablet**: Hybrid layout, sidebar collapsible
- **Desktop**: Full layout, hover states ativos

---

## 🎨 **Implementação no Código**

### **CSS Variables (Light/Dark)**
```css
:root {
  /* Light theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --shadow: rgba(0, 0, 0, 0.1);
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(255, 255, 255, 0.2);
}

.dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: #475569;
  --shadow: rgba(0, 0, 0, 0.3);
  
  --glass-bg: rgba(15, 23, 42, 0.8);
  --glass-border: rgba(241, 245, 249, 0.1);
}
```

### **Tailwind Config Extension**
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.8)',
          dark: 'rgba(15, 23, 42, 0.8)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      backdropBlur: {
        'glass': '16px',
      }
    }
  }
}
```

### **Magic UI Component Integration**
- **AnimatedButton**: Primary buttons com hover effects
- **GradientCard**: Cards principais com glassmorphism
- **ProgressRing**: Goal progress e habit tracking
- **FloatingInput**: Quick capture input
- **GlassPanel**: Modals e dialogs

---

Este design system garante consistência visual em toda a aplicação TimeCraft, proporcionando uma experiência moderna, acessível e focada na produtividade dos usuários.