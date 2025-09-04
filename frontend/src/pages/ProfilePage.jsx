import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Camera, Award, Calendar, BookOpen, Target, Stethoscope } from 'lucide-react'

import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../lib/api'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

export function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleProfileSubmit = async (data) => {
    setIsLoadingProfile(true)
    setSuccessMessage('')
    try {
      const response = await userAPI.updateProfile({ name: data.name })
      updateUser(response.user)
      setSuccessMessage('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      profileForm.setError('root', { 
        message: error.response?.data?.message || 'Erro ao atualizar perfil' 
      })
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handlePasswordSubmit = async (data) => {
    setIsLoadingPassword(true)
    setSuccessMessage('')
    try {
      await userAPI.updateProfile({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      passwordForm.reset()
      setSuccessMessage('Senha alterada com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      if (error.response?.data?.details) {
        error.response.data.details.forEach((detail) => {
          passwordForm.setError(detail.field, { message: detail.message })
        })
      } else {
        passwordForm.setError('root', {
          message: error.response?.data?.message || 'Erro ao alterar senha'
        })
      }
    } finally {
      setIsLoadingPassword(false)
    }
  }

  return (
    <DashboardLayout title="Meu Perfil">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">Nutricionista</p>
                  <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize seu nome (o email não pode ser alterado)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      placeholder="Dr(a). Seu Nome"
                      {...profileForm.register('name')}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                  </div>
                </div>

                {profileForm.formState.errors.root && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {profileForm.formState.errors.root.message}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoadingProfile}>
                    {isLoadingProfile ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Informações Profissionais
              </CardTitle>
              <CardDescription>
                Dados importantes para sua prática profissional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Award className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Especialidades</h3>
                      <p className="text-sm text-blue-700">Nutrição Esportiva, Emagrecimento, Nutrição Clínica</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Experiência</h3>
                      <p className="text-sm text-green-700">5+ anos atendendo pacientes</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-purple-900">Formação</h3>
                      <p className="text-sm text-purple-700">Nutricionista formado(a) com pós-graduação</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                    <Target className="h-8 w-8 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-orange-900">Objetivo</h3>
                      <p className="text-sm text-orange-700">Transformar vidas através da alimentação saudável</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Sobre sua prática</h3>
                <p className="text-sm text-gray-700">
                  "Acredito que uma alimentação equilibrada é a base para uma vida saudável e feliz. 
                  Meu objetivo é ajudar cada paciente a encontrar o seu caminho para o bem-estar, 
                  respeitando suas preferências e necessidades individuais."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Altere sua senha de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      {...passwordForm.register('newPassword')}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      {...passwordForm.register('confirmPassword')}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {passwordForm.formState.errors.root && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {passwordForm.formState.errors.root.message}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoadingPassword}>
                    {isLoadingPassword ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
