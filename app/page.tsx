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
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={login}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Login with Google
      </button>
    </div>
  )
}
