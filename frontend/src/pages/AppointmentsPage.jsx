import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useToasts } from '../components/ui/toast'
import { useConfirm } from '../components/ui/confirmation-modal'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  CalendarDays
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
import { AppointmentFormModal } from '../components/appointments/AppointmentFormModal'
import { PostAppointmentModal } from '../components/appointments/PostAppointmentModal'
import { appointmentAPI } from '../lib/api'

export function AppointmentsPage() {
  const [searchParams] = useSearchParams()
  const toast = useToasts()
  const confirm = useConfirm()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [isPostAppointmentModalOpen, setIsPostAppointmentModalOpen] = useState(false)
  const [completedAppointment, setCompletedAppointment] = useState(null)
  
  const pageSize = 10

  // Initialize search from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchInput(searchFromUrl)
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Auto-update expired appointments
  const autoUpdateExpiredAppointments = async (appointments) => {
    const now = new Date()
    const updatesNeeded = []

    for (const appointment of appointments) {
      const endTime = new Date(appointment.endAt)
      
      // If appointment end time has passed and it's still scheduled, mark as done
      if (appointment.status === 'scheduled' && endTime < now) {
        const bufferTime = 30 * 60 * 1000 // 30 minutes buffer
        if (now - endTime > bufferTime) {
          updatesNeeded.push(appointment.id)
        }
      }
    }

    if (updatesNeeded.length > 0) {
      try {
        await Promise.all(
          updatesNeeded.map(id => 
            appointmentAPI.update(id, { status: 'done' })
          )
        )
        console.log(`✅ Auto-updated ${updatesNeeded.length} expired appointments`)
      } catch (error) {
        console.error('❌ Error auto-updating appointments:', error)
      }
    }
  }

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(searchTerm && { patient: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      }
      
      const response = await appointmentAPI.list(params)
      const appointments = response.data || []
      
      // Auto-update expired appointments
      await autoUpdateExpiredAppointments(appointments)
      
      setAppointments(appointments)
      setTotal(response.meta?.total || 0)
      setTotalPages(response.meta?.totalPages || 1)
    } catch (error) {
      console.error('Error loading appointments:', error)
      setAppointments([])
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
    loadAppointments()
  }, [currentPage, searchTerm, statusFilter])

  const handleSearch = (e) => {
    setSearchInput(e.target.value)
  }

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleNewAppointment = () => {
    setEditingAppointment(null)
    setIsFormModalOpen(true)
  }

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment)
    setIsFormModalOpen(true)
  }

  const handleCancelAppointment = async (appointment) => {
    const confirmed = await confirm.cancel(`a consulta de ${appointment.Patient?.fullName}`)
    if (!confirmed) return
    
    try {
      await appointmentAPI.cancel(appointment.id)
      toast.success('Consulta cancelada com sucesso!')
      loadAppointments() // Reload list after cancel
    } catch (error) {
      console.error('Error canceling appointment:', error)
      toast.error('Erro ao cancelar consulta. Tente novamente.')
    }
  }

  const handleDeleteAppointment = async (appointment) => {
    const confirmed = await confirm.delete(`a consulta de ${appointment.Patient?.fullName}`)
    if (!confirmed) return
    
    try {
      await appointmentAPI.delete(appointment.id)
      toast.success('Consulta excluída com sucesso!')
      loadAppointments() // Reload list after delete
    } catch (error) {
      console.error('Error deleting appointment:', error)
      toast.error('Erro ao excluir consulta. Tente novamente.')
    }
  }

  const handleCompleteAppointment = async (appointment) => {
    const confirmed = await confirm.complete(`a consulta de ${appointment.Patient?.fullName}`)
    if (!confirmed) return
    
    try {
      await appointmentAPI.update(appointment.id, { status: 'done' })
      toast.success('Consulta finalizada com sucesso!')
      
      // Show post-appointment modal for adding measurements
      setCompletedAppointment(appointment)
      setIsPostAppointmentModalOpen(true)
      
      loadAppointments() // Reload list
    } catch (error) {
      console.error('Error completing appointment:', error)
      toast.error('Erro ao finalizar consulta. Tente novamente.')
    }
  }

  const handleFormSuccess = () => {
    loadAppointments() // Reload list after create/update
    setIsFormModalOpen(false)
  }

  const handlePostAppointmentAddMeasurement = () => {
    toast.success('Medição adicionada com sucesso!')
  }

  const handlePostAppointmentFinish = () => {
    setCompletedAppointment(null)
    setIsPostAppointmentModalOpen(false)
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'scheduled':
        return { 
          label: 'Agendada', 
          variant: 'info',
          icon: CalendarDays,
          color: 'text-blue-600'
        }
      case 'done':
        return { 
          label: 'Realizada', 
          variant: 'success',
          icon: CheckCircle,
          color: 'text-green-600'
        }
      case 'canceled':
        return { 
          label: 'Cancelada', 
          variant: 'destructive',
          icon: XCircle,
          color: 'text-red-600'
        }
      default:
        return { 
          label: 'Desconhecido', 
          variant: 'outline',
          icon: Clock,
          color: 'text-gray-600'
        }
    }
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const isUpcoming = (dateTimeString) => {
    return new Date(dateTimeString) > new Date()
  }

  return (
    <DashboardLayout title="Consultas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Consultas</h2>
            <p className="text-gray-600">
              {total > 0 ? `${total} consulta${total !== 1 ? 's' : ''} agendada${total !== 1 ? 's' : ''}` : 'Nenhuma consulta agendada'}
            </p>
          </div>
          <Button onClick={handleNewAppointment} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Consulta</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente..."
                  value={searchInput}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              <div className="w-48">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="scheduled">Agendada</option>
                  <option value="done">Realizada</option>
                  <option value="canceled">Cancelada</option>
                </select>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        {loading ? (
          <Card>
            <CardContent className="pt-16 pb-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando consultas...</p>
            </CardContent>
          </Card>
        ) : appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="pt-16 pb-16 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchInput || statusFilter ? 'Nenhuma consulta encontrada' : 'Nenhuma consulta agendada'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {searchInput || statusFilter 
                    ? 'Tente ajustar os filtros de busca para encontrar consultas.'
                    : 'Comece agendando sua primeira consulta para começar a atender seus pacientes.'
                  }
                </p>
                {!searchInput && !statusFilter && (
                  <Button onClick={handleNewAppointment} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Agendar Primeira Consulta</span>
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
                    <TableHead>Data & Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="w-[50px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const statusInfo = getStatusInfo(appointment.status)
                    const { date, time } = formatDateTime(appointment.startAt || appointment.scheduledAt)
                    const upcoming = isUpcoming(appointment.startAt || appointment.scheduledAt)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {appointment.Patient?.fullName || 'Paciente não encontrado'}
                              </p>
                              {appointment.Patient?.email && (
                                <p className="text-sm text-gray-600">
                                  {appointment.Patient.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-sm font-medium">{date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{time}</span>
                              {upcoming && appointment.status === 'scheduled' && (
                                <Badge variant="outline" className="text-xs">
                                  Próxima
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                            <Badge variant={statusInfo.variant} className="text-xs">
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {appointment.notes ? (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-3 w-3 text-gray-400" />
                              <span className="text-sm truncate max-w-[200px]" title={appointment.notes}>
                                {appointment.notes}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {new Date(appointment.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ActionMenu>
                            {(closeMenu) => (
                              <>
                                {appointment.status !== 'done' && (
                                  <ActionMenuItem onClick={() => {
                                    handleEditAppointment(appointment)
                                    closeMenu()
                                  }}>
                                    <Edit className="h-4 w-4 mr-3" />
                                    Reagendar Consulta
                                  </ActionMenuItem>
                                )}
                                
                                {appointment.status === 'scheduled' && (
                                  <>
                                    <ActionMenuItem 
                                      variant="primary"
                                      onClick={() => {
                                        handleCompleteAppointment(appointment)
                                        closeMenu()
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-3" />
                                      Marcar como Realizada
                                    </ActionMenuItem>
                                    
                                    <ActionMenuSeparator />
                                    
                                    <ActionMenuItem 
                                      variant="destructive"
                                      onClick={() => {
                                        handleCancelAppointment(appointment)
                                        closeMenu()
                                      }}
                                    >
                                      <XCircle className="h-4 w-4 mr-3" />
                                      Cancelar Consulta
                                    </ActionMenuItem>
                                  </>
                                )}
                                
                                {appointment.status === 'canceled' && (
                                  <ActionMenuItem 
                                    variant="primary"
                                    onClick={() => {
                                      handleEditAppointment(appointment)
                                      closeMenu()
                                    }}
                                  >
                                    <Calendar className="h-4 w-4 mr-3" />
                                    Reagendar Consulta
                                  </ActionMenuItem>
                                )}

                                <ActionMenuSeparator />
                                
                                <ActionMenuItem 
                                  variant="destructive"
                                  onClick={() => {
                                    handleDeleteAppointment(appointment)
                                    closeMenu()
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-3" />
                                  Excluir Consulta
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
                    Página {currentPage} de {totalPages} • {total} consultas
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

        {/* Appointment Form Modal */}
        <AppointmentFormModal
          open={isFormModalOpen}
          onOpenChange={setIsFormModalOpen}
          appointment={editingAppointment}
          onSuccess={handleFormSuccess}
        />

        {/* Post Appointment Modal */}
        <PostAppointmentModal
          open={isPostAppointmentModalOpen}
          onOpenChange={setIsPostAppointmentModalOpen}
          appointment={completedAppointment}
          onAddMeasurement={handlePostAppointmentAddMeasurement}
          onFinish={handlePostAppointmentFinish}
        />
      </div>
    </DashboardLayout>
  )
}