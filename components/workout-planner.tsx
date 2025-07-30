"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2, Save, Dumbbell, Clock, Hash, Target, Search, Video } from "lucide-react"
import type { Exercise } from "./exercise-database"

interface ExerciseItem {
  id: string
  exerciseId: string
  name: string
  sets: number
  reps: string
  weight: string
  rest: string
}

interface Workout {
  id: string
  name: string
  type: string
  exercises: ExerciseItem[]
  date: string
}

interface WorkoutPlannerProps {
  onBack: () => void
  onSave: (workout: Workout) => void
  workouts: Workout[]
  onOpenExerciseDatabase: () => void
}

export function WorkoutPlanner({ onBack, onSave, workouts = [], onOpenExerciseDatabase }: WorkoutPlannerProps) {
  const [workoutName, setWorkoutName] = useState("")
  const [workoutType, setWorkoutType] = useState("")
  const [exercises, setExercises] = useState<ExerciseItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")

  const workoutTypes = [
    "Peito e Tríceps",
    "Costas e Bíceps",
    "Pernas e Glúteos",
    "Ombros e Abdomen",
    "Cardio",
    "Funcional",
    "Full Body",
  ]

  // Load exercise database
  useEffect(() => {
    const savedExercises = localStorage.getItem("exerciseDatabase")
    if (savedExercises) {
      setExerciseDatabase(JSON.parse(savedExercises))
    }
  }, [showExerciseSelector])

  // Categories from database
  const categories = Array.from(new Set(exerciseDatabase.map((ex) => ex.category))).sort()

  const addExercise = (databaseExercise?: Exercise) => {
    if (databaseExercise) {
      setExercises([
        ...exercises,
        {
          id: Date.now().toString(),
          exerciseId: databaseExercise.id,
          name: databaseExercise.name,
          sets: 3,
          reps: "12",
          weight: "",
          rest: "60s",
        },
      ])
      setShowExerciseSelector(false)
    } else {
      setExercises([
        ...exercises,
        {
          id: Date.now().toString(),
          exerciseId: "",
          name: "",
          sets: 3,
          reps: "12",
          weight: "",
          rest: "60s",
        },
      ])
    }
  }

  const updateExercise = (index: number, field: keyof ExerciseItem, value: string | number) => {
    const updated = exercises.map((exercise, i) => (i === index ? { ...exercise, [field]: value } : exercise))
    setExercises(updated)
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const saveWorkout = () => {
    if (!workoutName || !workoutType || exercises.length === 0) return

    const workout: Workout = {
      id: Date.now().toString(),
      name: workoutName,
      type: workoutType,
      exercises: exercises.filter((ex) => ex.name.trim() !== ""),
      date: new Date().toLocaleDateString("pt-BR"),
    }

    onSave(workout)

    // Reset form
    setWorkoutName("")
    setWorkoutType("")
    setExercises([])
    setShowForm(false)
  }

  // Filter exercises based on search term and category
  const filteredExercises = exerciseDatabase.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Find exercise details from database
  const getExerciseDetails = (exerciseId: string) => {
    return exerciseDatabase.find((ex) => ex.id === exerciseId)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Planner de Treinos</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* New Workout Button */}
        {!showForm && (
          <div className="space-y-4">
            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2 py-6"
            >
              <Plus className="w-5 h-5" />
              Criar Novo Treino
            </Button>

            <Button
              onClick={onOpenExerciseDatabase}
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 bg-transparent"
            >
              <Dumbbell className="w-5 h-5" />
              Gerenciar Banco de Exercícios
            </Button>
          </div>
        )}

        {/* Workout Form */}
        {showForm && (
          <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Novo Treino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Nome do Treino</label>
                <Input
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Ex: Treino de Peito"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Tipo de Treino</label>
                <Select value={workoutType} onValueChange={setWorkoutType}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    {workoutTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-black dark:text-white">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Exercícios</label>
                  <Button
                    onClick={() => setShowExerciseSelector(true)}
                    size="sm"
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Adicionar do Banco
                  </Button>
                </div>

                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <Card key={exercise.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Exercício {index + 1}</span>
                          <div className="flex gap-2">
                            {exercise.exerciseId && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-gray-600 dark:text-gray-400 p-1 h-auto"
                                  >
                                    <Video className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{exercise.name} - Vídeo Demonstrativo</DialogTitle>
                                  </DialogHeader>
                                  <div className="aspect-video w-full mt-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                                    {getExerciseDetails(exercise.exerciseId)?.videoUrl && (
                                      <iframe
                                        src={getExerciseDetails(exercise.exerciseId)?.videoUrl}
                                        title={`${exercise.name} demonstration`}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    )}
                                  </div>
                                  <div className="mt-4 space-y-2">
                                    <h3 className="font-medium">Instruções:</h3>
                                    <p className="text-sm whitespace-pre-line">
                                      {getExerciseDetails(exercise.exerciseId)?.instructions}
                                    </p>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button
                              onClick={() => removeExercise(index)}
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-400 p-1 h-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <Input
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, "name", e.target.value)}
                          placeholder="Nome do exercício"
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              Séries
                            </label>
                            <Input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(index, "sets", Number.parseInt(e.target.value) || 0)}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              Repetições
                            </label>
                            <Input
                              value={exercise.reps}
                              onChange={(e) => updateExercise(index, "reps", e.target.value)}
                              placeholder="12"
                              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">Peso (kg)</label>
                            <Input
                              value={exercise.weight}
                              onChange={(e) => updateExercise(index, "weight", e.target.value)}
                              placeholder="20"
                              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Descanso
                            </label>
                            <Input
                              value={exercise.rest}
                              onChange={(e) => updateExercise(index, "rest", e.target.value)}
                              placeholder="60s"
                              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {exercises.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      Nenhum exercício adicionado. Clique em "Adicionar do Banco" para começar.
                    </div>
                  )}

                  <Button
                    onClick={() => addExercise()}
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Exercício Manualmente
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={saveWorkout}
                  disabled={!workoutName || !workoutType || exercises.length === 0}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise Selector Dialog */}
        <Dialog open={showExerciseSelector} onOpenChange={setShowExerciseSelector}>
          <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Selecionar Exercício</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Search and Filter */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Buscar exercícios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <Button
                    variant={selectedCategory === "todos" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("todos")}
                    className={
                      selectedCategory === "todos"
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-transparent text-black dark:text-white border-gray-300 dark:border-gray-700"
                    }
                  >
                    Todos
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-black dark:bg-white text-white dark:text-black whitespace-nowrap"
                          : "bg-transparent text-black dark:text-white border-gray-300 dark:border-gray-700 whitespace-nowrap"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Exercise List */}
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm || selectedCategory !== "todos"
                      ? "Nenhum exercício encontrado com os filtros atuais."
                      : "Nenhum exercício cadastrado no banco de dados."}
                  </div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => addExercise(exercise)}
                    >
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                            {exercise.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-500" />
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowExerciseSelector(false)}
                  className="border-gray-300 dark:border-gray-700 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={onOpenExerciseDatabase}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Gerenciar Banco de Exercícios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Saved Workouts */}
        {workouts.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">Treinos Salvos</h2>
            <div className="space-y-3">
              {workouts.map((workout) => (
                <Card key={workout.id} className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{workout.name}</h3>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{workout.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{workout.type}</p>
                    <p className="text-xs text-gray-500">{workout.exercises.length} exercícios</p>

                    <div className="mt-3 space-y-2">
                      {workout.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {exercise.sets}x{exercise.reps} {exercise.weight && `• ${exercise.weight}kg`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
