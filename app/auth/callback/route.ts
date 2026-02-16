import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient() // ✅ MUST await

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("OAuth Error:", error.message)
      return NextResponse.redirect(`${origin}/?error=auth`)
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
