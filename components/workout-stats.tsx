"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Dumbbell, Clock, TrendingUp, Award, Target } from "lucide-react"

interface WorkoutHistory {
  workoutId: string
  workoutName: string
  completedAt: string
  exercises: Array<{
    id: string
    exerciseId: string
    name: string
    sets: number
    reps: string
    rest: string
    sets: Array<{
      completed: boolean
      weight: string
      actualReps: string
    }>
  }>
}

interface WorkoutStatsProps {
  onBack: () => void
}

export function WorkoutStats({ onBack }: WorkoutStatsProps) {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week")

  useEffect(() => {
    const savedHistory = localStorage.getItem("workoutHistory")
    if (savedHistory) {
      setWorkoutHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Filter workouts based on selected period
  const getFilteredWorkouts = () => {
    const now = new Date()
    const filtered = workoutHistory.filter((workout) => {
      const workoutDate = new Date(workout.completedAt)

      if (selectedPeriod === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return workoutDate >= weekAgo
      } else if (selectedPeriod === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return workoutDate >= monthAgo
      }
      return true
    })

    return filtered.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
  }

  const filteredWorkouts = getFilteredWorkouts()

  // Calculate stats
  const totalWorkouts = filteredWorkouts.length
  const totalExercises = filteredWorkouts.reduce((total, workout) => total + workout.exercises.length, 0)
  const totalSets = filteredWorkouts.reduce(
    (total, workout) =>
      total +
      workout.exercises.reduce(
        (exerciseTotal, exercise) => exerciseTotal + (exercise.sets?.filter((set) => set.completed).length || 0),
        0,
      ),
    0,
  )

  // Get most trained exercises
  const exerciseFrequency: { [key: string]: number } = {}
  filteredWorkouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      exerciseFrequency[exercise.name] = (exerciseFrequency[exercise.name] || 0) + 1
    })
  })

  const topExercises = Object.entries(exerciseFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case "week":
        return "últimos 7 dias"
      case "month":
        return "últimos 30 dias"
      case "all":
        return "todo período"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-black dark:text-white">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Estatísticas & Histórico</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhe seu progresso</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Period Filter */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-2">
              {[
                { key: "week", label: "7 dias" },
                { key: "month", label: "30 dias" },
                { key: "all", label: "Tudo" },
              ].map((period) => (
                <Button
                  key={period.key}
                  variant={selectedPeriod === period.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.key as "week" | "month" | "all")}
                  className={
                    selectedPeriod === period.key
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                      : "bg-transparent text-black dark:text-white border-gray-300 dark:border-gray-700"
                  }
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs opacity-90">Treinos</span>
              </div>
              <p className="text-2xl font-bold">{totalWorkouts}</p>
              <p className="text-xs opacity-75">nos {getPeriodText()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-4 h-4" />
                <span className="text-xs opacity-90">Exercícios</span>
              </div>
              <p className="text-2xl font-bold">{totalExercises}</p>
              <p className="text-xs opacity-75">executados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-xs opacity-90">Séries</span>
              </div>
              <p className="text-2xl font-bold">{totalSets}</p>
              <p className="text-xs opacity-75">completadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-xs opacity-90">Média</span>
              </div>
              <p className="text-2xl font-bold">{totalWorkouts > 0 ? Math.round(totalExercises / totalWorkouts) : 0}</p>
              <p className="text-xs opacity-75">exerc./treino</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Exercises */}
        {topExercises.length > 0 && (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Exercícios Mais Treinados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topExercises.map(([exercise, count], index) => (
                  <div
                    key={exercise}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-600"
                                : "bg-gray-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium">{exercise}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{count}x</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout History */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Histórico de Treinos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredWorkouts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm">Nenhum treino realizado nos {getPeriodText()}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWorkouts.map((workout, index) => (
                  <div
                    key={`${workout.workoutId}-${workout.completedAt}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{workout.workoutName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(workout.completedAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workout.exercises.length} exercícios
                        </p>
                        <p className="text-xs text-gray-500">
                          {workout.exercises.reduce(
                            (total, ex) => total + (ex.sets?.filter((s) => s.completed).length || 0),
                            0,
                          )}{" "}
                          séries
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {workout.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{exercise.name}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {exercise.sets?.filter((s) => s.completed).length || 0} séries
                            </span>
                          </div>

                          {exercise.sets && exercise.sets.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {exercise.sets
                                .filter((set) => set.completed)
                                .map((set, setIndex) => (
                                  <span key={setIndex} className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">
                                    {set.weight}kg × {set.actualReps}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
