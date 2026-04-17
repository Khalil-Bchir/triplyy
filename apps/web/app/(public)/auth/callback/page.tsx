"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { strings } from "@/lib/strings"
import { getPostAuthRedirectPath } from "@/features/auth/utils/post-auth-redirect"

type CallbackState = "processing" | "success" | "error"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { revalidateSession } = useAuth()
  const [state, setState] = useState<CallbackState>("processing")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // The API has already exchanged the code and set httpOnly cookies.
    // Here we just revalidate the session (GET /users/me) and route onward.
    const err = searchParams.get("error")
    const errDesc = searchParams.get("error_description")
    if (err) {
      setErrorMessage(errDesc || err || strings.auth_oauth_error)
      setState("error")
      return
    }

    const run = async () => {
      try {
        const p = await revalidateSession()
        setState("success")
        setTimeout(() => router.push(getPostAuthRedirectPath(p)), 400)
      } catch {
        setErrorMessage(strings.auth_generic_error)
        setState("error")
      }
    }

    run()
  }, [revalidateSession, router, searchParams])

  const renderIcon = () => {
    if (state === "processing") return <Loader2 className="w-8 h-8 text-primary animate-spin" />
    if (state === "success") return <CheckCircle className="w-8 h-8 text-green-500" />
    return <XCircle className="w-8 h-8 text-destructive" />
  }

  const title =
    state === "success"
      ? strings.auth_oauth_success_title
      : state === "processing"
        ? strings.auth_oauth_processing_title
        : strings.auth_oauth_error_title

  const description =
    state === "success"
      ? strings.auth_oauth_success_description
      : state === "processing"
        ? strings.auth_oauth_processing_description
        : errorMessage || strings.auth_oauth_error_description

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">{renderIcon()}</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {state === "error" && (
          <button
            onClick={() => router.push("/auth/login")}
            className="text-primary hover:underline"
          >
            {strings.auth_back_to_login}
          </button>
        )}
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}

