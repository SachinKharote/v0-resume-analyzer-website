"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalysisResult {
  overallScore: number
  sections: {
    name: string
    score: number
    feedback: string[]
  }[]
  keywords: {
    found: string[]
    missing: string[]
  }
  suggestions: string[]
}

const mockAnalysis: AnalysisResult = {
  overallScore: 72,
  sections: [
    {
      name: "Formatting",
      score: 85,
      feedback: [
        "Clean section headings with consistent formatting",
        "Consider using bullet points instead of paragraphs for work experience",
        "Add more whitespace between sections for better readability",
      ],
    },
    {
      name: "Content",
      score: 68,
      feedback: [
        "Quantify your achievements with specific numbers and metrics",
        "Summary section could be more targeted to your desired role",
        "Add action verbs at the start of each bullet point",
      ],
    },
    {
      name: "ATS Compatibility",
      score: 75,
      feedback: [
        "Good use of standard section headings",
        "Avoid tables and columns that ATS may not parse correctly",
        "Include your full name and contact info in plain text at the top",
      ],
    },
    {
      name: "Impact",
      score: 60,
      feedback: [
        "Lead with your strongest achievements in each role",
        "Use the STAR method to describe accomplishments",
        "Include relevant certifications and skills section",
      ],
    },
  ],
  keywords: {
    found: ["JavaScript", "React", "Team Leadership", "Agile", "Project Management"],
    missing: ["TypeScript", "CI/CD", "AWS", "System Design", "Mentoring"],
  },
  suggestions: [
    "Add a skills section with both technical and soft skills",
    "Include measurable results: revenue generated, team size managed, or efficiency improvements",
    "Tailor your summary to match the specific job description you are targeting",
    "Move education below experience if you have 3+ years of work history",
    "Use consistent date formatting throughout (e.g., Jan 2023 - Present)",
  ],
}

export function UploadSection() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type.includes("document"))) {
      setFile(droppedFile)
      setAnalysis(null)
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setAnalysis(null)
    }
  }, [])

  const handleAnalyze = useCallback(() => {
    if (!file) return
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
    }, 2500)
  }, [file])

  const handleRemoveFile = useCallback(() => {
    setFile(null)
    setAnalysis(null)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent"
    if (score >= 60) return "text-chart-4"
    return "text-destructive"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-accent"
    if (score >= 60) return "bg-chart-4"
    return "bg-destructive"
  }

  return (
    <section id="upload" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Analyze
          </p>
          <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Upload your resume to get started
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Supports PDF, DOCX, and TXT formats up to 5MB.
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mt-12 border-2 border-dashed border-border bg-card transition-colors hover:border-primary/30">
          <CardContent className="p-0">
            {!file ? (
              <label
                className={`flex cursor-pointer flex-col items-center justify-center px-6 py-16 transition-colors ${
                  isDragging ? "bg-primary/5" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="mt-4 text-lg font-medium text-foreground">
                  Drag and drop your resume here
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse your files
                </p>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                  aria-label="Upload resume file"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isAnalyzing && !analysis && (
                    <Button onClick={handleAnalyze} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Analyze Resume
                    </Button>
                  )}
                  {isAnalyzing && (
                    <Button disabled className="gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-10 space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Overall Score */}
            <Card className="border border-border bg-card">
              <CardContent className="flex flex-col items-center p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Overall Score
                </p>
                <div className={`mt-2 font-mono text-7xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </div>
                <p className="text-sm text-muted-foreground">out of 100</p>
                <div className="mt-6 w-full max-w-md">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(analysis.overallScore)}`}
                      style={{ width: `${analysis.overallScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Tabs */}
            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="mt-6 space-y-4">
                {analysis.sections.map((section) => (
                  <Card key={section.name} className="border border-border bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono text-lg font-semibold text-foreground">
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
                <Card className="border border-border bg-card">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-mono text-sm font-semibold uppercase tracking-wider text-accent">
                          Found Keywords
                        </h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {analysis.keywords.found.map((kw) => (
                            <Badge
                              key={kw}
                              variant="secondary"
                              className="border border-accent/20 bg-accent/10 text-accent"
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions" className="mt-6">
                <Card className="border border-border bg-card">
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {suggestion}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </section>
  )
}
