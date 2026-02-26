import { z } from "zod"

export const resumeAnalysisSchema = z.object({
  overallScore: z.number().describe("Overall resume score from 0 to 100"),
  summary: z.string().describe("2-3 sentence executive summary of the resume quality"),
  pros: z.array(z.string()).describe("List of 4-6 strengths/things the resume does well"),
  cons: z.array(z.string()).describe("List of 4-6 weaknesses/areas that need improvement"),
  sections: z.array(
    z.object({
      name: z.string().describe("Section name like Formatting, Content, ATS Compatibility, Impact, Readability"),
      score: z.number().describe("Score from 0 to 100 for this section"),
      feedback: z.array(z.string()).describe("2-4 specific feedback items for this section"),
    })
  ).describe("Detailed breakdown of 5 resume sections"),
  keywords: z.object({
    found: z.array(z.string()).describe("Keywords/skills found in the resume"),
    missing: z.array(z.string()).describe("Important keywords/skills missing from the resume"),
  }),
  improvements: z.array(
    z.object({
      priority: z.enum(["high", "medium", "low"]).describe("Priority level"),
      title: z.string().describe("Short title of the improvement"),
      description: z.string().describe("Detailed description of what to improve and how"),
    })
  ).describe("Ordered list of 5-8 specific improvements"),
})

export const jobMatchSchema = z.object({
  matchScore: z.number().describe("Overall match score from 0 to 100 for this job"),
  matchSummary: z.string().describe("2-3 sentence summary of how well the resume matches the job"),
  matchedKeywords: z.array(z.string()).describe("Keywords from the job description found in the resume"),
  missingKeywords: z.array(z.string()).describe("Important keywords from the job description missing from the resume"),
  gapAnalysis: z.array(
    z.object({
      area: z.string().describe("Area or skill where there is a gap"),
      gap: z.string().describe("Description of the gap"),
      suggestion: z.string().describe("How to address the gap"),
    })
  ).describe("Detailed gap analysis between resume and job requirements"),
  tailoredSuggestions: z.array(z.string()).describe("5-8 specific suggestions to tailor the resume for this job"),
  strengthsForRole: z.array(z.string()).describe("3-5 strengths that align well with the job"),
})

export const enhanceBulletsSchema = z.object({
  enhancedBullets: z.array(
    z.object({
      original: z.string().describe("The original bullet point text"),
      enhanced: z.string().describe("The enhanced, more impactful version"),
      explanation: z.string().describe("Brief explanation of what was improved"),
    })
  ).describe("Each bullet point with its enhanced version"),
})

export const fullRewriteSchema = z.object({
  rewrittenResume: z.string().describe("The full rewritten resume in clean plain text format"),
  changesSummary: z.array(z.string()).describe("List of 4-6 key changes made in the rewrite"),
  improvementAreas: z.array(z.string()).describe("Areas that were most improved"),
})

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>
export type JobMatch = z.infer<typeof jobMatchSchema>
export type EnhanceBullets = z.infer<typeof enhanceBulletsSchema>
export type FullRewrite = z.infer<typeof fullRewriteSchema>
