"use client"

import { useState, useCallback } from "react"
import {
  Loader2,
  Wand2,
  Plus,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  FileText,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FluxBackground } from "@/components/flux-background"
import { FileUpload } from "@/components/file-upload"
import type { EnhanceBullets, FullRewrite } from "@/lib/schemas"

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

export default function EnhancePage() {
  const [mode, setMode] = useState<"bullets" | "full">("bullets")

  // Bullet mode state
  const [bulletPoints, setBulletPoints] = useState<string[]>([""])
  const [bulletResult, setBulletResult] = useState<EnhanceBullets | null>(null)
  const [isBulletLoading, setIsBulletLoading] = useState(false)

  // Full rewrite state
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [fullResult, setFullResult] = useState<FullRewrite | null>(null)
  const [isFullLoading, setIsFullLoading] = useState(false)
  const [fullInputMode, setFullInputMode] = useState<"file" | "text">("text")

  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedFull, setCopiedFull] = useState(false)

  const handleAddBullet = useCallback(() => {
    setBulletPoints((prev) => [...prev, ""])
  }, [])

  const handleRemoveBullet = useCallback((index: number) => {
    setBulletPoints((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleBulletChange = useCallback((index: number, value: string) => {
    setBulletPoints((prev) => prev.map((b, i) => (i === index ? value : b)))
  }, [])

  const handleEnhanceBullets = useCallback(async () => {
    setIsBulletLoading(true)
    setError(null)
    setBulletResult(null)

    try {
      const validBullets = bulletPoints.filter((b) => b.trim().length > 0)
      if (validBullets.length === 0) {
        setError("Please add at least one bullet point to enhance.")
        setIsBulletLoading(false)
        return
      }

      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "bullets", bulletPoints: validBullets }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Enhancement failed.")
      } else {
        setBulletResult(data.result)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsBulletLoading(false)
    }
  }, [bulletPoints])

  const handleFullRewrite = useCallback(async () => {
    setIsFullLoading(true)
    setError(null)
    setFullResult(null)

    try {
      let text = resumeText
      if (fullInputMode === "file" && file) {
        text = await extractText(file)
      }

      if (!text || text.trim().length < 50) {
        setError("Please provide a resume with at least 50 characters.")
        setIsFullLoading(false)
        return
      }

      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "full", resumeText: text }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Rewrite failed.")
      } else {
        setFullResult(data.result)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsFullLoading(false)
    }
  }, [file, resumeText, fullInputMode])

  const handleCopyBullet = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }, [])

  const handleCopyFull = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedFull(true)
    setTimeout(() => setCopiedFull(false), 2000)
  }, [])

  const isLoading = isBulletLoading || isFullLoading

  return (
    <div className="min-h-screen bg-background">
      <FluxBackground />
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            AI Enhancement
          </p>
          <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Transform your resume with AI
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Enhance individual bullet points or get a complete AI-powered rewrite of your entire resume.
          </p>
        </div>

        {/* Mode Tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "bullets" | "full")} className="mt-12">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="bullets" className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              Bullet Points
            </TabsTrigger>
            <TabsTrigger value="full" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Full Rewrite
            </TabsTrigger>
          </TabsList>

          {/* Bullet Points Mode */}
          <TabsContent value="bullets" className="mt-8">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="font-mono text-base">Enter your bullet points</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bulletPoints.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <textarea
                      className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] resize-y"
                      placeholder="e.g. Managed a team of developers..."
                      value={bullet}
                      onChange={(e) => handleBulletChange(i, e.target.value)}
                      disabled={isLoading}
                    />
                    {bulletPoints.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBullet(i)}
                        disabled={isLoading}
                        aria-label="Remove bullet"
                        className="h-9 w-9 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddBullet}
                  className="gap-1.5"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                  Add Bullet
                </Button>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                className="gap-2 px-10"
                onClick={handleEnhanceBullets}
                disabled={isBulletLoading || bulletPoints.every((b) => !b.trim())}
              >
                {isBulletLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Enhance Bullets
                  </>
                )}
              </Button>
            </div>

            {/* Bullet Results */}
            {bulletResult && (
              <div className="mt-10 space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <h3 className="font-mono text-lg font-semibold text-foreground">Enhanced Results</h3>
                {bulletResult.enhancedBullets.map((item, i) => (
                  <Card key={i} className="glass-panel overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2">
                        {/* Original */}
                        <div className="border-b border-border/50 p-5 md:border-b-0 md:border-r">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">Original</Badge>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">{item.original}</p>
                        </div>
                        {/* Enhanced */}
                        <div className="p-5">
                          <div className="mb-2 flex items-center justify-between">
                            <Badge className="bg-primary/10 text-primary text-xs border-primary/20">Enhanced</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1 text-xs"
                              onClick={() => handleCopyBullet(item.enhanced, i)}
                            >
                              {copiedIndex === i ? (
                                <><Check className="h-3 w-3" /> Copied</>
                              ) : (
                                <><Copy className="h-3 w-3" /> Copy</>
                              )}
                            </Button>
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-foreground">{item.enhanced}</p>
                          <p className="mt-2 text-xs text-muted-foreground italic">{item.explanation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Full Rewrite Mode */}
          <TabsContent value="full" className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <Button
                variant={fullInputMode === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setFullInputMode("text")}
              >
                Paste Text
              </Button>
              <Button
                variant={fullInputMode === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => setFullInputMode("file")}
              >
                Upload File
              </Button>
            </div>

            {fullInputMode === "file" ? (
              <FileUpload
                file={file}
                onFileSelect={(f) => {
                  setFile(f)
                  setFullResult(null)
                  setError(null)
                }}
                onFileRemove={() => {
                  setFile(null)
                  setFullResult(null)
                  setError(null)
                }}
                disabled={isLoading}
              />
            ) : (
              <textarea
                className="glass-panel w-full rounded-xl px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[250px] resize-y"
                placeholder="Paste your full resume text here for a complete AI rewrite..."
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value)
                  setFullResult(null)
                  setError(null)
                }}
                disabled={isLoading}
              />
            )}

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                className="gap-2 px-10"
                onClick={handleFullRewrite}
                disabled={isFullLoading || (fullInputMode === "text" ? resumeText.trim().length < 50 : !file)}
              >
                {isFullLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rewriting...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Rewrite Full Resume
                  </>
                )}
              </Button>
            </div>

            {/* Full Rewrite Results */}
            {fullResult && (
              <div className="mt-10 space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                {/* Changes Summary */}
                <Card className="glass-panel">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 font-mono text-base">
                      <ArrowRight className="h-5 w-5 text-primary" />
                      Key Changes Made
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {fullResult.changesSummary.map((change, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Improvement Areas */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Areas improved:</span>
                  {fullResult.improvementAreas.map((area, i) => (
                    <Badge key={i} variant="secondary" className="border-primary/20 bg-primary/10 text-primary">
                      {area}
                    </Badge>
                  ))}
                </div>

                {/* Rewritten Resume */}
                <Card className="glass-panel">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 font-mono text-base">
                        <Sparkles className="h-5 w-5 text-accent" />
                        Rewritten Resume
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => handleCopyFull(fullResult.rewrittenResume)}
                      >
                        {copiedFull ? (
                          <><Check className="h-3.5 w-3.5" /> Copied</>
                        ) : (
                          <><Copy className="h-3.5 w-3.5" /> Copy All</>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="rounded-lg border border-border/50 bg-secondary/30 p-6">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                        {fullResult.rewrittenResume}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
