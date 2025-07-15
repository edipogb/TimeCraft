import { motion } from 'framer-motion'
import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface MagicCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const MagicCard = forwardRef<HTMLDivElement, MagicCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn('glass-panel cursor-pointer', className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

MagicCard.displayName = 'MagicCard'