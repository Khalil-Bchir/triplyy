"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Sun, Moon, Earth } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePreferencesStore } from "@/store/preferences-store"
import { strings } from "@/lib/strings"
import { usePathname, useRouter } from "next/navigation"
import { getPostAuthRedirectPath } from "@/features/auth/utils/post-auth-redirect"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")
  const { isAuthenticated, profile, signOut } = useAuth()
  const theme = usePreferencesStore((state) => state.theme)
  const setTheme = usePreferencesStore((state) => state.setTheme)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setResolvedTheme(media.matches ? "dark" : "light")
    update()
    media.addEventListener?.("change", update)
    return () => media.removeEventListener?.("change", update)
  }, [])

  const getUserInitials = () => {
    if (profile?.email) {
      return profile.email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  const handleLogout = () => {
    signOut()
    router.push("/")
  }

  const isHome = pathname === "/"
  const postAuthHref = getPostAuthRedirectPath(profile ?? null)

  const effectiveTheme = theme === "system" ? resolvedTheme : theme
  const getThemeIcon = () =>
    effectiveTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />

  const handleToggleTheme = () => {
    const next = effectiveTheme === "dark" ? "light" : "dark"
    setTheme(next)
  }

  const navLinkClassName =
    "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 lg:px-8 py-3">
        <div className="flex h-14 items-center justify-between rounded-full border bg-background/80 px-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full pr-3 py-1 -ml-1 transition-colors hover:bg-muted/40"
            aria-label={strings.app_name}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Earth  className="h-6 w-6" />
            </span>
            <span className="text-base font-extrabold tracking-tight">
              Triplyy<span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {isHome ? (
              <>
                <a
                  href="#how"
                  className={navLinkClassName}
                >
                  How it works
                </a>
                <a
                  href="#pricing"
                  className={navLinkClassName}
                >
                  Pricing
                </a>
                <a
                  href="#sample"
                  className={navLinkClassName}
                >
                  Sample digest
                </a>
              </>
            ) : (
              <Link
                href="/"
                className={navLinkClassName}
              >
                {strings.nav_home}
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isMounted && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={strings.theme}
                  className="rounded-full"
                  onClick={handleToggleTheme}
                >
                  {getThemeIcon()}
                </Button>

                {!isAuthenticated ? (
                  <>
                    <Button
                      asChild
                      className="rounded-full motion-safe:transition-transform motion-safe:active:scale-[0.98]"
                    >
                      <Link href="/auth/login">{strings.nav_login}</Link>
                    </Button>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {profile?.email?.split("@")[0] || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {profile?.email || ""}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={postAuthHref}>
                          {postAuthHref === "/upgrade" ? "Upgrade" : strings.nav_dashboard}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings/account">{strings.nav_account_settings}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>{strings.logout}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-full transition-colors hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border bg-background/80 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="flex flex-col gap-4">
              {isHome ? (
                <>
                  <a
                    href="#how"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How it works
                  </a>
                  <a
                    href="#pricing"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                  <a
                    href="#sample"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sample digest
                  </a>
                </>
              ) : (
                <Link
                  href="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {strings.nav_home}
                </Link>
              )}
              <div className="flex items-center gap-2 pt-2">
                {isMounted && (
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={strings.theme}
                    className="rounded-full bg-transparent"
                    onClick={handleToggleTheme}
                  >
                    {getThemeIcon()}
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {!isAuthenticated ? (
                  <>
                    <Button asChild className="w-full motion-safe:transition-transform motion-safe:active:scale-[0.98]">
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        {strings.nav_login}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          {profile?.email?.split("@")[0] || "User"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {profile?.email?.split("@")[0] || "User"}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {profile?.email || ""}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={postAuthHref} onClick={() => setMobileMenuOpen(false)}>
                            {postAuthHref === "/upgrade" ? "Upgrade" : strings.nav_dashboard}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings/account" onClick={() => setMobileMenuOpen(false)}>
                            {strings.nav_account_settings}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>{strings.logout}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
