"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Play, Pause, RotateCcw, Check, Video, Timer, Weight } from "lucide-react"
import type { Exercise } from "./exercise-database"

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

interface ExerciseSet {
  completed: boolean
  weight: string
  actualReps: string
}

interface WorkoutExecutionProps {
  workout: Workout
  onFinish: () => void
  onBack: () => void
}

export function WorkoutExecution({ workout, onFinish, onBack }: WorkoutExecutionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [exerciseSets, setExerciseSets] = useState<{ [exerciseId: string]: ExerciseSet[] }>({})
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [selectedExerciseForVideo, setSelectedExerciseForVideo] = useState<Exercise | null>(null)

  // Load exercise database
  useEffect(() => {
    const savedExercises = localStorage.getItem("exerciseDatabase")
    if (savedExercises) {
      setExerciseDatabase(JSON.parse(savedExercises))
    }
  }, [])

  // Initialize exercise sets
  useEffect(() => {
    const initialSets: { [exerciseId: string]: ExerciseSet[] } = {}
    workout.exercises.forEach((exercise) => {
      initialSets[exercise.id] = Array.from({ length: exercise.sets }, () => ({
        completed: false,
        weight: "",
        actualReps: exercise.reps,
      }))
    })
    setExerciseSets(initialSets)
  }, [workout])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            setIsResting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, restTime])

  const currentExercise = workout.exercises[currentExerciseIndex]
  const currentSets = exerciseSets[currentExercise?.id] || []

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const parseRestTime = (restString: string): number => {
    const match = restString.match(/(\d+)/)
    return match ? Number.parseInt(match[1]) : 60
  }

  const updateSet = (exerciseId: string, setIndex: number, field: keyof ExerciseSet, value: string | boolean) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((set, index) => (index === setIndex ? { ...set, [field]: value } : set)),
    }))
  }

  const completeSet = () => {
    const exerciseId = currentExercise.id
    updateSet(exerciseId, currentSetIndex, "completed", true)

    // Start rest timer if not the last set
    if (currentSetIndex < currentExercise.sets - 1) {
      const restSeconds = parseRestTime(currentExercise.rest)
      setRestTime(restSeconds)
      setIsResting(true)
      setIsTimerRunning(true)
      setCurrentSetIndex(currentSetIndex + 1)
    } else {
      // Move to next exercise or finish workout
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setCurrentSetIndex(0)
      } else {
        // Workout completed
        handleFinishWorkout()
      }
    }
  }

  const skipRest = () => {
    setIsTimerRunning(false)
    setIsResting(false)
    setRestTime(0)
  }

  const startRestTimer = () => {
    setIsTimerRunning(true)
  }

  const pauseRestTimer = () => {
    setIsTimerRunning(false)
  }

  const resetRestTimer = () => {
    const restSeconds = parseRestTime(currentExercise.rest)
    setRestTime(restSeconds)
    setIsTimerRunning(false)
  }

  const handleFinishWorkout = () => {
    // Save workout history
    const workoutHistory = {
      workoutId: workout.id,
      workoutName: workout.name,
      completedAt: new Date().toISOString(),
      exercises: workout.exercises.map((exercise) => ({
        ...exercise,
        sets: exerciseSets[exercise.id] || [],
      })),
    }

    const savedHistory = localStorage.getItem("workoutHistory") || "[]"
    const history = JSON.parse(savedHistory)
    history.push(workoutHistory)
    localStorage.setItem("workoutHistory", JSON.stringify(history))

    onFinish()
  }

  const showExerciseVideo = (exercise: WorkoutExercise) => {
    const exerciseDetails = exerciseDatabase.find((ex) => ex.id === exercise.exerciseId)
    if (exerciseDetails) {
      setSelectedExerciseForVideo(exerciseDetails)
      setShowVideoDialog(true)
    }
  }

  const getExerciseDetails = (exerciseId: string) => {
    return exerciseDatabase.find((ex) => ex.id === exerciseId)
  }

  if (!currentExercise) {
    return <div>Carregando...</div>
  }

  const completedSets = currentSets.filter((set) => set.completed).length
  const totalWorkoutSets = workout.exercises.reduce((total, ex) => total + ex.sets, 0)
  const completedWorkoutSets = Object.values(exerciseSets)
    .flat()
    .filter((set) => set.completed).length
  const workoutProgress = (completedWorkoutSets / totalWorkoutSets) * 100

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{workout.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
              </p>
            </div>
          </div>
          <Button
            onClick={handleFinishWorkout}
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-300 dark:border-gray-700"
          >
            Finalizar
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progresso do Treino</span>
            <span>{Math.round(workoutProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${workoutProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Rest Timer */}
        {isResting && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">Tempo de Descanso</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">{formatTime(restTime)}</div>
              <div className="flex gap-2 justify-center">
                {isTimerRunning ? (
                  <Button onClick={pauseRestTimer} size="sm" variant="outline" className="bg-transparent">
                    <Pause className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={startRestTimer} size="sm" variant="outline" className="bg-transparent">
                    <Play className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={resetRestTimer} size="sm" variant="outline" className="bg-transparent">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button onClick={skipRest} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Pular Descanso
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Exercise */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{currentExercise.name}</CardTitle>
              {currentExercise.exerciseId && (
                <Button
                  onClick={() => showExerciseVideo(currentExercise)}
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-gray-300 dark:border-gray-700"
                >
                  <Video className="w-4 h-4 mr-1" />
                  Ver Vídeo
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Série {currentSetIndex + 1} de {currentExercise.sets} • {currentExercise.reps} repetições • Descanso:{" "}
              {currentExercise.rest}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Set Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1">
                  <Weight className="w-3 h-3" />
                  Peso (kg)
                </label>
                <Input
                  type="number"
                  value={currentSets[currentSetIndex]?.weight || ""}
                  onChange={(e) => updateSet(currentExercise.id, currentSetIndex, "weight", e.target.value)}
                  placeholder="0"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Repetições Realizadas</label>
                <Input
                  value={currentSets[currentSetIndex]?.actualReps || ""}
                  onChange={(e) => updateSet(currentExercise.id, currentSetIndex, "actualReps", e.target.value)}
                  placeholder={currentExercise.reps}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                />
              </div>
            </div>

            <Button
              onClick={completeSet}
              disabled={!currentSets[currentSetIndex]?.weight || !currentSets[currentSetIndex]?.actualReps}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 py-3"
            >
              <Check className="w-4 h-4" />
              Completar Série {currentSetIndex + 1}
            </Button>
          </CardContent>
        </Card>

        {/* Sets Progress */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Progresso das Séries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {currentSets.map((set, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    set.completed
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                      : index === currentSetIndex
                        ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        set.completed
                          ? "bg-green-500 text-white"
                          : index === currentSetIndex
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {set.completed ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className="font-medium">Série {index + 1}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {set.completed ? `${set.weight}kg × ${set.actualReps}` : `${currentExercise.reps} reps`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Exercícios do Treino</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workout.exercises.map((exercise, index) => {
                const sets = exerciseSets[exercise.id] || []
                const completedCount = sets.filter((set) => set.completed).length
                const isCurrentExercise = index === currentExerciseIndex

                return (
                  <div
                    key={exercise.id}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      isCurrentExercise
                        ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                        : completedCount === exercise.sets
                          ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets} séries × {exercise.reps} reps
                      </p>
                    </div>
                    <div className="text-sm">
                      <span
                        className={
                          completedCount === exercise.sets
                            ? "text-green-600 dark:text-green-400"
                            : isCurrentExercise
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {completedCount}/{exercise.sets}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Video Dialog */}
        <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedExerciseForVideo?.name} - Demonstração</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                {selectedExerciseForVideo?.videoUrl && (
                  <iframe
                    src={selectedExerciseForVideo.videoUrl}
                    title={`${selectedExerciseForVideo.name} demonstration`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Instruções:</h3>
                <p className="text-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
                  {selectedExerciseForVideo?.instructions}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
