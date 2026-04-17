import type { Metadata } from 'next'
import { Alexandria, Noto_Serif, JetBrains_Mono } from "next/font/google";
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "@/components/common/theme-provider"

const fontSans = Alexandria({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: 'Triplyy',
  description: 'Curated flight + hostel deals, sent to your inbox.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Triplyy',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: '/logo blue.png',
        type: 'image/png',
      },
      {
        url: '/logo blue.png',
        media: '(prefers-color-scheme: light)',
        type: 'image/png',
      },
      {
        url: '/logo white.png',
        media: '(prefers-color-scheme: dark)',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/logo blue.png',
        type: 'image/png',
      },
    ],
    shortcut: '/logo blue.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}>
      <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
