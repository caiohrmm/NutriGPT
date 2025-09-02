import { motion } from 'framer-motion'
import { Users, Calendar, FileText, BarChart3, TrendingUp, Clock } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../context/AuthContext'

export function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Total de Pacientes',
      value: '0',
      description: 'Em breve você terá seus primeiros pacientes',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Consultas Hoje',
      value: '0',
      description: 'Nenhuma consulta agendada para hoje',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Planos Criados',
      value: '0',
      description: 'Planos alimentares personalizados',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Taxa de Sucesso',
      value: '--',
      description: 'Baseado no progresso dos pacientes',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const recentActivity = [
    {
      title: 'Sistema iniciado',
      description: 'Bem-vindo ao NutriGPT!',
      time: 'Agora',
      icon: TrendingUp,
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
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-1 bg-primary/10 rounded-full">
                          <Icon className="h-3 w-3 text-primary" />
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