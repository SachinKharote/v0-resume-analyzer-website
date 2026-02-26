import { FileText } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-mono text-lg font-bold text-foreground">ResumeAI</span>
          </div>

          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            <Link
              href="/analyze"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Analyze
            </Link>
            <Link
              href="/job-match"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Job Match
            </Link>
            <Link
              href="/enhance"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              AI Enhance
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            {"Built with care. Your data stays yours."}
          </p>
        </div>
      </div>
    </footer>
  )
}
