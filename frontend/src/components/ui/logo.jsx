import { cn } from '../../lib/utils'

export function Logo({ className, size = 32, showText = true, ...props }) {
  return (
    <div className={cn('flex items-center space-x-3', className)} {...props}>
      <img
        src="/Logo.png"
        alt="NutriGPT"
        className="object-contain"
        style={{ width: size, height: size }}
      />
      {showText && (
        <div>
          <h1 className="text-lg font-bold text-gray-900">NutriGPT</h1>
          <p className="text-xs text-gray-600">CRM Nutrição</p>
        </div>
      )}
    </div>
  )
}

export function LogoWatermark({ className, ...props }) {
  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none z-0 opacity-[0.05]',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/Logo.png"
          alt="NutriGPT Watermark"
          className="object-contain"
          style={{ width: 500, height: 500 }}
        />
      </div>
      {/* Additional smaller logos in corners */}
      <div className="absolute top-10 right-10 opacity-30">
        <img
          src="/Logo.png"
          alt="NutriGPT"
          className="object-contain"
          style={{ width: 60, height: 60 }}
        />
      </div>
      <div className="absolute bottom-10 left-10 opacity-20">
        <img
          src="/Logo.png"
          alt="NutriGPT"
          className="object-contain"
          style={{ width: 40, height: 40 }}
        />
      </div>
    </div>
  )
}
