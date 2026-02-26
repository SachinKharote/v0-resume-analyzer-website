import Link from "next/link"
import {
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Target,
  Wand2,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: BarChart3,
    title: "Resume Score",
    description:
      "Get a comprehensive score across formatting, content, readability, ATS compatibility, and impact.",
    href: "/analyze",
  },
  {
    icon: ThumbsUp,
    title: "Pros & Cons",
    description:
      "See what your resume does well and where it falls short with clear, honest feedback.",
    href: "/analyze",
  },
  {
    icon: Lightbulb,
    title: "Improvements",
    description:
      "Receive prioritized, actionable suggestions to make your resume stronger and more competitive.",
    href: "/analyze",
  },
  {
    icon: Target,
    title: "Job Match Score",
    description:
      "Paste a job description and see how well your resume matches with keyword gap analysis.",
    href: "/job-match",
  },
  {
    icon: Wand2,
    title: "AI Enhancement",
    description:
      "Let AI rewrite weak bullet points into impactful achievement statements, or rewrite the full resume.",
    href: "/enhance",
  },
  {
    icon: ThumbsDown,
    title: "Gap Analysis",
    description:
      "Identify skill and experience gaps between your resume and your target roles.",
    href: "/job-match",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Everything you need to perfect your resume
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Our AI analyzes every aspect of your resume and gives you clear paths to improvement.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="group h-full border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-mono text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Try it <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
