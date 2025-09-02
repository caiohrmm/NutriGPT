import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { MobileMenuButton } from './Sidebar'
import { Logo } from '../ui/logo'
import { useAuth } from '../../context/AuthContext'

export function Header({ onMenuClick, title = 'Dashboard' }) {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <MobileMenuButton onClick={onMenuClick} />
            
            {/* Logo for mobile when sidebar is closed */}
            <div className="lg:hidden">
              <Logo size={24} />
            </div>
            
            {/* Page title with logo accent */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="w-8 h-8 opacity-20">
                <Logo size={32} showText={false} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                <p className="text-xs text-gray-500">NutriGPT CRM</p>
              </div>
            </div>
          </div>

          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar pacientes, consultas..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* User info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">Nutricionista</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
