import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Weight, Ruler, Activity, Calendar } from 'lucide-react'

import {
  ContentDialog as Dialog,
  ContentDialogContent as DialogContent,
  ContentDialogHeader as DialogHeader,
  ContentDialogTitle as DialogTitle,
  ContentDialogDescription as DialogDescription,
  ContentDialogBody as DialogBody,
  ContentDialogFooter as DialogFooter,
} from '../ui/content-dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { measurementAPI } from '../../lib/api'
import { getTodayForInput } from '../../utils/dateUtils'

const measurementSchema = z.object({
  date: z.string().refine((date) => {
    const measurementDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return measurementDate <= today;
  }, { message: 'Data não pode ser no futuro' }),
  weight: z.string().optional(),
  heightCm: z.string().optional(),
  bodyFatPercentage: z.string().optional(),
  waistCircumference: z.string().optional(),
  hipCircumference: z.string().optional(),
  armCircumference: z.string().optional(),
  notes: z.string().optional(),
})

export function MeasurementFormModal({ 
  open, 
  onOpenChange, 
  patientId,
  measurement = null, 
  onSuccess 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!measurement

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch
  } = useForm({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: '',
      heightCm: '',
      bodyFatPercentage: '',
      waistCircumference: '',
      hipCircumference: '',
      armCircumference: '',
      notes: '',
    },
  })

  // Watch weight and height for BMI calculation
  const watchedWeight = watch('weight')
  const watchedHeight = watch('heightCm')
  
  const calculateBMI = () => {
    const weight = parseFloat(watchedWeight)
    const height = parseFloat(watchedHeight)
    
    if (weight && height && weight > 0 && height > 0) {
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)
      return bmi.toFixed(1)
    }
    return null
  }

  // Reset form when measurement changes or modal opens
  useEffect(() => {
    if (open) {
      if (measurement) {
        reset({
          date: measurement.date ? measurement.date.split('T')[0] : new Date().toISOString().split('T')[0],
          weight: measurement.weight?.toString() || '',
          heightCm: measurement.heightCm?.toString() || '',
          bodyFatPercentage: measurement.bodyFatPercentage?.toString() || '',
          waistCircumference: measurement.waistCircumference?.toString() || '',
          hipCircumference: measurement.hipCircumference?.toString() || '',
          armCircumference: measurement.armCircumference?.toString() || '',
          notes: measurement.notes || '',
        })
      } else {
        reset({
          date: new Date().toISOString().split('T')[0],
          weight: '',
          heightCm: '',
          bodyFatPercentage: '',
          waistCircumference: '',
          hipCircumference: '',
          armCircumference: '',
          notes: '',
        })
      }
    }
  }, [open, measurement, reset])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Convert form data to API format
      const apiData = {
        patientId,
        date: new Date(data.date + 'T12:00:00.000Z').toISOString(), // Convert to ISO datetime format // Send date as string in YYYY-MM-DD format
        weight: data.weight ? parseFloat(data.weight) : undefined,
        heightCm: data.heightCm ? parseFloat(data.heightCm) : undefined,
        bodyFatPercentage: data.bodyFatPercentage ? parseFloat(data.bodyFatPercentage) : undefined,
        waistCircumference: data.waistCircumference ? parseFloat(data.waistCircumference) : undefined,
        hipCircumference: data.hipCircumference ? parseFloat(data.hipCircumference) : undefined,
        armCircumference: data.armCircumference ? parseFloat(data.armCircumference) : undefined,
        notes: data.notes || undefined,
      }

      if (isEditing) {
        await measurementAPI.update(measurement.id, apiData)
      } else {
        await measurementAPI.create(apiData)
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving measurement:', error)
      
      // Handle validation errors
      if (error.response?.data?.error?.details) {
        error.response.data.error.details.forEach((detail) => {
          setError(detail.path.join('.'), { message: detail.message })
        })
      } else {
        setError('root', {
          message: error.response?.data?.message || 'Erro ao salvar medição'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const currentBMI = calculateBMI()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Medição' : 'Nova Medição'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Atualize as medições do paciente'
              : 'Registre uma nova medição para acompanhar o progresso'
            }
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Date */}
            <div>
              <Label htmlFor="date">Data da medição *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  max={getTodayForInput()}
                  className="pl-10"
                  {...register('date')}
                />
              </div>
              {errors.date && (
                <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Weight and Height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70.5"
                    className="pl-10"
                    {...register('weight')}
                  />
                </div>
                {errors.weight && (
                  <p className="text-sm text-destructive mt-1">{errors.weight.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="heightCm">Altura (cm)</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="heightCm"
                    type="number"
                    step="0.1"
                    placeholder="170.5"
                    className="pl-10"
                    {...register('heightCm')}
                  />
                </div>
                {errors.heightCm && (
                  <p className="text-sm text-destructive mt-1">{errors.heightCm.message}</p>
                )}
              </div>
            </div>

            {/* BMI Display */}
            {currentBMI && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    IMC Calculado: <span className="font-bold">{currentBMI}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Body Composition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bodyFatPercentage">% Gordura Corporal</Label>
                <Input
                  id="bodyFatPercentage"
                  type="number"
                  step="0.1"
                  placeholder="15.5"
                  {...register('bodyFatPercentage')}
                />
              </div>

              <div>
                <Label htmlFor="waistCircumference">Circunferência da Cintura (cm)</Label>
                <Input
                  id="waistCircumference"
                  type="number"
                  step="0.1"
                  placeholder="80.0"
                  {...register('waistCircumference')}
                />
              </div>
            </div>

            {/* Other Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hipCircumference">Circunferência do Quadril (cm)</Label>
                <Input
                  id="hipCircumference"
                  type="number"
                  step="0.1"
                  placeholder="95.0"
                  {...register('hipCircumference')}
                />
              </div>

              <div>
                <Label htmlFor="armCircumference">Circunferência do Braço (cm)</Label>
                <Input
                  id="armCircumference"
                  type="number"
                  step="0.1"
                  placeholder="30.0"
                  {...register('armCircumference')}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Observações sobre a medição, condições especiais, etc..."
                {...register('notes')}
              />
            </div>

            {errors.root && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {errors.root.message}
              </div>
            )}
          </form>
        </DialogBody>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Registrar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
