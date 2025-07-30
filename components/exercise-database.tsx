"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Search, Save, Trash2, Video, FileText, Dumbbell } from "lucide-react"

export interface Exercise {
  id: string
  name: string
  category: string
  videoUrl: string
  instructions: string
  equipment: string
  difficulty: "iniciante" | "intermediário" | "avançado"
}

interface ExerciseDatabaseProps {
  onBack: () => void
}

export function ExerciseDatabase({ onBack }: ExerciseDatabaseProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Omit<Exercise, "id">>({
    name: "",
    category: "",
    videoUrl: "",
    instructions: "",
    equipment: "",
    difficulty: "intermediário",
  })

  // Categories
  const categories = [
    "Peito",
    "Costas",
    "Ombros",
    "Bíceps",
    "Tríceps",
    "Pernas",
    "Glúteos",
    "Abdômen",
    "Cardio",
    "Funcional",
  ]

  // Load exercises from localStorage
  useEffect(() => {
    const savedExercises = localStorage.getItem("exerciseDatabase")
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises))
    } else {
      // Add some example exercises if database is empty
      const exampleExercises: Exercise[] = [
        {
          id: "1",
          name: "Supino Reto",
          category: "Peito",
          videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
          instructions:
            "1. Deite-se no banco com os pés no chão\n2. Segure a barra com as mãos um pouco mais abertas que a largura dos ombros\n3. Abaixe a barra até tocar levemente o peito\n4. Empurre a barra para cima até estender os braços",
          equipment: "Barra e banco",
          difficulty: "intermediário",
        },
        {
          id: "2",
          name: "Agachamento",
          category: "Pernas",
          videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8",
          instructions:
            "1. Posicione-se com os pés na largura dos ombros\n2. Mantenha as costas retas e o peito para frente\n3. Dobre os joelhos e abaixe o quadril como se fosse sentar\n4. Desça até as coxas ficarem paralelas ao chão\n5. Retorne à posição inicial",
          equipment: "Peso corporal ou barra",
          difficulty: "intermediário",
        },
        {
          id: "3",
          name: "Remada Curvada",
          category: "Costas",
          videoUrl: "https://www.youtube.com/embed/kBWAon7ItDw",
          instructions:
            "1. Segure a barra com as mãos um pouco mais abertas que a largura dos ombros\n2. Dobre levemente os joelhos e incline o tronco para frente\n3. Mantenha as costas retas e puxe a barra em direção ao abdômen\n4. Aperte as escápulas no final do movimento\n5. Retorne à posição inicial de forma controlada",
          equipment: "Barra ou halteres",
          difficulty: "intermediário",
        },
      ]
      setExercises(exampleExercises)
      localStorage.setItem("exerciseDatabase", JSON.stringify(exampleExercises))
    }
  }, [])

  // Save exercises to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("exerciseDatabase", JSON.stringify(exercises))
  }, [exercises])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      videoUrl: "",
      instructions: "",
      equipment: "",
      difficulty: "intermediário",
    })
    setIsEditing(false)
    setCurrentExercise(null)
  }

  const handleAddExercise = () => {
    if (!formData.name || !formData.category) return

    // Process YouTube URL to get embed URL
    let videoUrl = formData.videoUrl
    if (videoUrl.includes("youtube.com/watch?v=")) {
      const videoId = videoUrl.split("v=")[1].split("&")[0]
      videoUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1].split("?")[0]
      videoUrl = `https://www.youtube.com/embed/${videoId}`
    }

    if (isEditing && currentExercise) {
      // Update existing exercise
      const updatedExercises = exercises.map((ex) =>
        ex.id === currentExercise.id ? { ...formData, id: currentExercise.id, videoUrl } : ex,
      )
      setExercises(updatedExercises)
    } else {
      // Add new exercise
      const newExercise: Exercise = {
        ...formData,
        id: Date.now().toString(),
        videoUrl,
      }
      setExercises([...exercises, newExercise])
    }

    resetForm()
    setShowAddForm(false)
  }

  const handleEditExercise = (exercise: Exercise) => {
    setFormData({
      name: exercise.name,
      category: exercise.category,
      videoUrl: exercise.videoUrl,
      instructions: exercise.instructions,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
    })
    setCurrentExercise(exercise)
    setIsEditing(true)
    setShowAddForm(true)
  }

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  // Filter exercises based on search term and category
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return ""
    return url
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
          <h1 className="text-xl font-bold">Banco de Exercícios</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Buscar exercícios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
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

        {/* Admin Panel Button */}
        <Button
          onClick={() => {
            resetForm()
            setShowAddForm(true)
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg flex items-center gap-2 h-12"
        >
          <Plus className="w-4 h-4" />
          Painel Administrativo - Adicionar Exercício
        </Button>

        {/* Exercise List */}
        <div className="space-y-4">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || selectedCategory !== "todos"
                ? "Nenhum exercício encontrado com os filtros atuais."
                : "Nenhum exercício cadastrado. Adicione seu primeiro exercício!"}
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{exercise.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                          {exercise.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                          {exercise.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-3 bg-transparent">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white">
                          <DialogHeader>
                            <DialogTitle>{exercise.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Categoria</h4>
                              <p>{exercise.category}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Equipamento</h4>
                              <p>{exercise.equipment}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Nível de Dificuldade
                              </h4>
                              <p className="capitalize">{exercise.difficulty}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Instruções</h4>
                              <p className="whitespace-pre-line">{exercise.instructions}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-3 bg-transparent">
                            <Video className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{exercise.name} - Vídeo Demonstrativo</DialogTitle>
                          </DialogHeader>
                          <div className="aspect-video w-full mt-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                            <iframe
                              src={getYouTubeEmbedUrl(exercise.videoUrl)}
                              title={`${exercise.name} demonstration`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExercise(exercise)}
                        className="h-8 px-3 bg-transparent"
                      >
                        <Dumbbell className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="h-8 px-3 bg-transparent text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {exercise.instructions.split("\n")[0]}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Admin Panel Form */}
        {showAddForm && (
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">
                  {isEditing ? "✏️ Editar Exercício" : "➕ Painel Administrativo"}
                </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {isEditing ? "Modifique as informações do exercício" : "Adicione um novo exercício ao banco de dados"}
                </p>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Basic Information Section */}
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">📝 Informações Básicas</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Nome do Exercício *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Supino Reto, Agachamento Livre..."
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Categoria *
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-black dark:text-white">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Nível de Dificuldade
                      </label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) =>
                          handleSelectChange("difficulty", value as "iniciante" | "intermediário" | "avançado")
                        }
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                          <SelectItem value="iniciante" className="text-black dark:text-white">
                            🟢 Iniciante
                          </SelectItem>
                          <SelectItem value="intermediário" className="text-black dark:text-white">
                            🟡 Intermediário
                          </SelectItem>
                          <SelectItem value="avançado" className="text-black dark:text-white">
                            🔴 Avançado
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Equipamento Necessário
                    </label>
                    <Input
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleInputChange}
                      placeholder="Ex: Barra, Halteres, Peso corporal, Máquina..."
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                {/* Video Section */}
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">🎥 Vídeo Demonstrativo</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Link do YouTube
                    </label>
                    <Input
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                    <div className="mt-2 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-md">
                      <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">💡 Dica:</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Cole qualquer link do YouTube. O sistema converte automaticamente para o formato correto.
                        Formatos aceitos: youtube.com/watch?v= e youtu.be/
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions Section */}
                <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">📋 Instruções de Execução</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Passo a passo detalhado
                    </label>
                    <Textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      placeholder="1. Posicione-se corretamente...&#10;2. Mantenha a postura...&#10;3. Execute o movimento...&#10;4. Retorne à posição inicial..."
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 min-h-[150px]"
                    />
                    <div className="mt-2 p-3 bg-green-100 dark:bg-green-800/30 rounded-md">
                      <p className="text-xs text-green-800 dark:text-green-200 font-medium">
                        ✅ Dicas para boas instruções:
                      </p>
                      <ul className="text-xs text-green-700 dark:text-green-300 mt-1 space-y-1">
                        <li>• Numere cada passo (1., 2., 3...)</li>
                        <li>• Seja específico sobre posicionamento</li>
                        <li>• Mencione pontos de atenção importantes</li>
                        <li>• Inclua dicas de respiração se relevante</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    ❌ Cancelar
                  </Button>
                  <Button
                    onClick={handleAddExercise}
                    disabled={!formData.name || !formData.category}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "💾 Atualizar Exercício" : "✨ Criar Exercício"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
