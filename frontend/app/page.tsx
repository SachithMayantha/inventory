import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default function Home() {
  // In a real app, you would check if the user is already authenticated
  // and redirect them to the dashboard if they are
  const isAuthenticated = false

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Restaurant Inventory</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to manage your inventory</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

