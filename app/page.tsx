"use client"

import { useState, useEffect } from "react"
import { OnboardingChat } from "@/components/onboarding-chat"
import { Dashboard } from "@/components/dashboard"
import { Settings } from "@/components/settings"

interface UserData {
  name: string
  age: number
  weight: number
  height: number
  imc: number
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<"dashboard" | "settings">("dashboard")
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Load user data with better error handling
    try {
      const savedData = localStorage.getItem("userData")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Validate data structure
        if (parsedData.name && parsedData.age && parsedData.weight && parsedData.height && parsedData.imc) {
          setUserData(parsedData)
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      localStorage.removeItem("userData") // Clear corrupted data
    }

    // Load theme preference
    try {
      const savedTheme = localStorage.getItem("theme")
      if (savedTheme) {
        setIsDarkMode(savedTheme === "dark")
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Apply theme to document with error handling
    try {
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      localStorage.setItem("theme", isDarkMode ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }, [isDarkMode])

  const handleUserDataComplete = (data: UserData) => {
    try {
      localStorage.setItem("userData", JSON.stringify(data))
      setUserData(data)
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  const handleUpdateUserData = (data: UserData) => {
    try {
      localStorage.setItem("userData", JSON.stringify(data))
      setUserData(data)
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }

  const handleReset = () => {
    try {
      localStorage.removeItem("userData")
      localStorage.removeItem("workouts")
      localStorage.removeItem("weeklyWorkouts")
      localStorage.removeItem("workoutHistory")
      localStorage.removeItem("exerciseDatabase")
      setUserData(null)
      setCurrentView("dashboard")
    } catch (error) {
      console.error("Error resetting data:", error)
    }
  }

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return <OnboardingChat onComplete={handleUserDataComplete} />
  }

  if (currentView === "settings") {
    return (
      <Settings
        userData={userData}
        onBack={() => setCurrentView("dashboard")}
        onUpdateUserData={handleUpdateUserData}
        onReset={handleReset}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />
    )
  }

  return <Dashboard userData={userData} onReset={handleReset} onOpenSettings={() => setCurrentView("settings")} />
}
