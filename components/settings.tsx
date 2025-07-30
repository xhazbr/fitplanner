"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Calendar, Weight, Ruler, Sun, Moon, RotateCcw, Save, Edit } from "lucide-react"

interface UserData {
  name: string
  age: number
  weight: number
  height: number
  imc: number
}

interface SettingsProps {
  userData: UserData
  onBack: () => void
  onUpdateUserData: (data: UserData) => void
  onReset: () => void
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function Settings({ userData, onBack, onUpdateUserData, onReset, isDarkMode, onToggleTheme }: SettingsProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({
    name: userData.name,
    age: userData.age.toString(),
    weight: userData.weight.toString(),
    height: userData.height.toString(),
  })

  const calculateIMC = (weight: number, height: number) => {
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { category: "Abaixo do peso", color: "text-blue-500" }
    if (imc < 25) return { category: "Peso normal", color: "text-green-500" }
    if (imc < 30) return { category: "Sobrepeso", color: "text-yellow-500" }
    return { category: "Obesidade", color: "text-red-500" }
  }

  const handleSaveField = (field: string) => {
    const newData = { ...userData }

    if (field === "name") {
      newData.name = editValues.name
    } else if (field === "age") {
      newData.age = Number(editValues.age) || userData.age
    } else if (field === "weight") {
      newData.weight = Number(editValues.weight) || userData.weight
      newData.imc = calculateIMC(newData.weight, newData.height)
    } else if (field === "height") {
      newData.height = Number(editValues.height) || userData.height
      newData.imc = calculateIMC(newData.weight, newData.height)
    }

    onUpdateUserData(newData)
    setEditingField(null)
  }

  const handleCancelEdit = () => {
    setEditValues({
      name: userData.name,
      age: userData.age.toString(),
      weight: userData.weight.toString(),
      height: userData.height.toString(),
    })
    setEditingField(null)
  }

  const imcInfo = getIMCCategory(userData.imc)

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
          <h1 className="text-xl font-bold">Configurações</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Theme Toggle */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo Escuro</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alternar entre tema claro e escuro</p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onToggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Personal Data */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                  {editingField === "name" ? (
                    <Input
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      className="mt-1 h-8 bg-transparent border-gray-300 dark:border-gray-600"
                      autoFocus
                    />
                  ) : (
                    <p className="font-medium">{userData.name}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {editingField === "name" ? (
                  <>
                    <Button size="sm" onClick={() => handleSaveField("name")} className="h-8 px-3">
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-3 bg-transparent">
                      ✕
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField("name")}
                    className="h-8 px-3 text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Age */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Idade</p>
                  {editingField === "age" ? (
                    <Input
                      type="number"
                      value={editValues.age}
                      onChange={(e) => setEditValues({ ...editValues, age: e.target.value })}
                      className="mt-1 h-8 bg-transparent border-gray-300 dark:border-gray-600"
                      autoFocus
                    />
                  ) : (
                    <p className="font-medium">{userData.age} anos</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {editingField === "age" ? (
                  <>
                    <Button size="sm" onClick={() => handleSaveField("age")} className="h-8 px-3">
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-3 bg-transparent">
                      ✕
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField("age")}
                    className="h-8 px-3 text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Weight */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Weight className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Peso</p>
                  {editingField === "weight" ? (
                    <Input
                      type="number"
                      value={editValues.weight}
                      onChange={(e) => setEditValues({ ...editValues, weight: e.target.value })}
                      className="mt-1 h-8 bg-transparent border-gray-300 dark:border-gray-600"
                      autoFocus
                    />
                  ) : (
                    <p className="font-medium">{userData.weight} kg</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {editingField === "weight" ? (
                  <>
                    <Button size="sm" onClick={() => handleSaveField("weight")} className="h-8 px-3">
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-3 bg-transparent">
                      ✕
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField("weight")}
                    className="h-8 px-3 text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Height */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Ruler className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Altura</p>
                  {editingField === "height" ? (
                    <Input
                      type="number"
                      value={editValues.height}
                      onChange={(e) => setEditValues({ ...editValues, height: e.target.value })}
                      className="mt-1 h-8 bg-transparent border-gray-300 dark:border-gray-600"
                      autoFocus
                    />
                  ) : (
                    <p className="font-medium">{userData.height} cm</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {editingField === "height" ? (
                  <>
                    <Button size="sm" onClick={() => handleSaveField("height")} className="h-8 px-3">
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-3 bg-transparent">
                      ✕
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField("height")}
                    className="h-8 px-3 text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* IMC Display */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">IMC Atual</p>
                  <p className="font-medium">{userData.imc}</p>
                </div>
                <p className={`text-sm font-medium ${imcInfo.color}`}>{imcInfo.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Data */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-red-600 dark:text-red-400 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Zona de Perigo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Esta ação irá apagar todos os seus dados pessoais e treinos salvos. Esta ação não pode ser desfeita.
              </p>
              <Button onClick={onReset} variant="destructive" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Redefinir Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
