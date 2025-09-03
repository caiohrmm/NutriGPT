import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, ...toast, createdAt: Date.now() }
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration || (toast.type === 'error' ? 6000 : 4000)
    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function Toast({ toast }) {
  const { removeToast } = useToast()

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-700',
    },
  }

  const Icon = icons[toast.type] || Info
  const colorScheme = colors[toast.type] || colors.info

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative bg-white border rounded-lg shadow-lg p-4 pointer-events-auto',
        colorScheme.bg,
        'max-w-sm w-full'
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', colorScheme.icon)} />
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className={cn('text-sm font-medium mb-1', colorScheme.title)}>
              {toast.title}
            </h4>
          )}
          <p className={cn('text-sm', colorScheme.message)}>
            {toast.message}
          </p>
        </div>

        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ 
          duration: (toast.duration || (toast.type === 'error' ? 6000 : 4000)) / 1000,
          ease: 'linear'
        }}
        className={cn(
          'absolute bottom-0 left-0 h-1 bg-current opacity-30 origin-left',
          colorScheme.icon
        )}
      />
    </motion.div>
  )
}

// Helper functions for common toast types
export const toast = {
  success: (message, options = {}) => {
    const { addToast } = useToast()
    return addToast({
      type: 'success',
      title: 'Sucesso',
      message,
      ...options
    })
  },
  
  error: (message, options = {}) => {
    const { addToast } = useToast()
    return addToast({
      type: 'error',
      title: 'Erro',
      message,
      ...options
    })
  },
  
  warning: (message, options = {}) => {
    const { addToast } = useToast()
    return addToast({
      type: 'warning',
      title: 'Atenção',
      message,
      ...options
    })
  },
  
  info: (message, options = {}) => {
    const { addToast } = useToast()
    return addToast({
      type: 'info',
      title: 'Informação',
      message,
      ...options
    })
  },
}

// Hook for easier usage
export function useToasts() {
  const { addToast } = useToast()
  
  return {
    success: (message, options = {}) => addToast({
      type: 'success',
      title: 'Sucesso',
      message,
      ...options
    }),
    
    error: (message, options = {}) => addToast({
      type: 'error',
      title: 'Erro',
      message,
      ...options
    }),
    
    warning: (message, options = {}) => addToast({
      type: 'warning',
      title: 'Atenção',
      message,
      ...options
    }),
    
    info: (message, options = {}) => addToast({
      type: 'info',
      title: 'Informação',
      message,
      ...options
    }),
  }
}
