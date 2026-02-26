import {
  FileSearch,
  Target,
  BarChart3,
  Lightbulb,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: FileSearch,
    title: "ATS Compatibility Check",
    description:
      "Ensure your resume passes Applicant Tracking Systems used by 98% of Fortune 500 companies.",
  },
  {
    icon: Target,
    title: "Keyword Optimization",
    description:
      "Identify missing keywords from your target job description and boost your match rate.",
  },
  {
    icon: BarChart3,
    title: "Resume Scoring",
    description:
      "Get a comprehensive score across formatting, content, readability, and impact metrics.",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description:
      "Receive actionable, line-by-line suggestions to strengthen your bullet points and summary.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Your resume data is processed securely and never stored or shared with third parties.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get detailed feedback in seconds, not hours. Iterate fast and apply with confidence.",
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
            Our AI analyzes every aspect of your resume against industry
            standards and real hiring data.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
