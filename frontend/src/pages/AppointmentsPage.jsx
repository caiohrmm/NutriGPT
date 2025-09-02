import { motion } from 'framer-motion'
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { DashboardLayout } from '../layouts/DashboardLayout'

export function AppointmentsPage() {
  const today = new Date()
  const monthName = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <DashboardLayout title="Consultas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agenda de Consultas</h2>
            <p className="text-gray-600">Gerencie seus agendamentos e consultas</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Consulta</span>
          </Button>
        </div>

        {/* Calendar Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Hoje</Button>
                <Button variant="outline" size="sm">Semana</Button>
                <Button variant="outline" size="sm">Mês</Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Empty State */}
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
                Nenhuma consulta agendada
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Organize sua agenda agendando consultas com seus pacientes. Mantenha tudo organizado em um só lugar.
              </p>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Agendar Primera Consulta</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
