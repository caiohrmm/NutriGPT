import { useState } from 'react'
import { 
  ChefHat, 
  Clock, 
  Flame, 
  Activity, 
  Edit, 
  Trash2, 
  Brain,
  Calendar,
  Utensils,
  CheckCircle,
  Circle
} from 'lucide-react'
import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { formatDate } from '../../utils/dateUtils'

export function MealPlanCard({ 
  plan, 
  onEdit, 
  onDelete, 
  onToggleActive,
  index = 0 
}) {
  const [showDetails, setShowDetails] = useState(false)

  const formatTime = (time) => {
    return time || '00:00'
  }

  const getTotalMacros = () => {
    if (plan.macros && (plan.macros.protein || plan.macros.carbs || plan.macros.fats)) {
      return plan.macros
    }
    
    // Calculate from meals if total not available
    const totalMacros = plan.meals?.reduce((acc, meal) => {
      if (meal.macros) {
        acc.protein += meal.macros.protein || 0
        acc.carbs += meal.macros.carbs || 0
        acc.fats += meal.macros.fats || 0
      }
      return acc
    }, { protein: 0, carbs: 0, fats: 0 })

    return totalMacros?.protein > 0 || totalMacros?.carbs > 0 || totalMacros?.fats > 0 
      ? totalMacros 
      : null
  }

  const getTotalCalories = () => {
    if (plan.totalCalories) return plan.totalCalories
    
    // Calculate from meals if total not available
    const totalCalories = plan.meals?.reduce((acc, meal) => {
      return acc + (meal.calories || 0)
    }, 0)

    return totalCalories > 0 ? totalCalories : null
  }

  const totalMacros = getTotalMacros()
  const totalCalories = getTotalCalories()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className={`hover:shadow-md transition-shadow ${plan.isActive ? 'ring-2 ring-green-500 bg-green-50/30' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5 text-green-600" />
                <span>{plan.name}</span>
                {plan.isActive && (
                  <Badge variant="default" className="ml-2 bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                )}
                {plan.aiGenerated && (
                  <Badge variant="secondary" className="ml-2">
                    <Brain className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                )}
              </CardTitle>
              {plan.description && (
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Criado em {formatDate(plan.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Utensils className="h-3 w-3" />
                  <span>{plan.meals?.length || 0} refeições</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleActive(plan)}
                className={plan.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                title={plan.isActive ? "Desativar plano" : "Ativar plano"}
              >
                {plan.isActive ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(plan)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(plan)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Nutritional Summary */}
          {(totalCalories || totalMacros) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              {totalCalories && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-orange-600 mb-1">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-medium">Calorias</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{totalCalories}</p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
              )}
              
              {totalMacros?.protein > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">Proteína</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{totalMacros.protein.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">g</p>
                </div>
              )}
              
              {totalMacros?.carbs > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">Carboidrato</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{totalMacros.carbs.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">g</p>
                </div>
              )}
              
              {totalMacros?.fats > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-yellow-600 mb-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">Gordura</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{totalMacros.fats.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">g</p>
                </div>
              )}
            </div>
          )}

          {/* Meals Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Refeições</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-700"
              >
                {showDetails ? 'Ocultar' : 'Ver detalhes'}
              </Button>
            </div>

            {showDetails ? (
              <div className="space-y-3">
                {plan.meals?.map((meal, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{formatTime(meal.time)} - {meal.title}</span>
                      </div>
                      {meal.calories && (
                        <Badge variant="outline" className="text-xs">
                          {meal.calories} kcal
                        </Badge>
                      )}
                    </div>
                    
                    <ul className="text-sm text-gray-600 space-y-1 ml-6">
                      {meal.items?.filter(item => item.trim()).map((item, itemIndex) => (
                        <li key={itemIndex} className="list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                    
                    {meal.macros && (meal.macros.protein > 0 || meal.macros.carbs > 0 || meal.macros.fats > 0) && (
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {meal.macros.protein > 0 && <span>P: {meal.macros.protein}g</span>}
                        {meal.macros.carbs > 0 && <span>C: {meal.macros.carbs}g</span>}
                        {meal.macros.fats > 0 && <span>G: {meal.macros.fats}g</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {plan.meals?.slice(0, 3).map((meal, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {formatTime(meal.time)} {meal.title}
                  </Badge>
                ))}
                {plan.meals?.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plan.meals.length - 3} mais
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
