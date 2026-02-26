"use client"

import { useState, useCallback } from "react"
import { Loader2, CheckCircle2, ThumbsUp, ThumbsDown, Lightbulb, BarChart3, Search, ArrowUp, ArrowRight, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FluxBackground } from "@/components/flux-background"
import { FileUpload } from "@/components/file-upload"
import { ScoreGauge } from "@/components/score-gauge"
import type { ResumeAnalysis } from "@/lib/schemas"

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
  // For PDF: read as text (basic extraction)
  const text = await file.text()
  // If PDF binary, extract readable parts
  if (file.type === "application/pdf") {
    const readable = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim()
    if (readable.length > 100) return readable
    return "Could not extract text from this PDF. Please try a .txt or .docx file, or paste your resume text directly."
  }
  return text
}

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<"file" | "text">("file")

  const handleFileSelect = useCallback((f: File) => {
    setFile(f)
    setAnalysis(null)
    setError(null)
  }, [])

  const handleFileRemove = useCallback(() => {
    setFile(null)
    setAnalysis(null)
    setError(null)
  }, [])

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      let text = resumeText
      if (inputMode === "file" && file) {
        text = await extractText(file)
      }

      if (!text || text.trim().length < 50) {
        setError("Please provide a resume with at least 50 characters of text.")
        setIsAnalyzing(false)
        return
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Analysis failed. Please try again.")
      } else {
        setAnalysis(data.analysis)
      }
    } catch {
      setError("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }, [file, resumeText, inputMode])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-success"
    if (score >= 60) return "bg-warning"
    return "bg-destructive"
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "high") return <ArrowUp className="h-4 w-4 text-destructive" />
    if (priority === "medium") return <ArrowRight className="h-4 w-4 text-warning" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === "high") return "border-destructive/20 bg-destructive/10 text-destructive"
    if (priority === "medium") return "border-warning/20 bg-warning/10 text-warning-foreground"
    return "border-border bg-secondary text-secondary-foreground"
  }

  const canAnalyze = inputMode === "file" ? !!file : resumeText.trim().length >= 50

  return (
    <div className="min-h-screen bg-background">
      <FluxBackground />
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Resume Analyzer
          </p>
          <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Get your resume score and feedback
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Upload your resume or paste it below. Our AI will analyze every aspect.
          </p>
        </div>

        {/* Input Section */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-center gap-2">
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
              disabled={isAnalyzing}
            />
          ) : (
            <textarea
              className="glass-panel w-full rounded-xl px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[200px] resize-y"
              placeholder="Paste your full resume text here..."
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value)
                setAnalysis(null)
                setError(null)
              }}
              disabled={isAnalyzing}
            />
          )}

          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              className="gap-2 px-10"
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-4 text-center text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {analysis && (
          <div className="mt-12 space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Score + Summary */}
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
              <Card className="glass-panel flex items-center justify-center py-8">
                <ScoreGauge score={analysis.overallScore} />
              </Card>
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <h3 className="font-mono text-lg font-semibold text-foreground">Summary</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{analysis.summary}</p>
                </CardContent>
              </Card>
            </div>

            {/* Pros & Cons */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-mono text-base">
                    <ThumbsUp className="h-5 w-5 text-success" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {analysis.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success" aria-hidden="true" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-mono text-base">
                    <ThumbsDown className="h-5 w-5 text-destructive" />
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {analysis.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive" aria-hidden="true" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Tabbed Details */}
            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sections" className="gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Sections</span>
                </TabsTrigger>
                <TabsTrigger value="keywords" className="gap-1.5">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Keywords</span>
                </TabsTrigger>
                <TabsTrigger value="improvements" className="gap-1.5">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Improvements</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="mt-6 space-y-4">
                {analysis.sections.map((section) => (
                  <Card key={section.name} className="glass-panel">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono text-base font-semibold text-foreground">
                          {section.name}
                        </h4>
                        <span className={`font-mono text-2xl font-bold ${getScoreColor(section.score)}`}>
                          {section.score}
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getProgressColor(section.score)}`}
                          style={{ width: `${section.score}%` }}
                        />
                      </div>
                      <ul className="mt-4 space-y-2">
                        {section.feedback.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="keywords" className="mt-6">
                <Card className="glass-panel">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h4 className="font-mono text-sm font-semibold uppercase tracking-wider text-success">
                        Found Keywords
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysis.keywords.found.map((kw) => (
                          <Badge
                            key={kw}
                            variant="secondary"
                            className="border border-success/20 bg-success/10 text-success"
                          >
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-mono text-sm font-semibold uppercase tracking-wider text-destructive">
                        Missing Keywords
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysis.keywords.missing.map((kw) => (
                          <Badge
                            key={kw}
                            variant="secondary"
                            className="border border-destructive/20 bg-destructive/10 text-destructive"
                          >
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="improvements" className="mt-6">
                <Card className="glass-panel">
                  <CardContent className="p-6">
                    <ul className="space-y-5">
                      {analysis.improvements.map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="flex flex-shrink-0 items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                              {i + 1}
                            </span>
                            {getPriorityIcon(item.priority)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-mono text-sm font-semibold text-foreground">{item.title}</h5>
                              <Badge variant="outline" className={`text-xs ${getPriorityBadge(item.priority)}`}>
                                {item.priority}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
