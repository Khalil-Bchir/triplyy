"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Suspense, useEffect, useState } from "react"
import { ApiError } from "@/features/auth/services/auth-service"
import { strings } from "@/lib/strings"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { validateEmail } from "@/features/auth/utils/auth-validation"
import { Loader2, LayoutGrid } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { getPostAuthRedirectPath } from "@/features/auth/utils/post-auth-redirect"
import { useAuthStore } from "@/store/auth-store"

function LoginPageContent() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({ email: false })
  const [step, setStep] = useState<"email" | "otp">("email")
  const [otp, setOtp] = useState("")
  const { requestOtp, verifyOtp, hasHydrated, isAuthenticated, profile, signOut } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const wantsSwitch = searchParams.get("switch") === "1"
  const authedHref = getPostAuthRedirectPath(profile ?? null)

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) return
    if (wantsSwitch) return
    router.replace(authedHref)
  }, [authedHref, hasHydrated, isAuthenticated, router, wantsSwitch])

  if (hasHydrated && isAuthenticated && !wantsSwitch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground">Redirecting…</p>
      </div>
    )
  }

  if (hasHydrated && isAuthenticated && wantsSwitch) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-bold">You’re already signed in</div>
                <div className="text-sm text-muted-foreground">{profile?.email ?? ""}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Button asChild size="lg">
                <Link href={authedHref}>Continue</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={async () => {
                  await signOut()
                  router.replace("/auth/login?switch=1")
                }}
              >
                Sign out &amp; use a different account
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (touched.email) {
      setEmailError(validateEmail(value))
    }
  }

  const handleEmailBlur = () => {
    setTouched({ email: true })
    setEmailError(validateEmail(email))
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailValidationError = validateEmail(email)

    setEmailError(emailValidationError)
    setTouched({ email: true })

    if (emailValidationError) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await requestOtp({ email })
      setStep("otp")
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setError(error.message)
        return
      }
      setError(strings.auth_generic_error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await verifyOtp({ email, token: otp })
      const nextProfile = useAuthStore.getState().profile
      router.push(getPostAuthRedirectPath(nextProfile))
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setError(error.message)
        return
      }
      setError("Invalid code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = email && !emailError

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col bg-background p-4 sm:p-6 lg:p-8 xl:p-12">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 lg:mb-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutGrid className="h-8 w-8" />
          </div>
        </div>

        {/* Form Container - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{strings.auth_login_title}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {step === "otp" ? "Enter the code we sent to your email." : "No password needed. We’ll email you a one-time code."}
              </p>
            </div>

            {step === "email" ? (
              <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">{strings.auth_email_label}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    dir="ltr"
                    className={`bg-muted/50 ${emailError && touched.email ? 'border-destructive' : ''}`}
                  />
                  {emailError && touched.email && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                  size="lg"
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? "Sending code..." : "Send code"}
                </Button>
              </div>
            </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                  size="lg"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : "Continue"}
                </Button>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <button
                    type="button"
                    className="hover:underline"
                    onClick={() => {
                      setStep("email")
                      setOtp("")
                      setError(null)
                    }}
                  >
                    Use a different email
                  </button>
                  <button
                    type="button"
                    className="hover:underline"
                    onClick={async () => {
                      setIsLoading(true)
                      setError(null)
                      try {
                        await requestOtp({ email })
                      } catch (err) {
                        setError(err instanceof ApiError ? err.message : strings.auth_generic_error)
                      } finally {
                        setIsLoading(false)
                      }
                    }}
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="hidden xl:flex flex-1 bg-muted/50 items-center justify-center p-12">
          <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LayoutGrid className="h-24 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
