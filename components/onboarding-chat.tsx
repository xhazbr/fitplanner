"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, User, Calendar, Weight, Ruler } from "lucide-react"

interface UserData {
  name: string
  age: number
  weight: number
  height: number
  imc: number
}

interface OnboardingChatProps {
  onComplete: (data: UserData) => void
}

interface Message {
  type: "bot" | "user"
  content: string
  timestamp: Date
}

export function OnboardingChat({ onComplete }: OnboardingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: "Olá! 👋 Bem-vindo ao seu Planner de Treinos!",
      timestamp: new Date(),
    },
    {
      type: "bot",
      content: "Vou fazer algumas perguntas para personalizar sua experiência. Vamos começar?",
      timestamp: new Date(),
    },
    {
      type: "bot",
      content: "Qual é o seu nome?",
      timestamp: new Date(),
    },
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    name: "",
    age: 0,
    weight: 0,
    height: 0,
  })
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const steps = [
    { field: "name", question: "Qual é o seu nome?", icon: User, type: "text", placeholder: "Digite seu nome" },
    { field: "age", question: "Quantos anos você tem?", icon: Calendar, type: "number", placeholder: "Ex: 25" },
    { field: "weight", question: "Qual é o seu peso em kg?", icon: Weight, type: "number", placeholder: "Ex: 70" },
    { field: "height", question: "Qual é a sua altura em cm?", icon: Ruler, type: "number", placeholder: "Ex: 175" },
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        })
      }
    }

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [messages, isProcessing])

  const calculateIMC = (weight: number, height: number) => {
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return "Abaixo do peso"
    if (imc < 25) return "Peso normal"
    if (imc < 30) return "Sobrepeso"
    return "Obesidade"
  }

  const handleSubmit = () => {
    if (!inputValue.trim() || isProcessing) return

    setIsProcessing(true)

    const newUserMessage: Message = {
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])

    const field = steps[currentStep].field as keyof typeof userData
    const value = steps[currentStep].type === "number" ? Number(inputValue) : inputValue

    const updatedUserData = { ...userData, [field]: value }
    setUserData(updatedUserData)

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1
        const botMessage: Message = {
          type: "bot",
          content: steps[nextStep].question,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setCurrentStep(nextStep)
        setInputValue("")
        setIsProcessing(false)
      } else {
        // Finalizar onboarding
        const imc = calculateIMC(updatedUserData.weight, updatedUserData.height)
        const imcCategory = getIMCCategory(imc)

        const finalMessage: Message = {
          type: "bot",
          content: `Perfeito, ${updatedUserData.name}! 🎉\n\nResumo dos seus dados:\n• Nome: ${updatedUserData.name}\n• Idade: ${updatedUserData.age} anos\n• Peso: ${updatedUserData.weight}kg\n• Altura: ${updatedUserData.height}cm\n• IMC: ${imc} (${imcCategory})\n\nAgora vamos começar a planejar seus treinos!`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, finalMessage])

        setTimeout(() => {
          onComplete({
            ...updatedUserData,
            imc,
          })
        }, 3000)
        setIsProcessing(false)
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isProcessing) {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black text-black dark:text-white">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 pt-8 px-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Setup Inicial</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configure seu perfil</p>
          </div>
        </div>

        {/* Messages Container */}
        <Card className="flex-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-4 mx-4 flex flex-col shadow-lg">
          <div
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-line transition-all duration-300 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-4 shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 mr-4"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl mr-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            {/* Invisible div for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Input Area */}
        {currentStep < steps.length && (
          <div className="space-y-4 px-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              {React.createElement(steps[currentStep].icon, { className: "w-4 h-4" })}
              <span className="text-sm">
                Pergunta {currentStep + 1} de {steps.length}
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                type={steps[currentStep].type}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={steps[currentStep].placeholder}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-black dark:text-white flex-1 shadow-sm"
                autoFocus
                disabled={isProcessing}
              />
              <Button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
              >
                {isProcessing ? "..." : "Enviar"}
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center pb-8 px-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
