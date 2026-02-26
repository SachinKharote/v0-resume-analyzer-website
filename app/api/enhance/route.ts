import { generateText, Output } from "ai"
import { enhanceBulletsSchema, fullRewriteSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const { resumeText, mode, bulletPoints } = await req.json()

    if (mode === "bullets") {
      if (!bulletPoints || !Array.isArray(bulletPoints) || bulletPoints.length === 0) {
        return Response.json(
          { error: "Please provide bullet points to enhance." },
          { status: 400 }
        )
      }

      const { output } = await generateText({
        model: "openai/gpt-4o-mini",
        output: Output.object({ schema: enhanceBulletsSchema }),
        messages: [
          {
            role: "system",
            content: `You are an expert resume writer. Enhance the provided bullet points to make them more impactful. Use strong action verbs, quantify achievements where possible, follow the STAR method, and make each bullet concise yet powerful. Keep the original meaning but make it significantly more compelling for recruiters and ATS systems.`,
          },
          {
            role: "user",
            content: `Enhance these resume bullet points:\n\n${bulletPoints.map((b: string, i: number) => `${i + 1}. ${b}`).join("\n")}`,
          },
        ],
        temperature: 0.4,
        maxOutputTokens: 3000,
      })

      return Response.json({ result: output })
    }

    if (mode === "full") {
      if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 50) {
        return Response.json(
          { error: "Please provide a valid resume with at least 50 characters." },
          { status: 400 }
        )
      }

      const { output } = await generateText({
        model: "openai/gpt-4o-mini",
        output: Output.object({ schema: fullRewriteSchema }),
        messages: [
          {
            role: "system",
            content: `You are an expert resume writer and career coach. Rewrite the entire resume to be more professional, impactful, and ATS-friendly. Improve formatting suggestions, strengthen bullet points, add quantifiable achievements where possible, use strong action verbs, and ensure consistent tense and style. Keep the same information and structure but significantly improve the quality of writing. Output the full rewritten resume in clean plain text.`,
          },
          {
            role: "user",
            content: `Please rewrite and enhance this entire resume:\n\n${resumeText}`,
          },
        ],
        temperature: 0.4,
        maxOutputTokens: 5000,
      })

      return Response.json({ result: output })
    }

    return Response.json({ error: "Invalid mode. Use 'bullets' or 'full'." }, { status: 400 })
  } catch (error) {
    console.error("Enhance error:", error)
    return Response.json(
      { error: "Failed to enhance resume. Please check your API key and try again." },
      { status: 500 }
    )
  }
}
