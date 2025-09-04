import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToasts } from '../ui/toast'
import { 
  Brain, 
  ChefHat, 
  Plus, 
  Trash2, 
  Save,
  Wand2,
  Clock,
  Utensils,
  Flame,
  Activity
} from 'lucide-react'

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
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { planAPI } from '../../lib/api'

const mealSchema = z.object({
  time: z.string().min(1, 'Horário é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  items: z.array(z.string()).min(1, 'Pelo menos um item é obrigatório'),
  calories: z.number().optional(),
  macros: z.object({
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fats: z.number().optional(),
  }).optional(),
})

const planSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  meals: z.array(mealSchema).min(1, 'Pelo menos uma refeição é obrigatória'),
  totalCalories: z.number().optional(),
  macros: z.object({
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fats: z.number().optional(),
  }).optional(),
})

const aiPreferencesSchema = z.object({
  notes: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
})

export function MealPlanFormModal({ 
  open, 
  onOpenChange, 
  patient,
  plan = null, 
  onSuccess 
}) {
  const toast = useToasts()
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [showAIForm, setShowAIForm] = useState(false)
  const isEditing = !!plan

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      meals: [{
        time: '08:00',
        title: 'Café da Manhã',
        items: [''],
        calories: undefined,
        macros: { protein: undefined, carbs: undefined, fats: undefined }
      }],
      totalCalories: undefined,
      macros: { protein: undefined, carbs: undefined, fats: undefined }
    },
  })

  const {
    register: registerAI,
    handleSubmit: handleSubmitAI,
    formState: { errors: aiErrors },
  } = useForm({
    resolver: zodResolver(aiPreferencesSchema),
    defaultValues: {
      notes: '',
    },
  })

  const watchedMeals = watch('meals')

  // Reset form when plan changes or modal opens
  useEffect(() => {
    if (open) {
      if (plan) {
        reset({
          name: plan.name || '',
          description: plan.description || '',
          meals: plan.meals || [{
            time: '08:00',
            title: 'Café da Manhã',
            items: [''],
            calories: undefined,
            macros: { protein: undefined, carbs: undefined, fats: undefined }
          }],
          totalCalories: plan.totalCalories || undefined,
          macros: plan.macros || { protein: undefined, carbs: undefined, fats: undefined }
        })
      } else {
        reset({
          name: 'Plano Alimentar',
          description: '',
          meals: [{
            time: '08:00',
            title: 'Café da Manhã',
            items: [''],
            calories: undefined,
            macros: { protein: undefined, carbs: undefined, fats: undefined }
          }],
          totalCalories: undefined,
          macros: { protein: undefined, carbs: undefined, fats: undefined }
        })
      }
      setAiSuggestion(null)
      setShowAIForm(false)
    }
  }, [open, plan, reset])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const apiData = {
        patientId: patient.id,
        name: data.name,
        description: data.description || null,
        meals: data.meals.map(meal => {
          const filteredItems = meal.items.filter(item => item.trim() !== '')
          return {
            time: meal.time,
            title: meal.title,
            items: filteredItems.length > 0 ? filteredItems : ['Não especificado'],
            calories: meal.calories && meal.calories > 0 ? Math.round(meal.calories) : null,
            macros: {
              protein: meal.macros?.protein && meal.macros.protein >= 0 ? Math.round(meal.macros.protein * 10) / 10 : null,
              carbs: meal.macros?.carbs && meal.macros.carbs >= 0 ? Math.round(meal.macros.carbs * 10) / 10 : null,
              fats: meal.macros?.fats && meal.macros.fats >= 0 ? Math.round(meal.macros.fats * 10) / 10 : null,
            }
          }
        }),
        totalCalories: data.totalCalories && data.totalCalories > 0 ? Math.round(data.totalCalories) : null,
        macros: {
          protein: data.macros?.protein && data.macros.protein >= 0 ? Math.round(data.macros.protein * 10) / 10 : null,
          carbs: data.macros?.carbs && data.macros.carbs >= 0 ? Math.round(data.macros.carbs * 10) / 10 : null,
          fats: data.macros?.fats && data.macros.fats >= 0 ? Math.round(data.macros.fats * 10) / 10 : null,
        },
        aiGenerated: !!aiSuggestion,
      }

      if (isEditing) {
        await planAPI.update(plan.id, apiData)
      } else {
        await planAPI.create(apiData)
      }

      toast.success(isEditing ? 'Plano alimentar atualizado com sucesso!' : 'Plano alimentar criado com sucesso!')
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving meal plan:', error)
      
      const errorMessage = error.response?.data?.message || 'Erro ao salvar plano alimentar. Tente novamente.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onGenerateAI = async (preferences) => {
    setIsGeneratingAI(true)
    try {
      const response = await planAPI.generateAISuggestion({
        patientId: patient.id,
        name: 'Plano Alimentar Personalizado',
        preferences: preferences
      })

      setAiSuggestion(response.data.suggestion)
      
      // Fill form with AI suggestion
      if (response.data.suggestion?.meals) {
        // Normalize meals to ensure items are strings
        const normalizedMeals = response.data.suggestion.meals.map(meal => ({
          ...meal,
          items: Array.isArray(meal.items) ? meal.items.map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item !== null) {
              return item.name || item.food || item.item || item.description || item.text || String(item);
            }
            return String(item);
          }) : []
        }));

        setValue('name', response.data.name || 'Plano Alimentar Personalizado')
        setValue('description', response.data.suggestion.description || '')
        setValue('meals', normalizedMeals)
        setValue('totalCalories', response.data.suggestion.totalCalories || undefined)
        setValue('macros', response.data.suggestion.macros || { protein: undefined, carbs: undefined, fats: undefined })
      }
      
      toast.success('Sugestão de IA gerada com sucesso!')
      setShowAIForm(false)
    } catch (error) {
      console.error('Error generating AI suggestion:', error)
      
      const errorMessage = error.response?.data?.message || 'Erro ao gerar sugestão com IA. Tente novamente.'
      toast.error(errorMessage)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const addMeal = () => {
    const currentMeals = watch('meals')
    setValue('meals', [
      ...currentMeals,
      {
        time: '12:00',
        title: 'Nova Refeição',
        items: [''],
        calories: undefined,
        macros: { protein: undefined, carbs: undefined, fats: undefined }
      }
    ])
  }

  const removeMeal = (index) => {
    const currentMeals = watch('meals')
    if (currentMeals.length > 1) {
      setValue('meals', currentMeals.filter((_, i) => i !== index))
    }
  }

  const addMealItem = (mealIndex) => {
    const currentMeals = watch('meals')
    const updatedMeals = [...currentMeals]
    updatedMeals[mealIndex].items.push('')
    setValue('meals', updatedMeals)
  }

  const removeMealItem = (mealIndex, itemIndex) => {
    const currentMeals = watch('meals')
    const updatedMeals = [...currentMeals]
    if (updatedMeals[mealIndex].items.length > 1) {
      updatedMeals[mealIndex].items.splice(itemIndex, 1)
      setValue('meals', updatedMeals)
    }
  }

  const updateMealItem = (mealIndex, itemIndex, value) => {
    const currentMeals = watch('meals')
    const updatedMeals = [...currentMeals]
    updatedMeals[mealIndex].items[itemIndex] = value
    setValue('meals', updatedMeals)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ChefHat className="h-5 w-5" />
            <span>{isEditing ? 'Editar Plano Alimentar' : 'Novo Plano Alimentar'}</span>
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite o plano alimentar do paciente' 
              : 'Crie um novo plano alimentar personalizado ou use a IA para gerar sugestões'
            }
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {/* AI Generation Section */}
          {!isEditing && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span>Geração com IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showAIForm ? (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowAIForm(true)}
                    className="w-full"
                    disabled={isGeneratingAI}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Gerar Plano com IA
                  </Button>
                ) : (
                  <form onSubmit={handleSubmitAI(onGenerateAI)} className="space-y-4">
                    <div>
                      <Label htmlFor="ai-notes">
                        Preferências e Restrições (Opcional)
                      </Label>
                      <Textarea
                        id="ai-notes"
                        placeholder="Ex: Vegetariano, sem lactose, foco em ganho de massa muscular, etc..."
                        {...registerAI('notes')}
                        className="mt-1"
                        rows={3}
                      />
                      {aiErrors.notes && (
                        <p className="text-sm text-red-600 mt-1">{aiErrors.notes.message}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={isGeneratingAI}
                        className="flex-1"
                      >
                        {isGeneratingAI ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Gerar Sugestão
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowAIForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}
                {aiSuggestion && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700 mb-2">
                      <Brain className="h-4 w-4" />
                      <span className="font-medium">Plano gerado com IA!</span>
                    </div>
                    <p className="text-sm text-green-600">
                      O formulário foi preenchido com a sugestão da IA. Você pode editar conforme necessário.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Plan Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: Plano para Emagrecimento"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descrição opcional do plano alimentar..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Meals Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">Refeições</Label>
                <Button type="button" onClick={addMeal} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Refeição
                </Button>
              </div>

              <div className="space-y-4">
                {watchedMeals?.map((meal, mealIndex) => (
                  <Card key={mealIndex} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Refeição {mealIndex + 1}</span>
                        </CardTitle>
                        {watchedMeals.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMeal(mealIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`meals.${mealIndex}.time`}>Horário *</Label>
                          <Input
                            id={`meals.${mealIndex}.time`}
                            type="time"
                            {...register(`meals.${mealIndex}.time`)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`meals.${mealIndex}.title`}>Título *</Label>
                          <Input
                            id={`meals.${mealIndex}.title`}
                            {...register(`meals.${mealIndex}.title`)}
                            placeholder="Ex: Café da Manhã"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Meal Items */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium">Alimentos</Label>
                          <Button
                            type="button"
                            onClick={() => addMealItem(mealIndex)}
                            size="sm"
                            variant="ghost"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Item
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {meal.items?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center space-x-2">
                              <Input
                                value={item}
                                onChange={(e) => updateMealItem(mealIndex, itemIndex, e.target.value)}
                                placeholder="Ex: 1 fatia de pão integral"
                                className="flex-1"
                              />
                              {meal.items.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMealItem(mealIndex, itemIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Optional Nutritional Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                        <div>
                          <Label htmlFor={`meals.${mealIndex}.calories`} className="text-xs">
                            Calorias
                          </Label>
                          <Input
                            id={`meals.${mealIndex}.calories`}
                            type="number"
                            min="0"
                            {...register(`meals.${mealIndex}.calories`, { valueAsNumber: true })}
                            placeholder="kcal"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`meals.${mealIndex}.macros.protein`} className="text-xs">
                            Proteína (g)
                          </Label>
                          <Input
                            id={`meals.${mealIndex}.macros.protein`}
                            type="number"
                            min="0"
                            step="0.1"
                            {...register(`meals.${mealIndex}.macros.protein`, { valueAsNumber: true })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`meals.${mealIndex}.macros.carbs`} className="text-xs">
                            Carboidrato (g)
                          </Label>
                          <Input
                            id={`meals.${mealIndex}.macros.carbs`}
                            type="number"
                            min="0"
                            step="0.1"
                            {...register(`meals.${mealIndex}.macros.carbs`, { valueAsNumber: true })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`meals.${mealIndex}.macros.fats`} className="text-xs">
                            Gordura (g)
                          </Label>
                          <Input
                            id={`meals.${mealIndex}.macros.fats`}
                            type="number"
                            min="0"
                            step="0.1"
                            {...register(`meals.${mealIndex}.macros.fats`, { valueAsNumber: true })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Total Nutritional Info */}
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Informações Nutricionais Totais (Opcional)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="totalCalories">Calorias Totais</Label>
                    <Input
                      id="totalCalories"
                      type="number"
                      min="0"
                      {...register('totalCalories', { valueAsNumber: true })}
                      placeholder="kcal"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="macros.protein">Proteína Total (g)</Label>
                    <Input
                      id="macros.protein"
                      type="number"
                      min="0"
                      step="0.1"
                      {...register('macros.protein', { valueAsNumber: true })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="macros.carbs">Carboidrato Total (g)</Label>
                    <Input
                      id="macros.carbs"
                      type="number"
                      min="0"
                      step="0.1"
                      {...register('macros.carbs', { valueAsNumber: true })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="macros.fats">Gordura Total (g)</Label>
                    <Input
                      id="macros.fats"
                      type="number"
                      min="0"
                      step="0.1"
                      {...register('macros.fats', { valueAsNumber: true })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </DialogBody>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Atualizar' : 'Criar'} Plano
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}