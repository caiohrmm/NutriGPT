import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, FileText, BarChart3, TrendingUp, Clock, Activity, Target } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { patientAPI, appointmentAPI, planAPI } from '../lib/api'
import { formatDate, calculateAge } from '../utils/dateUtils'

export function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    totalPlans: 0,
    recentPatients: [],
    upcomingAppointments: [],
    recentActivity: []
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

      // Load all data in parallel
      const [patientsResponse, appointmentsResponse] = await Promise.all([
        patientAPI.list({ limit: 1000 }),
        appointmentAPI.list({ limit: 1000 })
      ])

      const patients = patientsResponse.data || []
      const appointments = appointmentsResponse.data || []

      // Filter today's appointments
      const appointmentsToday = appointments.filter(apt => {
        const aptDate = new Date(apt.startAt)
        return aptDate >= todayStart && aptDate <= todayEnd
      })

      // Get upcoming appointments (next 5)
      const upcomingAppointments = appointments
        .filter(apt => new Date(apt.startAt) > new Date())
        .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
        .slice(0, 5)

      // Get recent patients (last 5)
      const recentPatients = patients
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      // Count total plans (we'll need to implement this if not available)
      let totalPlans = 0
      try {
        // Try to get plans for all patients
        const planPromises = patients.slice(0, 10).map(patient => 
          planAPI.listByPatient(patient.id).catch(() => ({ data: [] }))
        )
        const planResponses = await Promise.all(planPromises)
        totalPlans = planResponses.reduce((total, response) => 
          total + (response.data?.length || 0), 0
        )
      } catch (error) {
        console.log('Could not load plans count:', error)
      }

      // Generate recent activity
      const recentActivity = [
        ...recentPatients.slice(0, 3).map(patient => ({
          title: `Novo paciente: ${patient.fullName}`,
          description: `${calculateAge(patient.birthDate)} - ${patient.goal || 'Sem objetivo definido'}`,
          time: formatDate(patient.createdAt),
          icon: Users,
          color: 'text-blue-600'
        })),
        ...upcomingAppointments.slice(0, 2).map(apt => ({
          title: `Consulta agendada`,
          description: `${apt.Patient?.fullName} - ${formatDate(apt.startAt)}`,
          time: 'Em breve',
          icon: Calendar,
          color: 'text-green-600'
        }))
      ].slice(0, 5)

      setDashboardData({
        totalPatients: patients.length,
        appointmentsToday: appointmentsToday.length,
        totalPlans,
        recentPatients,
        upcomingAppointments,
        recentActivity: recentActivity.length > 0 ? recentActivity : [{
          title: 'Sistema iniciado',
          description: 'Bem-vindo ao NutriGPT!',
          time: 'Agora',
          icon: TrendingUp,
          color: 'text-primary'
        }]
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: 'Total de Pacientes',
      value: loading ? '...' : dashboardData.totalPatients.toString(),
      description: dashboardData.totalPatients === 0 
        ? 'Em breve você terá seus primeiros pacientes' 
        : `${dashboardData.totalPatients} paciente${dashboardData.totalPatients !== 1 ? 's' : ''} cadastrado${dashboardData.totalPatients !== 1 ? 's' : ''}`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Consultas Hoje',
      value: loading ? '...' : dashboardData.appointmentsToday.toString(),
      description: dashboardData.appointmentsToday === 0 
        ? 'Nenhuma consulta agendada para hoje' 
        : `${dashboardData.appointmentsToday} consulta${dashboardData.appointmentsToday !== 1 ? 's' : ''} hoje`,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Planos Criados',
      value: loading ? '...' : dashboardData.totalPlans.toString(),
      description: dashboardData.totalPlans === 0 
        ? 'Crie seu primeiro plano alimentar' 
        : `${dashboardData.totalPlans} plano${dashboardData.totalPlans !== 1 ? 's' : ''} alimentar${dashboardData.totalPlans !== 1 ? 'es' : ''}`,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Próximas Consultas',
      value: loading ? '...' : dashboardData.upcomingAppointments.length.toString(),
      description: dashboardData.upcomingAppointments.length === 0 
        ? 'Nenhuma consulta agendada' 
        : `${dashboardData.upcomingAppointments.length} consulta${dashboardData.upcomingAppointments.length !== 1 ? 's' : ''} agendada${dashboardData.upcomingAppointments.length !== 1 ? 's' : ''}`,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl border border-primary/20 relative overflow-hidden">
            {/* Logo accent in background */}
            <div className="absolute top-4 right-4 opacity-10">
              <img
                src="/Logo.png"
                alt="NutriGPT"
                className="object-contain"
                style={{ width: 80, height: 80 }}
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/Logo.png"
                  alt="NutriGPT"
                  className="object-contain"
                  style={{ width: 32, height: 32 }}
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  Bem-vindo(a), {user?.name?.split(' ')[0]}! 👋
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Gerencie seus pacientes e planos alimentares de forma inteligente com o poder da IA.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  🤖 IA Integrada
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  📊 Analytics Avançado
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  🎯 Planos Personalizados
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-600">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Primeiros Passos</span>
                </CardTitle>
                <CardDescription>
                  Configure sua conta e comece a usar o NutriGPT
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Cadastre seu primeiro paciente</h4>
                      <p className="text-sm text-gray-600">Acesse a seção "Pacientes" no menu lateral</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Agende uma consulta</h4>
                      <p className="text-sm text-gray-600">Organize sua agenda na seção "Consultas"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Crie planos com IA</h4>
                      <p className="text-sm text-gray-600">Use nossa IA para gerar planos alimentares personalizados</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Atividade Recente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentActivity.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full ${activity.color ? 'bg-current/10' : 'bg-primary/10'}`}>
                          <Icon className={`h-3 w-3 ${activity.color || 'text-primary'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}