import { Upload, Cpu, ClipboardList } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    description:
      "Drag and drop your PDF, DOCX, or TXT file. Your data stays private and is never stored.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes It",
    description:
      "Our AI engine scans your resume for formatting, keywords, ATS compatibility, and impact.",
  },
  {
    icon: ClipboardList,
    step: "03",
    title: "Get Your Results",
    description:
      "Receive detailed scoring, pros/cons, improvements, and optionally match against a job description.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Three simple steps to a stronger resume
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              {index < steps.length - 1 && (
                <div
                  className="absolute left-1/2 top-10 hidden h-px w-full bg-border/50 md:block"
                  aria-hidden="true"
                />
              )}

              <div className="glass-panel relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl text-primary shadow-sm">
                <item.icon className="h-8 w-8" />
              </div>

              <span className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Step {item.step}
              </span>
              <h3 className="mt-2 font-mono text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
