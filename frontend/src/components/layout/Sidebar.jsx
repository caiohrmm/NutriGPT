import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  User, 
  Menu, 
  X,
  ChevronLeft,
  LogOut,
  LayoutDashboard
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '../ui/button'
import { Logo } from '../ui/logo'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'

const navigation = [
  {
    name: 'Pacientes',
    href: '/patients',
    icon: Users,
  },
  {
    name: 'Consultas',
    href: '/appointments',
    icon: Calendar,
  },
  {
    name: 'Meu Perfil',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
]

export function Sidebar({ isOpen, setIsOpen, className }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  // Desktop: always show sidebar
  // Mobile: show based on isOpen state
  const shouldShow = isDesktop || isOpen

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: shouldShow ? 0 : -320,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          'h-screen w-80 bg-white border-r border-gray-200 overflow-hidden flex-shrink-0',
          isDesktop ? 'relative' : 'fixed left-0 top-0 z-50',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Logo size={40} />
            {!isDesktop && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  onClick={() => !isDesktop && setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

// Mobile menu button
export function MobileMenuButton({ onClick, className }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('lg:hidden', className)}
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}