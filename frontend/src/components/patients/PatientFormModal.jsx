import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, Target, Weight, Ruler } from 'lucide-react'

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
import { MaskedInput } from '../ui/masked-input'
import { Label } from '../ui/label'
import { GoalSelector } from './GoalSelector'
import { patientAPI } from '../../lib/api'
import { getTodayForInput } from '../../utils/dateUtils'

const patientSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  birthDate: z.string().optional().refine((date) => {
    if (!date) return true; // Allow empty dates
    const birthDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return birthDate <= today;
  }, { message: 'Data de nascimento não pode ser no futuro' }),
  sex: z.enum(['M', 'F', '']).optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  goal: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
})

export function PatientFormModal({ 
  open, 
  onOpenChange, 
  patient = null, 
  onSuccess 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoalSelectorOpen, setIsGoalSelectorOpen] = useState(false)
  const isEditing = !!patient

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      sex: '',
      weight: '',
      height: '',
      goal: '',
      allergies: '',
      notes: '',
    },
  })

  // Reset form when patient changes or modal opens
  useEffect(() => {
    if (open) {
      if (patient) {
        reset({
          fullName: patient.fullName || '',
          email: patient.email || '',
          phone: patient.phone || '',
          birthDate: patient.birthDate ? patient.birthDate.split('T')[0] : '',
          sex: patient.sex || '',
          weight: patient.weight?.toString() || '',
          height: patient.height?.toString() || '',
          goal: patient.goal || '',
          allergies: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : '',
          notes: patient.notes || '',
        })
      } else {
        reset({
          fullName: '',
          email: '',
          phone: '',
          birthDate: '',
          sex: '',
          weight: '',
          height: '',
          goal: '',
          allergies: '',
          notes: '',
        })
      }
    }
  }, [open, patient, reset])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Convert form data to API format
      const apiData = {
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        birthDate: data.birthDate || null,
        sex: data.sex || null,
        weight: data.weight ? parseFloat(data.weight) : null,
        height: data.height ? parseFloat(data.height) : null,
        goal: data.goal || null,
        allergies: data.allergies || null,
        notes: data.notes || null,
      }

      if (isEditing) {
        await patientAPI.update(patient.id, apiData)
      } else {
        await patientAPI.create(apiData)
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving patient:', error)
      
      // Handle validation errors
      if (error.response?.data?.details) {
        error.response.data.details.forEach((detail) => {
          setError(detail.field, { message: detail.message })
        })
      } else {
        setError('root', {
          message: error.response?.data?.message || 'Erro ao salvar paciente'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoalSelect = (goal) => {
    setValue('goal', goal)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Atualize as informações do paciente'
              : 'Preencha os dados do novo paciente'
            }
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Nome completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="Nome completo do paciente"
                    className="pl-10"
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <MaskedInput
                    id="phone"
                    mask="phone"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    {...register('phone')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="birthDate">Data de nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  max={getTodayForInput()}
                  {...register('birthDate')}
                />
                {errors.birthDate && (
                  <p className="text-sm text-destructive mt-1">{errors.birthDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sex">Sexo</Label>
                <select
                  id="sex"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  {...register('sex')}
                >
                  <option value="">Selecionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>

            {/* Physical Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <MaskedInput
                    id="weight"
                    mask="weight"
                    placeholder="70.5"
                    className="pl-10"
                    {...register('weight')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <MaskedInput
                    id="height"
                    mask="height"
                    placeholder="170.5"
                    className="pl-10"
                    {...register('height')}
                  />
                </div>
              </div>
            </div>

            {/* Goals and Notes */}
            <div>
              <Label htmlFor="goal">Objetivo</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Target className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="goal"
                    placeholder="Ex: Perder peso, ganhar massa muscular..."
                    className="pl-10"
                    {...register('goal')}
                  />
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsGoalSelectorOpen(true)}
                  className="flex-shrink-0"
                >
                  Escolher
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="allergies">Alergias e Restrições</Label>
              <Input
                id="allergies"
                placeholder="Ex: Lactose, Glúten, Amendoim (separar por vírgula)"
                {...register('allergies')}
              />
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Informações adicionais sobre o paciente..."
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
            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Goal Selector Modal */}
      <GoalSelector
        open={isGoalSelectorOpen}
        onOpenChange={setIsGoalSelectorOpen}
        currentGoal={watch('goal')}
        onGoalSelect={handleGoalSelect}
      />
    </Dialog>
  )
}
