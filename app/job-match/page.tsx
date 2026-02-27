"use client"

import { useState, useCallback } from "react"
import { Loader2, Target, CheckCircle2, AlertTriangle, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FluxBackground } from "@/components/flux-background"
import { FileUpload } from "@/components/file-upload"
import { ScoreGauge } from "@/components/score-gauge"
import type { JobMatch } from "@/lib/schemas"

async function extractText(file: File): Promise<string> {
  if (file.type === "text/plain") {
    return file.text()
  }
  if (file.name.endsWith(".docx")) {
    const mammoth = await import("mammoth")
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  }
  const text = await file.text()
  if (file.type === "application/pdf") {
    const readable = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim()
    if (readable.length > 100) return readable
    return "Could not extract text from this PDF. Please try a .txt or .docx file."
  }
  return text
}

export default function JobMatchPage() {
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isMatching, setIsMatching] = useState(false)
  const [match, setMatch] = useState<JobMatch | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<"file" | "text">("file")

  const handleFileSelect = useCallback((f: File) => {
    setFile(f)
    setMatch(null)
    setError(null)
  }, [])

  const handleFileRemove = useCallback(() => {
    setFile(null)
    setMatch(null)
    setError(null)
  }, [])

  const handleMatch = useCallback(async () => {
    setIsMatching(true)
    setError(null)

    try {
      let text = resumeText
      if (inputMode === "file" && file) {
        text = await extractText(file)
      }

      if (!text || text.trim().length < 50) {
        setError("Please provide a Resume with at least 50 characters of text.")
        setIsMatching(false)
        return
      }

      if (!jobDescription || jobDescription.trim().length < 30) {
        setError("Please provide a job description with at least 30 characters.")
        setIsMatching(false)
        return
      }

      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, jobDescription }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Matching failed. Please try again.")
      } else {
        setMatch(data.match)
      }
    } catch {
      setError("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsMatching(false)
    }
  }, [file, resumeText, jobDescription, inputMode])

  const canMatch = (inputMode === "file" ? !!file : resumeText.trim().length >= 50) && jobDescription.trim().length >= 30

  return (
    <div className="min-h-screen bg-background">
      <FluxBackground />
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Job Match
          </p>
          <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Match your resume to a job description
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            See how well your resume fits a specific role with keyword analysis and gap detection.
          </p>
        </div>

        {/* Two-panel input */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Resume Panel */}
          <div>
            <h3 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Your Resume
            </h3>
            <div className="mb-4 flex items-center gap-2">
              <Button
                variant={inputMode === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("file")}
              >
                Upload File
              </Button>
              <Button
                variant={inputMode === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("text")}
              >
                Paste Text
              </Button>
            </div>
            {inputMode === "file" ? (
              <FileUpload
                file={file}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                disabled={isMatching}
              />
            ) : (
              <textarea
                className="glass-panel w-full rounded-xl px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[250px] resize-y"
                placeholder="Paste your full resume text here..."
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value)
                  setMatch(null)
                  setError(null)
                }}
                disabled={isMatching}
              />
            )}
          </div>

          {/* Job Description Panel */}
          <div>
            <h3 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Job Description
            </h3>
            <div className="mb-4 h-9" /> {/* Spacer to align with resume panel buttons */}
            <textarea
              className="glass-panel w-full rounded-xl px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[250px] resize-y"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value)
                setMatch(null)
                setError(null)
              }}
              disabled={isMatching}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="gap-2 px-10"
            onClick={handleMatch}
            disabled={!canMatch || isMatching}
          >
            {isMatching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Matching...
              </>
            ) : (
              <>
                <Target className="h-4 w-4" />
                Match Resume to Job
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Results */}
        {match && (
          <div className="mt-12 space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Score + Summary */}
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
              <Card className="glass-panel flex items-center justify-center py-8">
                <ScoreGauge score={match.matchScore} label="Match Score" />
              </Card>
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <h3 className="font-mono text-lg font-semibold text-foreground">Match Summary</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{match.matchSummary}</p>

                  {/* Strengths for Role */}
                  <div className="mt-6">
                    <h4 className="font-mono text-sm font-semibold text-foreground">Your Strengths for This Role</h4>
                    <ul className="mt-2 space-y-2">
                      {match.strengthsForRole.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Keywords */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-mono text-base">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Matched Keywords ({match.matchedKeywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {match.matchedKeywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="secondary"
                        className="border border-success/20 bg-success/10 text-success"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-mono text-base">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Missing Keywords ({match.missingKeywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {match.missingKeywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="secondary"
                        className="border border-destructive/20 bg-destructive/10 text-destructive"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gap Analysis */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono text-base">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {match.gapAnalysis.map((gap, i) => (
                    <div key={i} className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <h5 className="font-mono text-sm font-semibold text-foreground">{gap.area}</h5>
                      <p className="mt-1 text-sm text-muted-foreground">{gap.gap}</p>
                      <div className="mt-2 flex items-start gap-2 rounded-md bg-primary/5 px-3 py-2">
                        <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <p className="text-sm text-foreground">{gap.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tailored Suggestions */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono text-base">
                  <Zap className="h-5 w-5 text-accent" />
                  Tailored Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4">
                  {match.tailoredSuggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
