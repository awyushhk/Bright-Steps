export const maxDuration = 300; // 5 minutes for Gemini analysis
export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import {
  addScreening,
  getScreeningsByParent,
  getScreeningsByChild,
  getAllSubmittedScreenings,
} from "@/lib/queries";
import { computeFinalRisk } from "@/lib/riskEngine";
import { geminiModel } from "@/lib/gemini"; // ✅ import directly

// ✅ Move analysis logic here instead of calling /api/analyze-video
async function analyzeVideoWithGemini(videoUrl, category, childAge) {
  const ANALYSIS_PROMPT = `You are an expert child development specialist analyzing a short video of a child for early autism screening purposes.

Analyze this video carefully and rate the following behavioral indicators on a scale of 0-10, where:
- 10 = completely typical development
- 5 = some concerns  
- 0 = significant concern

Rate ONLY these 5 indicators:
1. eye_contact
2. response_to_name
3. social_engagement
4. repetitive_movements (10 = none observed, 0 = frequent)
5. pointing_gesturing

Also provide a brief "summary" (2-3 sentences) and key "observations" as a list.

Respond ONLY with valid JSON, no markdown:
{
  "indicators": {
    "eye_contact": 0,
    "response_to_name": 0,
    "social_engagement": 0,
    "repetitive_movements": 0,
    "pointing_gesturing": 0
  },
  "summary": "string",
  "observations": ["string"]
}`;

  // Fetch video from Cloudinary
  const compressedUrl = videoUrl.replace(
    "/upload/",
    "/upload/w_640,h_480,q_60,f_mp4/",
  );
  console.log("Fetching compressed video:", compressedUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const videoResponse = await fetch(compressedUrl, {
    signal: controller.signal,
  }); 
  clearTimeout(timeout); 

  const videoBuffer = await videoResponse.arrayBuffer();
  const videoBase64 = Buffer.from(videoBuffer).toString("base64");
  const contentType = "video/mp4";

  const result = await geminiModel.generateContent([
    {
      inlineData: {
        mimeType: contentType,
        data: videoBase64,
      },
    },
    {
      text: `${ANALYSIS_PROMPT}\n\nContext: "${category}" video, child age: ${childAge || "unknown"} months.`,
    },
  ]);

  const responseText = result.response.text();
  const cleaned = responseText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function GET(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  const all = searchParams.get("all");

  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  if (all === "true" && role === "clinician") {
    const screenings = await getAllSubmittedScreenings();
  return Response.json(screenings, {
    headers: { 'Cache-Control': 'private, max-age=10, stale-while-revalidate=30' },
  });
  }

  if (childId) {
    const screenings = await getScreeningsByChild(childId);
    return Response.json(screenings, {
    headers: { 'Cache-Control': 'private, max-age=10, stale-while-revalidate=30' },
  });
  }

  const screenings = await getScreeningsByParent(userId);
  return Response.json(screenings, {
    headers: { 'Cache-Control': 'private, max-age=10, stale-while-revalidate=30' },
  });
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // ── Step 1: Analyze videos directly (no internal fetch) ──
  let videoAnalyses = [];
  let combinedVideoIndicators = null;

  if (body.videos && body.videos.length > 0) {
    const videosWithUrl = body.videos.filter((v) => v.url);

    if (videosWithUrl.length > 0) {
      const analysisPromises = videosWithUrl.map(async (video) => {
        try {
          console.log(`🎬 Analyzing ${video.category} video with Gemini...`);
          const analysis = await analyzeVideoWithGemini(
            video.url,
            video.category,
            body.childAge || null,
          );
          console.log(
            `✅ Analysis done for ${video.category}:`,
            analysis.indicators,
          );
          return { ...analysis, videoId: video.id, category: video.category };
        } catch (err) {
          console.error(`❌ Failed to analyze video ${video.id}:`, err.message);
          return null;
        }
      });

      videoAnalyses = (await Promise.all(analysisPromises)).filter(Boolean);

      if (videoAnalyses.length > 0) {
        const indicatorKeys = [
          "eye_contact",
          "response_to_name",
          "social_engagement",
          "repetitive_movements",
          "pointing_gesturing",
        ];
        combinedVideoIndicators = {};
        indicatorKeys.forEach((key) => {
          const values = videoAnalyses
            .map((a) => a.indicators?.[key])
            .filter((v) => v !== undefined && v !== null);
          if (values.length > 0) {
            combinedVideoIndicators[key] = Math.round(
              values.reduce((sum, v) => sum + v, 0) / values.length,
            );
          }
        });
      }
    }
  }

  // ── Step 2: Compute final risk ──
  const finalRisk = computeFinalRisk({
    questionnaireScore: body.questionnaireScore || 0,
    maxQuestionnaireScore: 15,
    videoIndicators: combinedVideoIndicators,
    recommendations: body.riskAssessment?.recommendations,
  });

  // ── Step 3: Save ──
  const screening = {
    ...body,
    riskAssessment: {
      ...finalRisk,
      videoAnalyses,
    },
  };

  await addScreening(screening);
  return Response.json(screening, { status: 201 });
}
