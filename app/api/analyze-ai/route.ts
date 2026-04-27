import { NextResponse } from "next/server";

type AnalyzeRequest = {
  examType?: string;
  answers?: {
    prompt: string;
    answer: string;
  }[];
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Gemini AI is not configured on the server." }, { status: 503 });
  }

  let body: AnalyzeRequest;

  try {
    body = (await request.json()) as AnalyzeRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const examType = body.examType?.trim() || "General Practice";
  const answers = (body.answers ?? []).filter((entry) => entry.answer?.trim());

  if (answers.length === 0) {
    return NextResponse.json({ error: "At least one answer is required." }, { status: 400 });
  }

  const prompt = [
    "Analyze these ISSB practice answers as a leadership and psychological response coach.",
    "Give practice feedback only, not official evaluation.",
    "Return strict JSON only.",
    "Use this exact shape:",
    '{"examType":"string","leadershipIndex":number,"improvementTips":["tip1","tip2","tip3"],"disclaimer":"This is practice feedback, not official ISSB evaluation.","answers":[{"prompt":"string","answer":"string","score":number,"strengths":"string","weakness":"string","improvedAnswer":"string"}]}',
    "Rules:",
    "- score must be out of 10",
    "- keep strengths and weakness short and practical",
    "- improvedAnswer must be concise and stronger than the original",
    "- leadershipIndex must be out of 10",
    `Exam Type: ${examType}`,
    `Answers: ${JSON.stringify(answers)}`,
  ].join("\n");

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Gemini request failed: ${errorText}` }, { status: 502 });
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: "Gemini returned an empty response." }, { status: 502 });
    }

    const parsed = JSON.parse(text) as {
      examType?: string;
      leadershipIndex?: number;
      improvementTips?: string[];
      disclaimer?: string;
      answers?: {
        prompt?: string;
        answer?: string;
        score?: number;
        strengths?: string;
        weakness?: string;
        improvedAnswer?: string;
      }[];
    };

    return NextResponse.json({
      examType: parsed.examType || examType,
      leadershipIndex: typeof parsed.leadershipIndex === "number" ? parsed.leadershipIndex : 0,
      improvementTips: Array.isArray(parsed.improvementTips) ? parsed.improvementTips.slice(0, 3) : [],
      disclaimer: parsed.disclaimer || "This is practice feedback, not official ISSB evaluation.",
      answers: Array.isArray(parsed.answers)
        ? parsed.answers.map((entry, index) => ({
            prompt: entry.prompt || answers[index]?.prompt || `Answer ${index + 1}`,
            answer: entry.answer || answers[index]?.answer || "",
            score: typeof entry.score === "number" ? entry.score : 0,
            strengths: entry.strengths || "",
            weakness: entry.weakness || "",
            improvedAnswer: entry.improvedAnswer || "",
          }))
        : [],
    });
  } catch {
    return NextResponse.json({ error: "Gemini AI analysis failed on the server." }, { status: 500 });
  }
}
