import { useState } from 'react'
import { Check, Target } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { cn } from '../../lib/utils'

const predefinedGoals = [
  {
    id: 'weight-loss',
    title: 'Perda de Peso',
    description: 'Reduzir peso corporal de forma saudável',
    icon: '⬇️'
  },
  {
    id: 'weight-gain',
    title: 'Ganho de Peso',
    description: 'Aumentar peso corporal de forma saudável',
    icon: '⬆️'
  },
  {
    id: 'maintenance',
    title: 'Manutenção',
    description: 'Manter o peso atual e hábitos saudáveis',
    icon: '⚖️'
  },
  {
    id: 'muscle-gain',
    title: 'Ganho de Massa Muscular',
    description: 'Aumentar massa magra e força',
    icon: '💪'
  },
  {
    id: 'fat-loss',
    title: 'Redução de Gordura',
    description: 'Diminuir percentual de gordura corporal',
    icon: '🔥'
  },
  {
    id: 'health-improvement',
    title: 'Melhoria da Saúde',
    description: 'Controlar diabetes, hipertensão, colesterol',
    icon: '❤️'
  },
  {
    id: 'sports-performance',
    title: 'Performance Esportiva',
    description: 'Otimizar nutrição para atividade física',
    icon: '🏃'
  },
  {
    id: 'eating-habits',
    title: 'Reeducação Alimentar',
    description: 'Desenvolver hábitos alimentares saudáveis',
    icon: '🥗'
  }
]

export function GoalSelector({ open, onOpenChange, currentGoal, onGoalSelect }) {
  const [selectedGoal, setSelectedGoal] = useState(currentGoal || '')
  const [customGoal, setCustomGoal] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal.title)
    setShowCustomInput(false)
    setCustomGoal('')
  }

  const handleCustomGoal = () => {
    setShowCustomInput(true)
    setSelectedGoal('')
  }

  const handleConfirm = () => {
    const finalGoal = showCustomInput ? customGoal : selectedGoal
    if (finalGoal.trim()) {
      onGoalSelect(finalGoal.trim())
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setSelectedGoal(currentGoal || '')
    setCustomGoal('')
    setShowCustomInput(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Selecionar Objetivo</span>
          </DialogTitle>
          <DialogDescription>
            Escolha o objetivo principal do paciente ou defina um personalizado
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            {/* Predefined Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predefinedGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalClick(goal)}
                  className={cn(
                    'p-4 text-left rounded-lg border-2 transition-all hover:shadow-md',
                    selectedGoal === goal.title
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {goal.description}
                      </p>
                    </div>
                    {selectedGoal === goal.title && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Goal Option */}
            <div className="border-t pt-4">
              <button
                onClick={handleCustomGoal}
                className={cn(
                  'w-full p-4 text-left rounded-lg border-2 transition-all hover:shadow-md',
                  showCustomInput
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✏️</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      Objetivo Personalizado
                    </h3>
                    <p className="text-sm text-gray-600">
                      Defina um objetivo específico para este paciente
                    </p>
                  </div>
                  {showCustomInput && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>

              {/* Custom Input */}
              {showCustomInput && (
                <div className="mt-3 space-y-2">
                  <Label htmlFor="customGoal">Objetivo personalizado</Label>
                  <Input
                    id="customGoal"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Ex: Reduzir 5kg em 3 meses para casamento"
                    className="w-full"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Current Selection Display */}
            {(selectedGoal || customGoal) && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Objetivo selecionado:</span>{' '}
                  {showCustomInput ? customGoal : selectedGoal}
                </p>
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedGoal && !customGoal.trim()}
          >
            Confirmar Objetivo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
