import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-36">
      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <Badge
          variant="secondary"
          className="mb-6 gap-1.5 border border-primary/20 bg-primary/5 px-4 py-1.5 text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Resume Analysis
        </Badge>

        <h1 className="font-mono text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
          Land your dream job with a{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            smarter resume
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
          Upload your resume and get instant AI-driven scoring, pros and cons, actionable
          improvements, job-specific matching, and AI-enhanced bullet points.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2 px-8" asChild>
            <Link href="/analyze">
              Analyze My Resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="gap-2 px-8" asChild>
            <Link href="/job-match">Match to a Job</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Free to use. No sign-up required.
        </p>
      </div>
    </section>
  )
}
