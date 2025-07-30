"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExerciseDatabase } from "@/components/exercise-database"
import { User, Weight, Ruler, Activity, Plus, Settings, BarChart3, Dumbbell, TrendingUp } from "lucide-react"
import { WorkoutCalendar } from "@/components/workout-calendar"
import { WorkoutStats } from "@/components/workout-stats"

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

export function Dashboard({ userData, onReset, onOpenSettings }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "workouts" | "exercises" | "stats">("home")
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([])

  useEffect(() => {
    // Load recent workouts from history
    const savedHistory = localStorage.getItem("workoutHistory")
    if (savedHistory) {
      const history = JSON.parse(savedHistory)
      setRecentWorkouts(history.slice(-3).reverse())
    }
  }, [activeTab])

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { category: "Abaixo do peso", color: "text-blue-500" }
    if (imc < 25) return { category: "Peso normal", color: "text-green-500" }
    if (imc < 30) return { category: "Sobrepeso", color: "text-yellow-500" }
    return { category: "Obesidade", color: "text-red-500" }
  }

  const imcInfo = getIMCCategory(userData.imc)

  if (activeTab === "workouts") {
    return (
      <WorkoutCalendar onBack={() => setActiveTab("home")} onOpenExerciseDatabase={() => setActiveTab("exercises")} />
    )
  }

  if (activeTab === "exercises") {
    return <ExerciseDatabase onBack={() => setActiveTab("workouts")} />
  }

  if (activeTab === "stats") {
    return <WorkoutStats onBack={() => setActiveTab("home")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-black dark:text-white">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Olá, {userData.name}! 👋</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Pronto para treinar hoje?</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {activeTab === "home" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs opacity-90">Idade</span>
                  </div>
                  <p className="text-xl font-bold">{userData.age} anos</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-4 h-4" />
                    <span className="text-xs opacity-90">Peso</span>
                  </div>
                  <p className="text-xl font-bold">{userData.weight} kg</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="w-4 h-4" />
                    <span className="text-xs opacity-90">Altura</span>
                  </div>
                  <p className="text-xl font-bold">{userData.height} cm</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-xs opacity-90">IMC</span>
                  </div>
                  <p className="text-xl font-bold">{userData.imc}</p>
                  <p className="text-xs opacity-75">{imcInfo.category}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setActiveTab("workouts")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg flex items-center gap-2 h-12"
                >
                  <Plus className="w-4 h-4" />
                  Planejar Novo Treino
                </Button>

                <Button
                  onClick={() => setActiveTab("exercises")}
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 bg-transparent h-12"
                >
                  <Dumbbell className="w-4 h-4" />
                  Banco de Exercícios
                </Button>
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            {recentWorkouts.length > 0 && (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Treinos Recentes</CardTitle>
                    <Button
                      onClick={() => setActiveTab("stats")}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Ver Mais
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentWorkouts.map((workout, index) => (
                      <div
                        key={`${workout.workoutId}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div>
                          <p className="font-medium">{workout.workoutName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(workout.completedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {workout.exercises?.length || 0} exercícios
                          </p>
                          <p className="text-xs text-gray-500">
                            {workout.exercises?.reduce(
                              (total: number, ex: any) =>
                                total + (ex.sets?.filter((s: any) => s.completed).length || 0),
                              0,
                            ) || 0}{" "}
                            séries
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("home")}
            className={
              activeTab === "home"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            <User className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTab === "workouts" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("workouts")}
            className={
              activeTab === "workouts"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            <Activity className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTab === "exercises" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("exercises")}
            className={
              activeTab === "exercises"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            <Dumbbell className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTab === "stats" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("stats")}
            className={
              activeTab === "stats"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
