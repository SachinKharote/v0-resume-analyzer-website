import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center md:px-16">
          <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Ready to upgrade your resume?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            Join thousands of job seekers who improved their resumes and landed
            interviews faster with ResumeAI.
          </p>
          <Button size="lg" className="mt-8 gap-2 px-8" asChild>
            <a href="#upload">
              Start Analyzing
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
