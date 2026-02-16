"use client"

import { createClient } from "@/lib/supabase-browser"

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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <button
        onClick={login}
        className="bg-white text-black px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition"
      >
        Login with Google
      </button>
    </div>
  )
}
