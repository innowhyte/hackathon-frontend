import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'bg-background ring-offset-background focus-visible:ring-primary/20 focus-visible:border-primary file:bg-primary file:text-primary-foreground file:hover:bg-primary/90 border-border placeholder:text-muted-foreground flex min-h-[44px] w-full rounded-lg border px-3 py-2.5 text-sm transition-colors file:mr-3 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium file:transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
