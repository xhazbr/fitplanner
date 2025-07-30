export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-400">Carregando painel administrativo...</p>
      </div>
    </div>
  )
}
