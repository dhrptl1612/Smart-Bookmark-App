"use client"

import { createClient } from "@/lib/supabaseClient"

export default function Home() {
  const supabase = createClient()

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div className="card p-10 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Bookmark Manager</h1>

        <button
          onClick={login}
          className="w-full bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Login with Google
        </button>
      </div>
    </div>
  )
}
