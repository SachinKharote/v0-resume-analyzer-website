import { generateText, Output } from "ai"
import { resumeAnalysisSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json()

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 50) {
      return Response.json(
        { error: "Please provide a valid resume with at least 50 characters of text." },
        { status: 400 }
      )
    }

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({ schema: resumeAnalysisSchema }),
      messages: [
        {
          role: "system",
          content: `You are an expert resume analyst and career coach. Analyze the provided resume thoroughly and provide detailed, actionable feedback. Be specific and constructive. Score objectively based on industry best practices for resume writing. The 5 sections to score are: Formatting, Content Quality, ATS Compatibility, Impact & Achievements, Readability. Provide at least 4 pros and 4 cons. Provide 5-8 improvements ordered by priority.`,
        },
        {
          role: "user",
          content: `Please analyze this resume and provide a comprehensive evaluation:\n\n${resumeText}`,
        },
      ],
      temperature: 0.3,
      maxOutputTokens: 4000,
    })

    return Response.json({ analysis: output })
  } catch (error) {
    console.error("Resume analysis error:", error)
    return Response.json(
      { error: "Failed to analyze resume. Please check your API key and try again." },
      { status: 500 }
    )
  }
}
