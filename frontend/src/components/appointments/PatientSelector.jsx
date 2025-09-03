import { useState, useEffect } from 'react'
import { Search, User, Mail, Phone, Target } from 'lucide-react'
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
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'
import { patientAPI } from '../../lib/api'

export function PatientSelector({ open, onOpenChange, selectedPatient, onPatientSelect }) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState(selectedPatient?.id || null)

  const loadPatients = async () => {
    setLoading(true)
    try {
      const params = {
        limit: 50, // Load more patients for selection
        ...(searchTerm && { name: searchTerm }),
      }
      
      const response = await patientAPI.list(params)
      setPatients(response.data || [])
    } catch (error) {
      console.error('Error loading patients:', error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadPatients()
    }
  }, [open, searchTerm])

  useEffect(() => {
    setSelectedPatientId(selectedPatient?.id || null)
  }, [selectedPatient])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handlePatientClick = (patient) => {
    setSelectedPatientId(patient.id)
  }

  const handleConfirm = () => {
    const patient = patients.find(p => p.id === selectedPatientId)
    if (patient) {
      onPatientSelect(patient)
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setSelectedPatientId(selectedPatient?.id || null)
    setSearchTerm('')
    onOpenChange(false)
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    return bmi.toFixed(1)
  }

  const getBMIStatus = (bmi) => {
    if (!bmi) return null
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5) return { label: 'Abaixo', variant: 'info' }
    if (bmiValue < 25) return { label: 'Normal', variant: 'success' }
    if (bmiValue < 30) return { label: 'Sobrepeso', variant: 'warning' }
    return { label: 'Obesidade', variant: 'destructive' }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Selecionar Paciente</span>
          </DialogTitle>
          <DialogDescription>
            Escolha o paciente para agendar a consulta
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar paciente por nome..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>

          {/* Patients List */}
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando pacientes...</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Tente ajustar o termo de busca.'
                    : 'Cadastre pacientes antes de agendar consultas.'
                  }
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {patients.map((patient) => {
                  const age = calculateAge(patient.birthDate)
                  const bmi = calculateBMI(patient.weight, patient.height)
                  const bmiStatus = getBMIStatus(bmi)
                  const isSelected = selectedPatientId === patient.id
                  
                  return (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientClick(patient)}
                      className={cn(
                        'w-full p-4 text-left rounded-lg border-2 transition-all hover:shadow-md',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {patient.fullName}
                              </h3>
                              {age && (
                                <Badge variant="outline" className="text-xs">
                                  {age} anos
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              {/* Contact Info */}
                              <div className="space-y-1">
                                {patient.email && (
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{patient.email}</span>
                                  </div>
                                )}
                                {patient.phone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-3 w-3" />
                                    <span>{patient.phone}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Additional Info */}
                              <div className="space-y-1">
                                {patient.goal && (
                                  <div className="flex items-center space-x-2">
                                    <Target className="h-3 w-3" />
                                    <span className="truncate" title={patient.goal}>
                                      {patient.goal}
                                    </span>
                                  </div>
                                )}
                                {bmi && (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs">IMC:</span>
                                    <span className="font-medium">{bmi}</span>
                                    {bmiStatus && (
                                      <Badge variant={bmiStatus.variant} className="text-xs">
                                        {bmiStatus.label}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="ml-3 flex-shrink-0">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Selected Patient Summary */}
          {selectedPatientId && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Paciente selecionado:</span>{' '}
                {patients.find(p => p.id === selectedPatientId)?.fullName}
              </p>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedPatientId}
          >
            Confirmar Seleção
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
