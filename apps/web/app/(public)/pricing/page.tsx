import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { PricingPageContent } from "@/features/site/components/PricingPageContent"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PricingPageContent />
      <Footer />
    </div>
  )
}

