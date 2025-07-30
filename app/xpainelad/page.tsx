"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Shield,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  BarChart3,
  Dumbbell,
  TrendingUp,
  Settings,
  Database,
  AlertTriangle,
} from "lucide-react"

interface Exercise {
  id: string
  name: string
  category: string
  difficulty: "Iniciante" | "Intermediário" | "Avançado"
  instructions: string
  videoUrl?: string
  muscleGroups: string[]
  isActive: boolean
  createdAt: string
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedDifficulty, setSelectedDifficulty] = useState("todos")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [bulkExercises, setBulkExercises] = useState("")
  const [bulkCategory, setBulkCategory] = useState("")
  const [bulkDifficulty, setBulkDifficulty] = useState<"Iniciante" | "Intermediário" | "Avançado">("Intermediário")

  const categories = [
    "Peito",
    "Costas",
    "Ombros",
    "Bíceps",
    "Tríceps",
    "Pernas",
    "Glúteos",
    "Abdomen",
    "Cardio",
    "Funcional",
    "Alongamento",
    "Core",
  ]

  const difficulties = ["Iniciante", "Intermediário", "Avançado"] as const

  const muscleGroups = [
    "Peito",
    "Costas",
    "Ombros",
    "Bíceps",
    "Tríceps",
    "Quadríceps",
    "Posterior",
    "Glúteos",
    "Panturrilha",
    "Abdomen",
    "Core",
    "Cardio",
  ]

  // Check authentication on load
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth === "authenticated") {
      setIsAuthenticated(true)
    }
  }, [])

  // Load exercises
  useEffect(() => {
    if (isAuthenticated) {
      const savedExercises = localStorage.getItem("adminExerciseDatabase")
      if (savedExercises) {
        setExercises(JSON.parse(savedExercises))
      }
    }
  }, [isAuthenticated])

  // Save exercises
  useEffect(() => {
    if (isAuthenticated && exercises.length > 0) {
      localStorage.setItem("adminExerciseDatabase", JSON.stringify(exercises))
      // Sync active exercises to user database
      const activeExercises = exercises.filter((ex) => ex.isActive)
      localStorage.setItem("exerciseDatabase", JSON.stringify(activeExercises))
    }
  }, [exercises, isAuthenticated])

  const handleLogin = () => {
    if (password === "admin2024") {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "authenticated")
      setPassword("")
    } else {
      alert("Senha incorreta!")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuth")
  }

  const handleAddExercise = (exerciseData: Partial<Exercise>) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseData.name || "",
      category: exerciseData.category || "",
      difficulty: exerciseData.difficulty || "Intermediário",
      instructions: exerciseData.instructions || "",
      videoUrl: exerciseData.videoUrl || "",
      muscleGroups: exerciseData.muscleGroups || [],
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    setExercises([...exercises, newExercise])
  }

  const handleUpdateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)))
  }

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, isActive: !ex.isActive } : ex)))
  }

  const handleBulkAdd = () => {
    if (!bulkExercises.trim() || !bulkCategory || !bulkDifficulty) return

    const exerciseNames = bulkExercises.split("\n").filter((name) => name.trim())
    const newExercises = exerciseNames.map((name) => ({
      id: Date.now().toString() + Math.random(),
      name: name.trim(),
      category: bulkCategory,
      difficulty: bulkDifficulty,
      instructions: `Instruções para ${name.trim()}. Execute o movimento de forma controlada, mantendo a postura correta.`,
      videoUrl: "",
      muscleGroups: [bulkCategory],
      isActive: true,
      createdAt: new Date().toISOString(),
    }))

    setExercises([...exercises, ...newExercises])
    setBulkExercises("")
    setBulkCategory("")
    setShowBulkAdd(false)
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(exercises, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `exercises-backup-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const handleClearAll = () => {
    setExercises([])
    localStorage.removeItem("adminExerciseDatabase")
    localStorage.removeItem("exerciseDatabase")
  }

  // Filter exercises
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "todos" || exercise.difficulty === selectedDifficulty
    const matchesActive = !showActiveOnly || exercise.isActive
    return matchesSearch && matchesCategory && matchesDifficulty && matchesActive
  })

  // Statistics
  const stats = {
    total: exercises.length,
    active: exercises.filter((ex) => ex.isActive).length,
    inactive: exercises.filter((ex) => !ex.isActive).length,
    categories: new Set(exercises.map((ex) => ex.category)).size,
  }

  const categoryStats = categories
    .map((cat) => ({
      name: cat,
      count: exercises.filter((ex) => ex.category === cat).length,
    }))
    .filter((stat) => stat.count > 0)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Painel Administrativo</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Acesso restrito - Digite a senha</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Senha de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
            >
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black dark:text-white">Painel Administrativo</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciamento de Exercícios</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="exercises"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              Exercícios
            </TabsTrigger>
            <TabsTrigger
              value="bulk"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Adicionar em Lote
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total de Exercícios</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Exercícios Ativos</p>
                      <p className="text-2xl font-bold">{stats.active}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Exercícios Inativos</p>
                      <p className="text-2xl font-bold">{stats.inactive}</p>
                    </div>
                    <EyeOff className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Categorias</p>
                      <p className="text-2xl font-bold">{stats.categories}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Distribution */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categoryStats.map((stat, index) => (
                    <div key={stat.name} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                      <p className="text-xl font-bold text-black dark:text-white">{stat.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-6">
            {/* Filters and Actions */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      placeholder="Buscar exercícios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                      <SelectItem value="todos">Todas as categorias</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-full md:w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                      <SelectItem value="todos">Todas as dificuldades</SelectItem>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => setShowActiveOnly(!showActiveOnly)}
                    variant={showActiveOnly ? "default" : "outline"}
                    className={
                      showActiveOnly
                        ? "bg-gradient-to-r from-red-500 to-orange-600 text-white"
                        : "border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  >
                    {showActiveOnly ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                    {showActiveOnly ? "Apenas Ativos" : "Todos"}
                  </Button>

                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Exercício
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Exercício</DialogTitle>
                      </DialogHeader>
                      <ExerciseForm
                        onSave={(data) => {
                          handleAddExercise(data)
                          setShowAddDialog(false)
                        }}
                        onCancel={() => setShowAddDialog(false)}
                        categories={categories}
                        muscleGroups={muscleGroups}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Exercise List */}
            <div className="space-y-4">
              {filteredExercises.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-8 text-center">
                    <Dumbbell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Nenhum exercício encontrado</p>
                  </CardContent>
                </Card>
              ) : (
                filteredExercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className={`border-2 transition-all ${
                      exercise.isActive
                        ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-black dark:text-white">{exercise.name}</h3>
                            <Badge variant={exercise.isActive ? "default" : "secondary"}>
                              {exercise.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                            <Badge variant="outline">{exercise.category}</Badge>
                            <Badge variant="outline">{exercise.difficulty}</Badge>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exercise.instructions}</p>

                          {exercise.muscleGroups.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {exercise.muscleGroups.map((group, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
                                >
                                  {group}
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-gray-500">
                            Criado em: {new Date(exercise.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleToggleActive(exercise.id)}
                            size="sm"
                            variant="outline"
                            className={
                              exercise.isActive
                                ? "text-orange-600 hover:text-orange-700 border-orange-300"
                                : "text-green-600 hover:text-green-700 border-green-300"
                            }
                          >
                            {exercise.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 hover:text-blue-700 border-blue-300 bg-transparent"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Editar Exercício</DialogTitle>
                              </DialogHeader>
                              <ExerciseForm
                                exercise={exercise}
                                onSave={(data) => {
                                  handleUpdateExercise(exercise.id, data)
                                }}
                                categories={categories}
                                muscleGroups={muscleGroups}
                              />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 border-red-300 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                  Tem certeza que deseja excluir o exercício "{exercise.name}"? Esta ação não pode ser
                                  desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300 dark:border-gray-700">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteExercise(exercise.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Bulk Add Tab */}
          <TabsContent value="bulk" className="space-y-6">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Adicionar Exercícios em Lote</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Digite um exercício por linha. Todos terão a mesma categoria e dificuldade.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white mb-2 block">Categoria</label>
                    <Select value={bulkCategory} onValueChange={setBulkCategory}>
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-black dark:text-white mb-2 block">Dificuldade</label>
                    <Select value={bulkDifficulty} onValueChange={(value: any) => setBulkDifficulty(value)}>
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                        {difficulties.map((diff) => (
                          <SelectItem key={diff} value={diff}>
                            {diff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-black dark:text-white mb-2 block">
                    Lista de Exercícios ({bulkExercises.split("\n").filter((line) => line.trim()).length} exercícios)
                  </label>
                  <Textarea
                    placeholder="Supino reto&#10;Supino inclinado&#10;Crucifixo&#10;Flexão de braço"
                    value={bulkExercises}
                    onChange={(e) => setBulkExercises(e.target.value)}
                    rows={10}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleBulkAdd}
                    disabled={!bulkExercises.trim() || !bulkCategory}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar {bulkExercises.split("\n").filter((line) => line.trim()).length} Exercícios
                  </Button>

                  <Button
                    onClick={() => {
                      setBulkExercises("")
                      setBulkCategory("")
                    }}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Backup e Restauração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleExportData}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Banco de Dados
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Zona de Perigo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar Banco Completo
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-gray-900 text-black dark:text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>⚠️ ATENÇÃO - Ação Irreversível</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        Esta ação irá excluir TODOS os exercícios do banco de dados, tanto do painel administrativo
                        quanto do sistema de usuários. Esta ação NÃO PODE ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-300 dark:border-gray-700">Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700 text-white">
                        Sim, Limpar Tudo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Exercise Form Component
function ExerciseForm({
  exercise,
  onSave,
  onCancel,
  categories,
  muscleGroups,
}: {
  exercise?: Exercise
  onSave: (data: Partial<Exercise>) => void
  onCancel?: () => void
  categories: string[]
  muscleGroups: string[]
}) {
  const [formData, setFormData] = useState({
    name: exercise?.name || "",
    category: exercise?.category || "",
    difficulty: exercise?.difficulty || ("Intermediário" as const),
    instructions: exercise?.instructions || "",
    videoUrl: exercise?.videoUrl || "",
    muscleGroups: exercise?.muscleGroups || [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category) return
    onSave(formData)
  }

  const toggleMuscleGroup = (group: string) => {
    setFormData((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(group)
        ? prev.muscleGroups.filter((g) => g !== group)
        : [...prev.muscleGroups, group],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-black dark:text-white mb-2 block">Nome do Exercício</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Supino reto"
          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-black dark:text-white mb-2 block">Categoria</label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-black dark:text-white mb-2 block">Dificuldade</label>
          <Select
            value={formData.difficulty}
            onValueChange={(value: any) => setFormData((prev) => ({ ...prev, difficulty: value }))}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <SelectItem value="Iniciante">Iniciante</SelectItem>
              <SelectItem value="Intermediário">Intermediário</SelectItem>
              <SelectItem value="Avançado">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-black dark:text-white mb-2 block">Instruções</label>
        <Textarea
          value={formData.instructions}
          onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
          placeholder="Descreva como executar o exercício..."
          rows={3}
          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-black dark:text-white mb-2 block">URL do Vídeo (YouTube)</label>
        <Input
          value={formData.videoUrl}
          onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
          placeholder="https://www.youtube.com/watch?v=..."
          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-black dark:text-white mb-2 block">Grupos Musculares</label>
        <div className="flex flex-wrap gap-2">
          {muscleGroups.map((group) => (
            <Button
              key={group}
              type="button"
              onClick={() => toggleMuscleGroup(group)}
              variant={formData.muscleGroups.includes(group) ? "default" : "outline"}
              size="sm"
              className={
                formData.muscleGroups.includes(group)
                  ? "bg-gradient-to-r from-red-500 to-orange-600 text-white"
                  : "border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            >
              {group}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          {exercise ? "Atualizar" : "Adicionar"}
        </Button>
      </div>
    </form>
  )
}
