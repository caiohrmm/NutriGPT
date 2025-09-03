import { useState, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

const DropdownContext = createContext()

export function DropdownMenu({ children, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block z-50">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, asChild, className, ...props }) {
  const { open, setOpen } = useContext(DropdownContext)
  
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(!open)
  }
  
  if (asChild) {
    // Clone child and add onClick
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    )
  }
  
  return (
    <button
      className={cn('inline-flex items-center justify-center', className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, className, align = 'right', ...props }) {
  const { open, setOpen } = useContext(DropdownContext)
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          
          {/* Menu content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'absolute top-full mt-1 z-[60] min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-lg',
              align === 'right' && 'right-0',
              align === 'left' && 'left-0',
              align === 'center' && 'left-1/2 -translate-x-1/2',
              className
            )}
            style={{ zIndex: 9999 }}
            {...props}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function DropdownMenuItem({ children, className, onClick, asChild, ...props }) {
  const { setOpen } = useContext(DropdownContext)
  
  const handleClick = (e) => {
    if (!asChild) {
      onClick?.(e)
      setOpen(false)
    }
  }
  
  if (asChild) {
    // Clone the child element and add our props
    const child = children
    return (
      <div
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
          'hover:bg-gray-100 focus:bg-gray-100',
          className
        )}
        onClick={() => setOpen(false)}
      >
        {child}
      </div>
    )
  }
  
  return (
    <button
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'hover:bg-gray-100 focus:bg-gray-100',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className, ...props }) {
  return (
    <div
      className={cn('-mx-1 my-1 h-px bg-gray-200', className)}
      {...props}
    />
  )
}
