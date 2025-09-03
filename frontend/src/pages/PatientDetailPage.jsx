import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  Activity,
  Plus,
  Edit,
  TrendingUp,
  TrendingDown,
  Minus,
  Weight,
  Ruler
} from 'lucide-react'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { MeasurementFormModal } from '../components/patients/MeasurementFormModal'
import { AppointmentFormModal } from '../components/appointments/AppointmentFormModal'
import { patientAPI, measurementAPI } from '../lib/api'

export function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [patient, setPatient] = useState(null)
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [measurementsLoading, setMeasurementsLoading] = useState(true)
  
  // Modal states
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false)
  const [editingMeasurement, setEditingMeasurement] = useState(null)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)

  useEffect(() => {
    loadPatientData()
  }, [id])

  const loadPatientData = async () => {
    try {
      setLoading(true)
      
      // Load patient info
      const patientResponse = await patientAPI.getById(id)
      setPatient(patientResponse.patient)
      
      // Load measurements
      setMeasurementsLoading(true)
      const measurementsResponse = await measurementAPI.listByPatient(id, {
        pageSize: 20,
        sort: 'date:desc'
      })
      setMeasurements(measurementsResponse.data?.data || [])
      
    } catch (error) {
      console.error('Error loading patient data:', error)
      if (error.response?.status === 404) {
        navigate('/patients') // Redirect if patient not found
      }
    } finally {
      setLoading(false)
      setMeasurementsLoading(false)
    }
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
    if (bmiValue < 18.5) return { label: 'Abaixo do peso', variant: 'info', color: 'text-blue-600' }
    if (bmiValue < 25) return { label: 'Peso normal', variant: 'success', color: 'text-green-600' }
    if (bmiValue < 30) return { label: 'Sobrepeso', variant: 'warning', color: 'text-yellow-600' }
    return { label: 'Obesidade', variant: 'destructive', color: 'text-red-600' }
  }

  const getWeightTrend = () => {
    if (measurements.length < 2) return null
    
    const latest = measurements[0]
    const previous = measurements[1]
    
    if (!latest.weight || !previous.weight) return null
    
    const diff = latest.weight - previous.weight
    const percentage = ((diff / previous.weight) * 100).toFixed(1)
    
    return {
      diff: diff.toFixed(1),
      percentage,
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable'
    }
  }

  const handleNewMeasurement = () => {
    setEditingMeasurement(null)
    setIsMeasurementModalOpen(true)
  }

  const handleEditMeasurement = (measurement) => {
    setEditingMeasurement(measurement)
    setIsMeasurementModalOpen(true)
  }

  const handleMeasurementSuccess = () => {
    loadPatientData() // Reload measurements after create/update
  }

  const handleNewAppointment = () => {
    setIsAppointmentModalOpen(true)
  }

  const handleAppointmentSuccess = () => {
    // Could show a success message or redirect to appointments page
    alert('Consulta agendada com sucesso!')
  }

  if (loading) {
    return (
      <DashboardLayout title="Carregando...">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!patient) {
    return (
      <DashboardLayout title="Paciente não encontrado">
        <div className="text-center py-16">
          <p className="text-gray-600">Paciente não encontrado</p>
          <Button onClick={() => navigate('/patients')} className="mt-4">
            Voltar para Pacientes
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const age = calculateAge(patient.birthDate)
  const currentBMI = calculateBMI(patient.weight, patient.height)
  const bmiStatus = getBMIStatus(currentBMI)
  const weightTrend = getWeightTrend()

  return (
    <DashboardLayout title={patient.fullName}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/patients')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{patient.fullName}</h1>
            <p className="text-gray-600">Detalhes do paciente e métricas</p>
          </div>
          <Button onClick={handleNewAppointment} className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Agendar Consulta</span>
          </Button>
        </div>

        {/* Patient Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{patient.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Não informado'}
                      {age && ` • ${age} anos`}
                    </p>
                  </div>
                </div>
                
                {patient.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{patient.email}</span>
                  </div>
                )}
                
                {patient.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Weight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Peso Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Weight className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {patient.weight ? `${patient.weight} kg` : '-'}
                    </p>
                    {weightTrend && (
                      <div className="flex items-center space-x-1 text-sm">
                        {weightTrend.trend === 'up' && (
                          <>
                            <TrendingUp className="h-3 w-3 text-red-500" />
                            <span className="text-red-600">+{weightTrend.diff} kg</span>
                          </>
                        )}
                        {weightTrend.trend === 'down' && (
                          <>
                            <TrendingDown className="h-3 w-3 text-green-500" />
                            <span className="text-green-600">{weightTrend.diff} kg</span>
                          </>
                        )}
                        {weightTrend.trend === 'stable' && (
                          <>
                            <Minus className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-600">Estável</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Height & BMI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Altura & IMC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {patient.height ? `${patient.height} cm` : 'Não informado'}
                    </span>
                  </div>
                  
                  {currentBMI && bmiStatus && (
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">IMC {currentBMI}</span>
                      </div>
                      <Badge variant={bmiStatus.variant} className="mt-1">
                        {bmiStatus.label}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Objetivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      {patient.goal || 'Nenhum objetivo definido'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Measurements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Histórico de Medições</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Acompanhe a evolução das medidas do paciente
                  </p>
                </div>
                <Button onClick={handleNewMeasurement} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nova Medição</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {measurementsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Carregando medições...</p>
                </div>
              ) : measurements.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma medição registrada
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece registrando as primeiras medições deste paciente
                  </p>
                  <Button onClick={handleNewMeasurement} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Primeira Medição</span>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead>Altura (cm)</TableHead>
                      <TableHead>IMC</TableHead>
                      <TableHead>% Gordura</TableHead>
                      <TableHead>Cintura (cm)</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements.map((measurement) => (
                      <TableRow 
                        key={measurement.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleEditMeasurement(measurement)}
                      >
                        <TableCell>
                          {new Date(measurement.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {measurement.weight || '-'}
                        </TableCell>
                        <TableCell>
                          {measurement.heightCm || '-'}
                        </TableCell>
                        <TableCell>
                          {measurement.bmi || '-'}
                        </TableCell>
                        <TableCell>
                          {measurement.bodyFatPercentage ? `${measurement.bodyFatPercentage}%` : '-'}
                        </TableCell>
                        <TableCell>
                          {measurement.waistCircumference || '-'}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 truncate max-w-[100px] block" title={measurement.notes}>
                            {measurement.notes || '-'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info */}
        {(patient.allergies?.length > 0 || patient.notes) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patient.allergies?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Alergias e Restrições
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {patient.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{patient.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {/* Measurement Form Modal */}
        <MeasurementFormModal
          open={isMeasurementModalOpen}
          onOpenChange={setIsMeasurementModalOpen}
          patientId={id}
          measurement={editingMeasurement}
          onSuccess={handleMeasurementSuccess}
        />

        {/* Appointment Form Modal */}
        <AppointmentFormModal
          open={isAppointmentModalOpen}
          onOpenChange={setIsAppointmentModalOpen}
          patientId={id}
          patientName={patient?.fullName}
          onSuccess={handleAppointmentSuccess}
        />
      </div>
    </DashboardLayout>
  )
}
