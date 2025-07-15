import { forwardRef, ButtonHTMLAttributes } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'btn-gradient text-white font-medium',
          'hover:-translate-y-px hover:shadow-xl',
          'transition-all duration-200',
          'shadow-lg active:translate-y-0',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

PrimaryButton.displayName = 'PrimaryButton'