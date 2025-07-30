"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Plus, Calendar, Play, Edit, Trash2, Dumbbell, Clock, Target } from "lucide-react"
import { WorkoutCreator } from "./workout-creator"
import { WorkoutExecution } from "./workout-execution"

interface WorkoutExercise {
  id: string
  exerciseId: string
  name: string
  sets: number
  reps: string
  rest: string
}

interface Workout {
  id: string
  name: string
  exercises: WorkoutExercise[]
  createdAt: string
}

interface WeeklyWorkouts {
  monday: Workout[]
  tuesday: Workout[]
  wednesday: Workout[]
  thursday: Workout[]
  friday: Workout[]
  saturday: Workout[]
  sunday: Workout[]
}

interface WorkoutCalendarProps {
  onBack: () => void
  onOpenExerciseDatabase: () => void
}

const daysOfWeek = [
  {
    key: "monday",
    name: "Segunda-feira",
    short: "SEG",
    color: "bg-red-500",
    lightColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    key: "tuesday",
    name: "Terça-feira",
    short: "TER",
    color: "bg-orange-500",
    lightColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    key: "wednesday",
    name: "Quarta-feira",
    short: "QUA",
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    key: "thursday",
    name: "Quinta-feira",
    short: "QUI",
    color: "bg-green-500",
    lightColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    key: "friday",
    name: "Sexta-feira",
    short: "SEX",
    color: "bg-blue-500",
    lightColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    key: "saturday",
    name: "Sábado",
    short: "SAB",
    color: "bg-purple-500",
    lightColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    key: "sunday",
    name: "Domingo",
    short: "DOM",
    color: "bg-pink-500",
    lightColor: "bg-pink-50 dark:bg-pink-950",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
]

export function WorkoutCalendar({ onBack, onOpenExerciseDatabase }: WorkoutCalendarProps) {
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WeeklyWorkouts>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showWorkoutCreator, setShowWorkoutCreator] = useState(false)
  const [executingWorkout, setExecutingWorkout] = useState<Workout | null>(null)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)

  // Load workouts from localStorage
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("weeklyWorkouts")
    if (savedWorkouts) {
      setWeeklyWorkouts(JSON.parse(savedWorkouts))
    }
  }, [])

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("weeklyWorkouts", JSON.stringify(weeklyWorkouts))
  }, [weeklyWorkouts])

  const handleCreateWorkout = (dayKey: string) => {
    setSelectedDay(dayKey)
    setEditingWorkout(null)
    setShowWorkoutCreator(true)
  }

  const handleEditWorkout = (workout: Workout, dayKey: string) => {
    setSelectedDay(dayKey)
    setEditingWorkout(workout)
    setShowWorkoutCreator(true)
  }

  const handleSaveWorkout = (workout: Workout) => {
    if (!selectedDay) return

    setWeeklyWorkouts((prev) => {
      const dayWorkouts = [...prev[selectedDay as keyof WeeklyWorkouts]]

      if (editingWorkout) {
        // Update existing workout
        const index = dayWorkouts.findIndex((w) => w.id === editingWorkout.id)
        if (index !== -1) {
          dayWorkouts[index] = workout
        }
      } else {
        // Add new workout
        dayWorkouts.push(workout)
      }

      return {
        ...prev,
        [selectedDay]: dayWorkouts,
      }
    })

    setShowWorkoutCreator(false)
    setSelectedDay(null)
    setEditingWorkout(null)
  }

  const handleDeleteWorkout = (workoutId: string, dayKey: string) => {
    setWeeklyWorkouts((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey as keyof WeeklyWorkouts].filter((w) => w.id !== workoutId),
    }))
  }

  const handleStartWorkout = (workout: Workout) => {
    setExecutingWorkout(workout)
  }

  const handleFinishWorkout = () => {
    setExecutingWorkout(null)
  }

  // Get current day
  const getCurrentDay = () => {
    const today = new Date().getDay()
    const dayMap = [6, 0, 1, 2, 3, 4, 5] // Sunday = 0, Monday = 1, etc.
    return daysOfWeek[dayMap[today]]?.key || "monday"
  }

  const currentDay = getCurrentDay()

  if (executingWorkout) {
    return <WorkoutExecution workout={executingWorkout} onFinish={handleFinishWorkout} onBack={handleFinishWorkout} />
  }

  if (showWorkoutCreator) {
    return (
      <WorkoutCreator
        onBack={() => {
          setShowWorkoutCreator(false)
          setSelectedDay(null)
          setEditingWorkout(null)
        }}
        onSave={handleSaveWorkout}
        onOpenExerciseDatabase={onOpenExerciseDatabase}
        editingWorkout={editingWorkout}
        dayName={selectedDay ? daysOfWeek.find((d) => d.key === selectedDay)?.name || "" : ""}
      />
    )
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
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Calendário de Treinos</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organize sua semana de treinos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Quick Access to Exercise Database */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4">
            <Button
              onClick={onOpenExerciseDatabase}
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 bg-transparent h-12"
            >
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">Gerenciar Banco de Exercícios</span>
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Calendar */}
        <div className="space-y-4">
          {daysOfWeek.map((day) => {
            const dayWorkouts = weeklyWorkouts[day.key as keyof WeeklyWorkouts]
            const isToday = day.key === currentDay
            const totalExercises = dayWorkouts.reduce((total, workout) => total + workout.exercises.length, 0)

            return (
              <Card
                key={day.key}
                className={`border-2 transition-all duration-200 hover:shadow-lg ${
                  isToday
                    ? `${day.lightColor} ${day.borderColor} shadow-md`
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-lg ${day.color}`}
                      >
                        <span className="text-xs">{day.short}</span>
                        <span className="text-xs opacity-80">{new Date().getDate()}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{day.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {isToday && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                              Hoje
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {dayWorkouts.length} treino{dayWorkouts.length !== 1 ? "s" : ""}
                          </span>
                          {totalExercises > 0 && (
                            <span className="flex items-center gap-1">
                              <Dumbbell className="w-3 h-3" />
                              {totalExercises} exercício{totalExercises !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCreateWorkout(day.key)}
                      size="sm"
                      className={`${day.color} hover:opacity-90 text-white shadow-lg h-10 px-4`}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Novo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {dayWorkouts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm mb-2">Nenhum treino programado</p>
                      <Button
                        onClick={() => handleCreateWorkout(day.key)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      >
                        Clique para adicionar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayWorkouts.map((workout, index) => (
                        <div
                          key={workout.id}
                          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${day.color}`} />
                                <h4 className="font-semibold text-lg">{workout.name}</h4>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Dumbbell className="w-3 h-3" />
                                  {workout.exercises.length} exercícios
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />~{workout.exercises.length * 3} min
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleStartWorkout(workout)}
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Iniciar
                              </Button>
                              <Button
                                onClick={() => handleEditWorkout(workout, day.key)}
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteWorkout(workout.id, day.key)}
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-gray-300 dark:border-gray-600 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Exercise Preview */}
                          {workout.exercises.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex flex-wrap gap-2">
                                {workout.exercises.slice(0, 3).map((exercise, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                                  >
                                    {exercise.name}
                                  </span>
                                ))}
                                {workout.exercises.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                    +{workout.exercises.length - 3} mais
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
