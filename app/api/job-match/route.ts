import { generateText, Output } from "ai"
import { jobMatchSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json()

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 50) {
      return Response.json(
        { error: "Please provide a valid resume with at least 50 characters of text." },
        { status: 400 }
      )
    }

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 30) {
      return Response.json(
        { error: "Please provide a valid job description with at least 30 characters." },
        { status: 400 }
      )
    }

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({ schema: jobMatchSchema }),
      messages: [
        {
          role: "system",
          content: `You are an expert recruiter and ATS specialist. Compare the provided resume against the job description. Identify matching keywords, missing keywords, skill gaps, and provide specific suggestions to tailor the resume for this role. Be thorough with keyword matching - check for both exact and semantic matches. Score the match from 0-100.`,
        },
        {
          role: "user",
          content: `Compare this resume against the job description and provide a detailed match analysis.\n\n--- RESUME ---\n${resumeText}\n\n--- JOB DESCRIPTION ---\n${jobDescription}`,
        },
      ],
      temperature: 0.3,
      maxOutputTokens: 4000,
    })

    return Response.json({ match: output })
  } catch (error) {
    console.error("Job match error:", error)
    return Response.json(
      { error: "Failed to match resume to job. Please check your API key and try again." },
      { status: 500 }
    )
  }
}
