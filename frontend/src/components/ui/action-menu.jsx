import { useState } from 'react'
import { MoreVertical, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './button'
import { cn } from '../../lib/utils'

export function ActionMenu({ children, trigger, className }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <div className={cn('relative', className)}>
        {trigger ? (
          <div onClick={() => setIsOpen(true)}>
            {trigger}
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => setIsOpen(true)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Action Menu Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] min-w-[200px] max-w-[280px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <h3 className="font-medium text-gray-900">Ações</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Actions List */}
              <div className="py-2">
                {children && typeof children === 'function' 
                  ? children(() => setIsOpen(false))
                  : children
                }
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function ActionMenuItem({ children, onClick, variant = 'default', className, ...props }) {
  const handleClick = (e) => {
    onClick?.(e)
  }

  const variantStyles = {
    default: 'text-gray-700 hover:bg-gray-50',
    destructive: 'text-red-600 hover:bg-red-50',
    primary: 'text-blue-600 hover:bg-blue-50',
  }

  return (
    <button
      className={cn(
        'w-full flex items-center px-4 py-3 text-sm transition-colors text-left',
        variantStyles[variant],
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export function ActionMenuSeparator() {
  return <div className="my-1 h-px bg-gray-200 mx-2" />
}
