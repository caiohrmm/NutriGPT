import { cn } from '../../lib/utils'

export function NutriGPTLogo({ className, size = 32, ...props }) {
  return (
    <svg
      className={cn('text-primary', className)}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Folha principal */}
      <path
        d="M20 50 Q30 20, 50 30 Q70 20, 80 50 Q70 80, 50 70 Q30 80, 20 50 Z"
        fill="currentColor"
        className="opacity-90"
      />
      {/* Nervura central */}
      <path
        d="M50 25 Q50 40, 50 50 Q50 60, 50 75"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="opacity-60"
      />
      {/* Nervuras laterais */}
      <path
        d="M35 40 Q45 45, 50 50"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="opacity-40"
      />
      <path
        d="M65 40 Q55 45, 50 50"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="opacity-40"
      />
      <path
        d="M35 60 Q45 55, 50 50"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="opacity-40"
      />
      <path
        d="M65 60 Q55 55, 50 50"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="opacity-40"
      />
      {/* Ponto central (representa inteligência/AI) */}
      <circle
        cx="50"
        cy="50"
        r="3"
        fill="currentColor"
        className="opacity-80"
      />
    </svg>
  )
}

export function NutriGPTWatermark({ className, ...props }) {
  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none z-0 opacity-[0.02]',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <NutriGPTLogo size={400} className="text-primary" />
      </div>
    </div>
  )
}
