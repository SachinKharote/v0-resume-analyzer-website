import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel rounded-2xl px-8 py-16 text-center md:px-16">
          <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Ready to upgrade your resume?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            Join thousands of job seekers who improved their resumes and landed
            interviews faster with ResumeAI.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/analyze">
                Start Analyzing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-8" asChild>
              <Link href="/enhance">
                Enhance with AI
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
