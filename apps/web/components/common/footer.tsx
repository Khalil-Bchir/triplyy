"use client"

import Link from "next/link"
import { strings } from "@/lib/strings"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="text-base font-extrabold tracking-tight">
              Triplyy<span className="text-primary">.</span>
            </div>
            <p className="text-sm text-muted-foreground">Built for backpackers who hate overpaying.</p>
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                X
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                TikTok
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground md:justify-end">
              <span>© {new Date().getFullYear()} {strings.app_name}.</span>
              <span>•</span>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                {strings.footer_privacy_policy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
