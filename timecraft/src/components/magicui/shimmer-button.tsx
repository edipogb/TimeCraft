import React, { CSSProperties, ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '8px',
      background = 'hsl(var(--primary))',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as CSSProperties
        }
        className={cn(
          'group text-primary-foreground relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] px-6 py-2 whitespace-nowrap [background:var(--bg)]',
          'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            '-z-30 blur-[2px]',
            'absolute inset-0 overflow-visible'
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 aspect-square h-full rounded-none">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            'insert-0 absolute size-full',
            'rounded-[inherit] px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',
            // transition
            'transform-gpu transition-all duration-300 ease-in-out',
            // on hover
            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
            // on click
            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]'
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            'absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]'
          )}
        />
      </button>
    )
  }
)

ShimmerButton.displayName = 'ShimmerButton'
