import { cn } from '../../lib/utils'

const badgeVariants = {
  default: 'bg-primary/10 text-primary hover:bg-primary/20',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  success: 'bg-green-100 text-green-700 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  info: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
}

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}
