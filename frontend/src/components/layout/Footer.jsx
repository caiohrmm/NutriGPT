import { Logo } from '../ui/logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo size={36} showText={false} />
            <div>
              <p className="text-base font-bold text-gray-900">NutriGPT</p>
              <p className="text-sm text-gray-600">CRM Inteligente para Nutricionistas</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">
              © {currentYear} NutriGPT
            </p>
            <p className="text-xs text-gray-500">
              Todos os direitos reservados • v1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
