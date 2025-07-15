import React from 'react'
import {
  Home,
  Inbox,
  Target,
  RotateCcw,
  Book,
  Archive,
  Calendar,
  Settings,
  CheckCircle,
  Circle,
  Clock,
  FileText,
  BarChart3,
  TrendingUp,
  Zap,
  Users,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  inbox: Inbox,
  target: Target,
  'rotate-ccw': RotateCcw,
  book: Book,
  archive: Archive,
  calendar: Calendar,
  settings: Settings,
  'check-circle': CheckCircle,
  circle: Circle,
  clock: Clock,
  'file-text': FileText,
  'bar-chart': BarChart3,
  'trending-up': TrendingUp,
  zap: Zap,
  users: Users,
  bell: Bell,
  search: Search,
  plus: Plus,
  edit: Edit,
  trash: Trash2,
  'more-vertical': MoreVertical,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name?: keyof typeof iconMap
  emoji?: string
  size?: number
  className?: string
  'aria-label'?: string
}

export function Icon({
  name,
  emoji,
  size = 20,
  className,
  'aria-label': ariaLabel,
  ...props
}: IconProps) {
  // If emoji is provided, render emoji with accessibility
  if (emoji) {
    return (
      <span
        className={cn('inline-flex items-center justify-center', className)}
        style={{ fontSize: `${size}px` }}
        role="img"
        aria-label={ariaLabel || 'Icon'}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {emoji}
      </span>
    )
  }

  // If name is provided, render Lucide icon
  if (name && iconMap[name]) {
    const LucideComponent = iconMap[name]
    return (
      <LucideComponent
        size={size}
        className={cn('inline-block', className)}
        aria-label={ariaLabel}
        {...props}
      />
    )
  }

  // Fallback to a default icon
  return (
    <Circle
      size={size}
      className={cn('inline-block', className)}
      aria-label={ariaLabel || 'Default icon'}
      {...props}
    />
  )
}

// Export individual icons for direct use
export {
  Home,
  Inbox,
  Target,
  RotateCcw,
  Book,
  Archive,
  Calendar,
  Settings,
  CheckCircle,
  Circle,
  Clock,
  FileText,
  BarChart3,
  TrendingUp,
  Zap,
  Users,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
}
