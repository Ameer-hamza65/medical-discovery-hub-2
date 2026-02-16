import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, chapterContent, chapterTitle, bookTitle, type } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build system prompt based on type
    let systemInstruction = "";
    const contentSnippet = chapterContent?.slice(0, 3000) || "";

    switch (type) {
      case "summary":
        systemInstruction = `You are a medical education AI assistant. Summarize the following medical textbook chapter content in a well-structured format. Include:
- A brief overview (2-3 sentences)
- Core Concepts (bullet points)
- Clinical Significance
- Key Takeaways (numbered list)

Chapter: "${chapterTitle}" from "${bookTitle}"

Chapter Content:
${contentSnippet}`;
        break;

      case "compliance":
        systemInstruction = `You are a clinical compliance AI assistant. Extract critical clinical compliance points from this medical chapter. Include:
- Critical Protocols (with ⚠️ markers)
- Standard of Care Requirements (with ✅ markers)
- Documentation Requirements (with 📋 markers)
- Regulatory Considerations

Chapter: "${chapterTitle}" from "${bookTitle}"

Chapter Content:
${contentSnippet}`;
        break;

      case "qa":
        systemInstruction = `You are a pharmacology AI assistant. Analyze the medications and drug interactions discussed in this chapter. Include:
- Key Drug Considerations
- Common Interactions to Watch (numbered)
- Monitoring Parameters
- Dosage Guidelines if applicable

Chapter: "${chapterTitle}" from "${bookTitle}"

Chapter Content:
${contentSnippet}`;
        break;

      case "general":
        systemInstruction = `You are a medical education AI assistant. Create a concise study guide for this chapter. Include:
- Learning Objectives
- Key Terms and Definitions
- Important Concepts for Exam Preparation
- Clinical Application Points
- Review Questions (2-3)

Chapter: "${chapterTitle}" from "${bookTitle}"

Chapter Content:
${contentSnippet}`;
        break;

      default:
        systemInstruction = `You are a medical education AI assistant. You have access to the following chapter content from a medical textbook. Answer the user's question accurately based on this content. If the answer is not in the content, say so and provide general medical knowledge with a disclaimer.

Chapter: "${chapterTitle}" from "${bookTitle}"

Chapter Content:
${contentSnippet}`;
    }

    const userMessage = prompt || "Please analyze this chapter.";

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemInstruction + "\n\nUser Query: " + userMessage }] },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error", details: errorText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResponse.json();
    const content =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("gemini-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
