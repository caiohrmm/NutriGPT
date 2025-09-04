import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Activity,
  Calendar,
  Mail,
  Phone,
  Target,
  User
} from 'lucide-react'

import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
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
import {
  ActionMenu,
  ActionMenuItem,
  ActionMenuSeparator,
} from '../components/ui/action-menu'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { PatientFormModal } from '../components/patients/PatientFormModal'
import { AppointmentFormModal } from '../components/appointments/AppointmentFormModal'
import { useToasts } from '../components/ui/toast'
import { useConfirm } from '../components/ui/confirmation-modal'
import { patientAPI } from '../lib/api'
import { calculateAge } from '../utils/dateUtils'

export function PatientsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToasts()
  const confirm = useConfirm()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [goalFilter, setGoalFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null)
  
  const pageSize = 10

  // Initialize search from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchInput(searchFromUrl)
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  const loadPatients = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(searchTerm && { name: searchTerm }),
        ...(goalFilter && { goal: goalFilter }),
      }
      
      const response = await patientAPI.list(params)
      setPatients(response.data || [])
      setTotal(response.meta?.total || 0)
      setTotalPages(response.meta?.totalPages || 1)
    } catch (error) {
      console.error('Error loading patients:', error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput)
      setCurrentPage(1)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    loadPatients()
  }, [currentPage, searchTerm, goalFilter])

  const handleSearch = (e) => {
    setSearchInput(e.target.value)
  }

  const handleGoalFilter = (e) => {
    setGoalFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleNewPatient = () => {
    setEditingPatient(null)
    setIsFormModalOpen(true)
  }

  const handleEditPatient = (patient) => {
    setEditingPatient(patient)
    setIsFormModalOpen(true)
  }

  const handleDeletePatient = async (patient) => {
    const confirmed = await confirm.delete(`o paciente ${patient.fullName}`)
    if (!confirmed) return

    try {
      await patientAPI.delete(patient.id)
      toast.success(`Paciente ${patient.fullName} excluído com sucesso`)
      loadPatients() // Reload list
    } catch (error) {
      console.error('Error deleting patient:', error)
      toast.error(error.response?.data?.message || 'Erro ao excluir paciente')
    }
  }

  const handleFormSuccess = () => {
    loadPatients() // Reload list after create/update
  }

  const handleScheduleAppointment = (patient) => {
    setSelectedPatientForAppointment(patient)
    setIsAppointmentModalOpen(true)
  }

  const handleAppointmentSuccess = () => {
    setIsAppointmentModalOpen(false)
    toast.success('Consulta agendada com sucesso!')
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
    <DashboardLayout title="Pacientes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Pacientes</h2>
            <p className="text-gray-600">
              {total > 0 ? `${total} paciente${total !== 1 ? 's' : ''} cadastrado${total !== 1 ? 's' : ''}` : 'Nenhum paciente cadastrado'}
            </p>
          </div>
          <Button onClick={handleNewPatient} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Paciente</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchInput}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              <div className="w-48">
                <Input
                  placeholder="Filtrar por objetivo..."
                  value={goalFilter}
                  onChange={handleGoalFilter}
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        {loading ? (
          <Card>
            <CardContent className="pt-16 pb-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando pacientes...</p>
            </CardContent>
          </Card>
        ) : patients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="pt-16 pb-16 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchInput || goalFilter ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {searchInput || goalFilter 
                    ? 'Tente ajustar os filtros de busca para encontrar pacientes.'
                    : 'Comece cadastrando seu primeiro paciente para começar a usar todas as funcionalidades do NutriGPT.'
                  }
                </p>
                {!searchInput && !goalFilter && (
                  <Button onClick={handleNewPatient} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Cadastrar Primeiro Paciente</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>IMC</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="w-[50px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const age = calculateAge(patient.birthDate)
                    const bmi = calculateBMI(patient.weight, patient.height)
                    const bmiStatus = getBMIStatus(bmi)
                    
                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{patient.fullName}</p>
                              <p className="text-sm text-gray-600">
                                {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Não informado'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {patient.email && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span>{patient.email}</span>
                              </div>
                            )}
                            {patient.phone && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{patient.phone}</span>
                              </div>
                            )}
                            {!patient.email && !patient.phone && (
                              <span className="text-sm text-gray-400">Não informado</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{age}</span>
                        </TableCell>
                        <TableCell>
                          {bmi ? (
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{bmi}</span>
                              {bmiStatus && (
                                <Badge variant={bmiStatus.variant} className="text-xs">
                                  {bmiStatus.label}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {patient.goal ? (
                            <div className="flex items-center space-x-2">
                              <Target className="h-3 w-3 text-gray-400" />
                              <span className="text-sm truncate max-w-[150px]" title={patient.goal}>
                                {patient.goal}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ActionMenu>
                            {(closeMenu) => (
                              <>
                                <ActionMenuItem onClick={() => {
                                  handleEditPatient(patient)
                                  closeMenu()
                                }}>
                                  <Edit className="h-4 w-4 mr-3" />
                                  Editar Paciente
                                </ActionMenuItem>
                                
                                <ActionMenuItem onClick={() => {
                                  closeMenu()
                                  navigate(`/patients/${patient.id}`)
                                }}>
                                  <Activity className="h-4 w-4 mr-3" />
                                  Ver Métricas
                                </ActionMenuItem>
                                
                                <ActionMenuItem onClick={() => {
                                  handleScheduleAppointment(patient)
                                  closeMenu()
                                }}>
                                  <Calendar className="h-4 w-4 mr-3" />
                                  Agendar Consulta
                                </ActionMenuItem>
                                
                                <ActionMenuSeparator />
                                
                                <ActionMenuItem 
                                  variant="destructive"
                                  onClick={() => {
                                    handleDeletePatient(patient)
                                    closeMenu()
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-3" />
                                  Excluir Paciente
                                </ActionMenuItem>
                              </>
                            )}
                          </ActionMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages} • {total} pacientes
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Patient Form Modal */}
        <PatientFormModal
          open={isFormModalOpen}
          onOpenChange={setIsFormModalOpen}
          patient={editingPatient}
          onSuccess={handleFormSuccess}
        />

        {/* Appointment Form Modal */}
        <AppointmentFormModal
          open={isAppointmentModalOpen}
          onOpenChange={setIsAppointmentModalOpen}
          patientId={selectedPatientForAppointment?.id}
          patientName={selectedPatientForAppointment?.fullName}
          onSuccess={handleAppointmentSuccess}
        />
      </div>
    </DashboardLayout>
  )
}