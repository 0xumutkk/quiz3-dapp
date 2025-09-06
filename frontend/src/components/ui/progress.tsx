import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: 'default' | 'timer' | 'success' | 'warning' | 'danger'
  }
>(({ className, value, variant = 'default', ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-slate-700",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-300 ease-out",
        {
          'bg-gradient-primary': variant === 'default',
          'bg-gradient-to-r from-green-500 to-blue-500': variant === 'timer' && (value || 0) > 60,
          'bg-gradient-to-r from-yellow-500 to-orange-500': variant === 'timer' && (value || 0) <= 60 && (value || 0) > 30,
          'bg-gradient-to-r from-red-500 to-red-600': variant === 'timer' && (value || 0) <= 30,
          'bg-gradient-success': variant === 'success',
          'bg-gradient-to-r from-yellow-400 to-orange-500': variant === 'warning',
          'bg-gradient-error': variant === 'danger',
        }
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
