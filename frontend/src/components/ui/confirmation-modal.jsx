import { useState, createContext, useContext } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from './dialog'
import { Button } from './button'
import { cn } from '../../lib/utils'

const ConfirmationContext = createContext()

export function ConfirmationProvider({ children }) {
  const [confirmations, setConfirmations] = useState([])

  const confirm = (options) => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substr(2, 9)
      const confirmation = {
        id,
        ...options,
        onConfirm: () => {
          resolve(true)
          removeConfirmation(id)
        },
        onCancel: () => {
          resolve(false)
          removeConfirmation(id)
        },
      }
      setConfirmations(prev => [...prev, confirmation])
    })
  }

  const removeConfirmation = (id) => {
    setConfirmations(prev => prev.filter(conf => conf.id !== id))
  }

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {confirmations.map(confirmation => (
        <ConfirmationModal key={confirmation.id} {...confirmation} />
      ))}
    </ConfirmationContext.Provider>
  )
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider')
  }
  return context
}

function ConfirmationModal({
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  const icons = {
    warning: AlertTriangle,
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }

  const colors = {
    warning: {
      icon: 'text-yellow-600',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700',
    },
    success: {
      icon: 'text-green-600',
      confirmButton: 'bg-green-600 hover:bg-green-700',
    },
    error: {
      icon: 'text-red-600',
      confirmButton: 'bg-red-600 hover:bg-red-700',
    },
    info: {
      icon: 'text-blue-600',
      confirmButton: 'bg-blue-600 hover:bg-blue-700',
    },
  }

  const Icon = icons[type] || AlertTriangle
  const colorScheme = colors[type] || colors.warning

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Icon className={cn('h-6 w-6', colorScheme.icon)} />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>

        <DialogBody>
          <DialogDescription className="text-gray-600">
            {message}
          </DialogDescription>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button 
            className={cn('text-white', colorScheme.confirmButton)}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions for common confirmation types
export function useConfirm() {
  const { confirm } = useConfirmation()
  
  return {
    delete: (itemName) => confirm({
      type: 'error',
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir ${itemName}? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    }),
    
    cancel: (itemName) => confirm({
      type: 'warning',
      title: 'Confirmar Cancelamento',
      message: `Tem certeza que deseja cancelar ${itemName}?`,
      confirmText: 'Cancelar',
      cancelText: 'Manter',
    }),
    
    complete: (itemName) => confirm({
      type: 'success',
      title: 'Confirmar Conclusão',
      message: `Marcar ${itemName} como concluída?`,
      confirmText: 'Marcar como Concluída',
      cancelText: 'Cancelar',
    }),
    
    custom: (options) => confirm(options),
  }
}
