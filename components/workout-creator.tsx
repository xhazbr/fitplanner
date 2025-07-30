"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2, Save, Search, Hash, Target, Clock, Video } from "lucide-react"
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

interface WorkoutCreatorProps {
  onBack: () => void
  onSave: (workout: Workout) => void
  onOpenExerciseDatabase: () => void
  editingWorkout?: Workout | null
  dayName: string
}

export function WorkoutCreator({
  onBack,
  onSave,
  onOpenExerciseDatabase,
  editingWorkout,
  dayName,
}: WorkoutCreatorProps) {
  const [workoutName, setWorkoutName] = useState("")
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")

  // Load exercise database
  useEffect(() => {
    const savedExercises = localStorage.getItem("exerciseDatabase")
    if (savedExercises) {
      setExerciseDatabase(JSON.parse(savedExercises))
    }
  }, [])

  // Load editing workout data
  useEffect(() => {
    if (editingWorkout) {
      setWorkoutName(editingWorkout.name)
      setExercises(editingWorkout.exercises)
    }
  }, [editingWorkout])

  // Categories from database
  const categories = Array.from(new Set(exerciseDatabase.map((ex) => ex.category))).sort()

  const addExerciseFromDatabase = (databaseExercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      exerciseId: databaseExercise.id,
      name: databaseExercise.name,
      sets: 3,
      reps: "12",
      rest: "60s",
    }
    setExercises([...exercises, newExercise])
    setShowExerciseSelector(false)
  }

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: string | number) => {
    const updated = exercises.map((exercise, i) => (i === index ? { ...exercise, [field]: value } : exercise))
    setExercises(updated)
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!workoutName.trim() || exercises.length === 0) return

    const workout: Workout = {
      id: editingWorkout?.id || Date.now().toString(),
      name: workoutName.trim(),
      exercises: exercises.filter((ex) => ex.name.trim() !== ""),
      createdAt: editingWorkout?.createdAt || new Date().toISOString(),
    }

    onSave(workout)
  }

  // Filter exercises based on search term and category
  const filteredExercises = exerciseDatabase.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get exercise details from database
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
          <div>
            <h1 className="text-xl font-bold">{editingWorkout ? "Editar Treino" : "Criar Treino"}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{dayName}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Workout Name */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="p-4">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Nome do Treino</label>
            <Input
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Ex: Treino de Peito e Tríceps"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
            />
          </CardContent>
        </Card>

        {/* Exercises Section */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Exercícios</CardTitle>
              <Button
                onClick={() => setShowExerciseSelector(true)}
                size="sm"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="mb-2">Nenhum exercício adicionado</p>
                <Button
                  onClick={() => setShowExerciseSelector(true)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  Clique para adicionar exercícios
                </Button>
              </div>
            ) : (
              exercises.map((exercise, index) => (
                <Card key={exercise.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">#{index + 1}</span>
                        <h4 className="font-medium">{exercise.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        {exercise.exerciseId && (
                          <Dialog>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-600 dark:text-gray-400 p-1 h-auto"
                              onClick={() => {
                                const exerciseDetails = getExerciseDetails(exercise.exerciseId)
                                if (exerciseDetails?.videoUrl) {
                                  // Open video dialog
                                }
                              }}
                            >
                              <Video className="w-4 h-4" />
                            </Button>
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

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1">
                          <Hash className="w-3 h-3" />
                          Séries
                        </label>
                        <Input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, "sets", Number.parseInt(e.target.value) || 0)}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1">
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
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1">
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
              ))
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-2">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!workoutName.trim() || exercises.length === 0}
            className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingWorkout ? "Atualizar" : "Salvar"} Treino
          </Button>
        </div>

        {/* Exercise Selector Dialog */}
        <Dialog open={showExerciseSelector} onOpenChange={setShowExerciseSelector}>
          <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Selecionar Exercício</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Buscar exercícios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>

              {/* Category Filter */}
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

              {/* Exercise List */}
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm || selectedCategory !== "todos"
                      ? "Nenhum exercício encontrado."
                      : "Nenhum exercício no banco de dados."}
                  </div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => addExerciseFromDatabase(exercise)}
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
                  Fechar
                </Button>
                <Button
                  onClick={onOpenExerciseDatabase}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  Gerenciar Exercícios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
