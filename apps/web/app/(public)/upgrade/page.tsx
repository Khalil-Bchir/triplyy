import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UpgradePage() {
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Unlock your dashboard</h1>
        <p className="text-muted-foreground">
          Your account is on the Free tier. Upgrade to access the full dashboard and recurring digests.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild size="lg">
            <Link href="/pricing">See plans</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

