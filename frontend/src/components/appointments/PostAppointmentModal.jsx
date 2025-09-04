import { useState } from 'react'
import { CheckCircle, Plus, Activity } from 'lucide-react'
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
import { MeasurementFormModal } from '../patients/MeasurementFormModal'

export function PostAppointmentModal({ 
  open, 
  onOpenChange, 
  appointment,
  onAddMeasurement,
  onFinish 
}) {
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false)

  const handleAddMeasurement = () => {
    setIsMeasurementModalOpen(true)
  }

  const handleMeasurementSuccess = () => {
    setIsMeasurementModalOpen(false)
    onAddMeasurement?.()
  }

  const handleFinish = () => {
    onFinish?.()
    onOpenChange(false)
  }

  if (!appointment) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle>Consulta Realizada</DialogTitle>
                <DialogDescription>
                  Consulta de {appointment.Patient?.fullName} marcada como realizada
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogBody>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  🎉 Parabéns pela consulta realizada!
                </h4>
                <p className="text-sm text-green-700">
                  Agora você pode adicionar novas medições para acompanhar o progresso do paciente.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Próximos passos:</h4>
                
                <button
                  onClick={handleAddMeasurement}
                  className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Plus className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-700">
                    Adicionar Nova Medição
                  </span>
                </button>

                <div className="text-sm text-gray-600 text-center">
                  <Activity className="h-4 w-4 inline mr-1" />
                  Registre peso, altura e outras métricas importantes
                </div>
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={handleFinish}>
              Pular por Agora
            </Button>
            <Button onClick={handleAddMeasurement}>
              Adicionar Medição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Measurement Form Modal */}
      <MeasurementFormModal
        open={isMeasurementModalOpen}
        onOpenChange={setIsMeasurementModalOpen}
        patientId={appointment?.patientId}
        onSuccess={handleMeasurementSuccess}
      />
    </>
  )
}
