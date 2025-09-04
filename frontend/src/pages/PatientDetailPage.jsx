import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToasts } from '../components/ui/toast'
import { useConfirm } from '../components/ui/confirmation-modal'
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
  Ruler,
  ChefHat
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
import { MealPlanFormModal } from '../components/patients/MealPlanFormModal'
import { MealPlanCard } from '../components/patients/MealPlanCard'
import { patientAPI, measurementAPI, planAPI } from '../lib/api'
import { calculateAge, formatDate } from '../utils/dateUtils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToasts()
  const confirm = useConfirm()
  
  const [patient, setPatient] = useState(null)
  const [measurements, setMeasurements] = useState([])
  const [mealPlans, setMealPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [measurementsLoading, setMeasurementsLoading] = useState(true)
  const [mealPlansLoading, setMealPlansLoading] = useState(true)
  
  // Modal states
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false)
  const [editingMeasurement, setEditingMeasurement] = useState(null)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isMealPlanModalOpen, setIsMealPlanModalOpen] = useState(false)
  const [editingMealPlan, setEditingMealPlan] = useState(null)

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

      // Load meal plans
      setMealPlansLoading(true)
      const mealPlansResponse = await planAPI.listByPatient(id)
      setMealPlans(mealPlansResponse.data?.data || [])
      
    } catch (error) {
      console.error('Error loading patient data:', error)
      if (error.response?.status === 404) {
        navigate('/patients') // Redirect if patient not found
      }
    } finally {
      setLoading(false)
      setMeasurementsLoading(false)
      setMealPlansLoading(false)
    }
  }



  // Get latest measurement data
  const getLatestMeasurement = () => {
    return measurements.length > 0 ? measurements[0] : null
  }

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    return bmi.toFixed(1)
  }

  // Prepare data for charts
  const prepareWeightChartData = () => {
    return measurements
      .filter(m => m.weight)
      .slice(0, 10) // Last 10 measurements
      .reverse()
      .map(m => ({
        date: formatDate(m.date),
        weight: parseFloat(m.weight),
        bmi: m.height ? calculateBMI(m.weight, m.height) : null
      }))
  }

  const prepareBMIChartData = () => {
    return measurements
      .filter(m => m.weight && m.height)
      .slice(0, 10)
      .reverse()
      .map(m => ({
        date: formatDate(m.date),
        bmi: parseFloat(calculateBMI(m.weight, m.height))
      }))
  }

  const prepareBodyCompositionData = () => {
    const latest = getLatestMeasurement()
    if (!latest) return []

    const data = []
    if (latest.bodyFat) data.push({ name: 'Gordura Corporal', value: parseFloat(latest.bodyFat), color: '#ef4444' })
    if (latest.muscleMass) data.push({ name: 'Massa Muscular', value: parseFloat(latest.muscleMass), color: '#22c55e' })
    if (latest.bodyWater) data.push({ name: 'Água Corporal', value: parseFloat(latest.bodyWater), color: '#3b82f6' })
    
    return data
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
    toast.success('Consulta agendada com sucesso!')
  }

  // Meal Plan handlers
  const handleNewMealPlan = () => {
    setEditingMealPlan(null)
    setIsMealPlanModalOpen(true)
  }

  const handleEditMealPlan = (plan) => {
    setEditingMealPlan(plan)
    setIsMealPlanModalOpen(true)
  }

  const handleMealPlanSuccess = () => {
    loadPatientData() // Reload data after create/update
    setIsMealPlanModalOpen(false)
  }

  const handleToggleActivePlan = async (plan) => {
    try {
      await planAPI.toggleActive(plan.id)
      const action = plan.isActive ? 'desativado' : 'ativado'
      toast.success(`Plano "${plan.name}" ${action} com sucesso!`)
      loadPatientData() // Reload data after toggle
    } catch (error) {
      console.error('Error toggling plan active status:', error)
      toast.error('Erro ao alterar status do plano. Tente novamente.')
    }
  }

  const handleDeleteMealPlan = async (plan) => {
    const confirmed = await confirm.delete(`o plano "${plan.name}"`)
    if (confirmed) {
      try {
        await planAPI.delete(plan.id)
        toast.success('Plano alimentar excluído com sucesso!')
        loadPatientData() // Reload data after delete
      } catch (error) {
        console.error('Error deleting meal plan:', error)
        toast.error('Erro ao excluir plano alimentar. Tente novamente.')
      }
    }
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
  const latestMeasurement = getLatestMeasurement()
  const currentWeight = latestMeasurement?.weight || patient.weight
  const currentHeight = latestMeasurement?.height || patient.height
  const currentBMI = calculateBMI(currentWeight, currentHeight)
  const bmiStatus = getBMIStatus(currentBMI)
  const weightTrend = getWeightTrend()
  
  // Chart data
  const weightChartData = prepareWeightChartData()
  const bmiChartData = prepareBMIChartData()
  const bodyCompositionData = prepareBodyCompositionData()

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                    <p className="font-medium text-sm">{patient.fullName}</p>
                    <p className="text-xs text-gray-600">
                      {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Não informado'}
                    </p>
                    <p className="text-xs text-gray-600">{age}</p>
                  </div>
                </div>
                
                {patient.email && (
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                )}
                
                {patient.phone && (
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Phone className="h-3 w-3" />
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
                      {currentWeight ? `${currentWeight} kg` : '-'}
                    </p>
                    {latestMeasurement && (
                      <p className="text-xs text-gray-500">
                        Última medição: {formatDate(latestMeasurement.date)}
                      </p>
                    )}
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

          {/* Current Height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Altura Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                    <Ruler className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentHeight ? `${currentHeight} cm` : '-'}
                    </p>
                    {latestMeasurement && currentHeight && (
                      <p className="text-xs text-gray-500">
                        Última medição: {formatDate(latestMeasurement.date)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current BMI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">IMC Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    {currentBMI ? (
                      <>
                        <p className="text-2xl font-bold text-gray-900">{currentBMI}</p>
                        {bmiStatus && (
                          <Badge variant={bmiStatus.variant} className="mt-1 text-xs">
                            {bmiStatus.label}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-gray-400">-</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
                    <p className="text-sm text-gray-900 leading-tight">
                      {patient.goal || 'Nenhum objetivo definido'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        {measurements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Weight Evolution Chart */}
            {weightChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Evolução do Peso</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Acompanhe a evolução do peso nas últimas {weightChartData.length} medições
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          fontSize={12}
                          tick={{ fill: '#6b7280' }}
                        />
                        <YAxis 
                          fontSize={12}
                          tick={{ fill: '#6b7280' }}
                          domain={['dataMin - 2', 'dataMax + 2']}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* BMI Evolution Chart */}
            {bmiChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <span>Evolução do IMC</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Acompanhe a evolução do IMC nas últimas {bmiChartData.length} medições
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bmiChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          fontSize={12}
                          tick={{ fill: '#6b7280' }}
                        />
                        <YAxis 
                          fontSize={12}
                          tick={{ fill: '#6b7280' }}
                          domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="bmi"
                          stroke="#f97316"
                          strokeWidth={3}
                          dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Body Composition Chart */}
        {bodyCompositionData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Composição Corporal Atual</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Dados da última medição - {latestMeasurement && formatDate(latestMeasurement.date)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bodyCompositionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {bodyCompositionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, '']}
                          contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {bodyCompositionData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-2xl font-bold" style={{ color: item.color }}>
                            {item.value}%
                          </p>
                        </div>
                      </div>
                    ))}
                    {latestMeasurement?.visceralFat && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">Gordura Visceral</p>
                        <p className="text-xl font-bold text-red-600">{latestMeasurement.visceralFat}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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

        {/* Meal Plans Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5" />
                    <span>Planos Alimentares</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Gerencie os planos alimentares personalizados para este paciente
                  </p>
                </div>
                <Button onClick={handleNewMealPlan} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Novo Plano</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mealPlansLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Carregando planos alimentares...</p>
                </div>
              ) : mealPlans.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum plano alimentar criado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece criando o primeiro plano alimentar personalizado para este paciente
                  </p>
                  <Button onClick={handleNewMealPlan} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Criar Primeiro Plano</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mealPlans.map((plan, index) => (
                    <MealPlanCard
                      key={plan.id}
                      plan={plan}
                      index={index}
                      onEdit={handleEditMealPlan}
                      onDelete={handleDeleteMealPlan}
                      onToggleActive={handleToggleActivePlan}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info */}
        {(patient.allergies?.length > 0 || patient.notes) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
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

        <MealPlanFormModal
          open={isMealPlanModalOpen}
          onOpenChange={setIsMealPlanModalOpen}
          patient={patient}
          plan={editingMealPlan}
          onSuccess={handleMealPlanSuccess}
        />
      </div>
    </DashboardLayout>
  )
}
