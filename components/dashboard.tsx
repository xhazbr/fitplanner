"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Calendar,
  Dumbbell,
  TrendingUp,
  Target,
  Clock,
  Award,
  Activity,
  Settings,
  BarChart3,
  Plus,
  Play,
  Database,
} from "lucide-react"
import { WorkoutCalendar } from "./workout-calendar"
import { WorkoutPlanner } from "./workout-planner"
import { WorkoutStats } from "./workout-stats"
import { ExerciseDatabase } from "./exercise-database"

interface UserData {
  name: string
  age: number
  weight: number
  height: number
  imc: number
}

interface DashboardProps {
  userData: UserData
  onReset: () => void
  onOpenSettings: () => void
}

interface Workout {
  id: string
  name: string
  type: string
  exercises: any[]
  date: string
}

export function Dashboard({ userData, onReset, onOpenSettings }: DashboardProps) {
  const [currentView, setCurrentView] = useState<"dashboard" | "calendar" | "planner" | "stats" | "exercises">(
    "dashboard",
  )
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [exerciseCount, setExerciseCount] = useState(0)

  // Load workouts and exercise count
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("workouts")
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts))
    }

    const savedExercises = localStorage.getItem("exerciseDatabase")
    if (savedExercises) {
      setExerciseCount(JSON.parse(savedExercises).length)
    }
  }, [currentView])

  const handleSaveWorkout = (workout: Workout) => {
    const updatedWorkouts = [...workouts, workout]
    setWorkouts(updatedWorkouts)
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts))
  }

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { category: "Abaixo do peso", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (imc < 25) return { category: "Peso normal", color: "text-green-600", bgColor: "bg-green-100" }
    if (imc < 30) return { category: "Sobrepeso", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { category: "Obesidade", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const imcInfo = getIMCCategory(userData.imc)

  // Get current date info
  const today = new Date()
  const currentHour = today.getHours()
  const greeting = currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite"

  if (currentView === "calendar") {
    return (
      <WorkoutCalendar
        onBack={() => setCurrentView("dashboard")}
        onOpenExerciseDatabase={() => setCurrentView("exercises")}
      />
    )
  }

  if (currentView === "planner") {
    return (
      <WorkoutPlanner
        onBack={() => setCurrentView("dashboard")}
        onSave={handleSaveWorkout}
        workouts={workouts}
        onOpenExerciseDatabase={() => setCurrentView("exercises")}
      />
    )
  }

  if (currentView === "stats") {
    return <WorkoutStats onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "exercises") {
    return <ExerciseDatabase onBack={() => setCurrentView("dashboard")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black text-black dark:text-white">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {greeting}, {userData.name}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {today.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <Button
            onClick={onOpenSettings}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white p-2"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* User Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{userData.age}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">anos</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{userData.weight}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">kg</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{userData.height}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">cm</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{userData.imc.toFixed(1)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">IMC</p>
            </CardContent>
          </Card>
        </div>

        {/* IMC Status */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Status do IMC</h3>
              <Badge className={`${imcInfo.bgColor} ${imcInfo.color} border-0`}>{imcInfo.category}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Abaixo do peso</span>
                <span>Normal</span>
                <span>Sobrepeso</span>
                <span>Obesidade</span>
              </div>
              <Progress value={Math.min((userData.imc / 35) * 100, 100)} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35+</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setCurrentView("calendar")}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center gap-2 h-12"
            >
              <Calendar className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Calendário de Treinos</div>
                <div className="text-xs opacity-90">Organize sua semana</div>
              </div>
            </Button>

            <Button
              onClick={() => setCurrentView("planner")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center gap-2 h-12"
            >
              <Dumbbell className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Criar Treino</div>
                <div className="text-xs opacity-90">Monte seu treino personalizado</div>
              </div>
            </Button>

            <Button
              onClick={() => setCurrentView("exercises")}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex items-center gap-2 h-12"
            >
              <Database className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Banco de Exercícios</div>
                <div className="text-xs opacity-90">{exerciseCount} exercícios disponíveis</div>
              </div>
            </Button>

            <Button
              onClick={() => setCurrentView("stats")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white flex items-center gap-2 h-12"
            >
              <BarChart3 className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Estatísticas</div>
                <div className="text-xs opacity-90">Acompanhe seu progresso</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        {workouts.length > 0 && (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                Treinos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workouts
                .slice(-3)
                .reverse()
                .map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Badge variant="outline" className="text-xs">
                          {workout.type}
                        </Badge>
                        <span>{workout.exercises.length} exercícios</span>
                        <span>•</span>
                        <span>{workout.date}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <p className="text-lg font-medium mb-2">
              "O sucesso é a soma de pequenos esforços repetidos dia após dia."
            </p>
            <p className="text-sm opacity-80">Continue firme na sua jornada!</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("dashboard")}
            className={`flex flex-col items-center gap-1 p-3 ${
              currentView === "dashboard" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Início</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("calendar")}
            className={`flex flex-col items-center gap-1 p-3 ${
              currentView === "calendar" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Calendário</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("planner")}
            className={`flex flex-col items-center gap-1 p-3 ${
              currentView === "planner" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-xs">Treinos</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("exercises")}
            className={`flex flex-col items-center gap-1 p-3 ${
              currentView === "exercises" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Database className="w-5 h-5" />
            <span className="text-xs">Exercícios</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("stats")}
            className={`flex flex-col items-center gap-1 p-3 ${
              currentView === "stats" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Stats</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
