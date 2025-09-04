import { useState, createContext, useContext } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './button'
import { cn } from '../../lib/utils'

const ContentDialogContext = createContext()

export function ContentDialog({ children, open, onOpenChange }) {
  return (
    <ContentDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </ContentDialogContext.Provider>
  )
}

export function ContentDialogTrigger({ children, asChild, ...props }) {
  const { onOpenChange } = useContext(ContentDialogContext)
  
  if (asChild) {
    return children
  }
  
  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  )
}

export function ContentDialogContent({ children, className, ...props }) {
  const { open, onOpenChange } = useContext(ContentDialogContext)
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - covers entire content area including header (excludes sidebar) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bg-black/50 backdrop-blur-sm"
            style={{ 
              top: '0px',
              left: '320px', // Fixed 320px after sidebar
              right: '0px',
              bottom: '0px',
              zIndex: 100,
            }}
            onClick={() => onOpenChange(false)}
          />
          
          {/* Dialog Container - positioned relative to content area */}
          <div 
            className="fixed flex items-center justify-center p-4"
            style={{ 
              top: '0px',
              left: '320px', // Fixed 320px after sidebar
              right: '0px',
              bottom: '0px',
              zIndex: 101,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'relative bg-white rounded-lg shadow-xl border border-gray-200',
                'w-full max-h-[90vh] overflow-y-auto',
                'mx-auto',
                className
              )}
              {...props}
            >
              {/* Close button */}
              <div className="absolute right-4 top-4 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export function ContentDialogHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)} {...props}>
      {children}
    </div>
  )
}

export function ContentDialogTitle({ children, className, ...props }) {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
      {children}
    </h2>
  )
}

export function ContentDialogDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function ContentDialogBody({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function ContentDialogFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 flex justify-end space-x-2', className)} {...props}>
      {children}
    </div>
  )
}
