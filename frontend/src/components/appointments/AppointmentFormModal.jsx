import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Clock, FileText, User } from 'lucide-react'

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
import { PatientSelector } from './PatientSelector'
import { appointmentAPI } from '../../lib/api'

const appointmentSchema = z.object({
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
})

export function AppointmentFormModal({ 
  open, 
  onOpenChange, 
  patientId = null,
  patientName = null,
  appointment = null,
  onSuccess 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isPatientSelectorOpen, setIsPatientSelectorOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: '',
      time: '',
      notes: '',
    },
  })

  const isEditing = !!appointment

  // Set selected patient when patientId is provided or from appointment
  useEffect(() => {
    if (appointment && appointment.Patient) {
      setSelectedPatient(appointment.Patient)
    } else if (patientId && patientName) {
      setSelectedPatient({ id: patientId, fullName: patientName })
    } else {
      setSelectedPatient(null)
    }
  }, [appointment, patientId, patientName])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (appointment) {
        // Editing mode - populate with existing data
        const startAt = new Date(appointment.startAt || appointment.scheduledAt)
        reset({
          date: startAt.toISOString().split('T')[0],
          time: startAt.toTimeString().slice(0, 5),
          notes: appointment.notes || '',
        })
      } else {
        // Creating mode - default to tomorrow
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        reset({
          date: tomorrow.toISOString().split('T')[0],
          time: '09:00',
          notes: '',
        })
      }
    }
  }, [open, appointment, reset])

  const onSubmit = async (data) => {
    const finalPatientId = appointment?.patientId || patientId || selectedPatient?.id
    if (!finalPatientId) {
      setError('root', { message: 'Selecione um paciente para agendar a consulta' })
      return
    }

    setIsLoading(true)
    try {
      // Combine date and time into a single datetime
      const startAt = new Date(`${data.date}T${data.time}:00`)
      
      // Calculate endAt (1 hour later by default)
      const endAt = new Date(startAt.getTime() + 60 * 60 * 1000) // Add 1 hour
      
      const apiData = {
        patientId: finalPatientId,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        notes: data.notes || null,
      }

      if (isEditing) {
        await appointmentAPI.update(appointment.id, apiData)
      } else {
        await appointmentAPI.create(apiData)
      }
      
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving appointment:', error)
      setError('root', {
        message: error.response?.data?.message || (isEditing ? 'Erro ao atualizar consulta' : 'Erro ao agendar consulta')
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Reagendar Consulta' : 'Agendar Consulta'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? `Reagendar consulta de ${appointment.Patient?.fullName}`
              : (selectedPatient || patientName 
                ? `Nova consulta para ${selectedPatient?.fullName || patientName}`
                : 'Selecione um paciente e agende uma consulta'
              )
            }
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Patient Selection */}
            {!patientId && !isEditing && (
              <div>
                <Label>Paciente *</Label>
                {selectedPatient ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{selectedPatient.fullName}</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPatientSelectorOpen(true)}
                    >
                      Alterar
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPatientSelectorOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 h-10"
                  >
                    <User className="h-4 w-4" />
                    <span>Selecionar Paciente</span>
                  </Button>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="date">Data da consulta *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  className="pl-10"
                  {...register('date')}
                />
              </div>
              {errors.date && (
                <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="time">Horário *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="time"
                  type="time"
                  className="pl-10"
                  {...register('time')}
                />
              </div>
              {errors.time && (
                <p className="text-sm text-destructive mt-1">{errors.time.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Motivo da consulta, preparações necessárias..."
                  {...register('notes')}
                />
              </div>
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
            {isLoading 
              ? (isEditing ? 'Reagendando...' : 'Agendando...') 
              : (isEditing ? 'Reagendar Consulta' : 'Agendar Consulta')
            }
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Patient Selector Modal */}
      <PatientSelector
        open={isPatientSelectorOpen}
        onOpenChange={setIsPatientSelectorOpen}
        selectedPatient={selectedPatient}
        onPatientSelect={handlePatientSelect}
      />
    </Dialog>
  )
}
