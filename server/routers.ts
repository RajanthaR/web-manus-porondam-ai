import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { 
  createHoroscopeChart, 
  getHoroscopeChartById, 
  getHoroscopeChartsByUserId,
  createMatchingResult,
  getMatchingResultById,
  getMatchingResultsByUserId,
  getMatchingResultWithCharts,
  getRecentMatchesForUser,
  deleteMatchingResult
} from "./db";
import { extractHoroscopeFromImage, validateHoroscopeData, getNakshatraName, getRashiName } from "./horoscopeProcessor";
import { 
  calculatePorondamScores, 
  calculateOverallScore, 
  generateRecommendations, 
  generateRecommendationsSinhala,
  NAKSHATRAS,
  RASHIS
} from "./astrology";
import type { PorondamScores } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Horoscope chart operations
  horoscope: router({
    // Upload and process a horoscope chart image
    processImage: publicProcedure
      .input(z.object({
        imageBase64: z.string(),
        mimeType: z.string().default("image/jpeg"),
        personName: z.string().optional(),
        gender: z.enum(["male", "female"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Upload image to S3
        const fileKey = `horoscope-charts/${nanoid()}.${input.mimeType.split('/')[1] || 'jpg'}`;
        const imageBuffer = Buffer.from(input.imageBase64, 'base64');
        const { url: imageUrl } = await storagePut(fileKey, imageBuffer, input.mimeType);

        // Extract data from image using GPT-4 Vision
        const extracted = await extractHoroscopeFromImage(imageUrl);

        // Create chart record if user is authenticated
        let chartId: number | undefined;
        if (ctx.user) {
          chartId = await createHoroscopeChart({
            userId: ctx.user.id,
            personName: input.personName || extracted.personName,
            gender: input.gender || extracted.gender,
            birthDate: extracted.birthDate,
            birthTime: extracted.birthTime,
            birthPlace: extracted.birthPlace,
            nakshatra: extracted.nakshatra,
            nakshatraPada: extracted.nakshatraPada,
            rashi: extracted.rashi,
            planetaryPositions: extracted.planetaryPositions,
            imageUrl,
            imageKey: fileKey,
            extractedText: extracted.rawExtractedText,
          });
        }

        // Get nakshatra and rashi names
        const nakshatraInfo = extracted.nakshatra ? getNakshatraName(extracted.nakshatra) : null;
        const rashiInfo = extracted.rashi ? getRashiName(extracted.rashi) : null;

        return {
          chartId,
          imageUrl,
          extracted: {
            ...extracted,
            nakshatraName: nakshatraInfo,
            rashiName: rashiInfo,
          },
          validation: validateHoroscopeData(extracted),
        };
      }),

    // Update chart with manual corrections
    updateChart: protectedProcedure
      .input(z.object({
        chartId: z.number(),
        personName: z.string().optional(),
        gender: z.enum(["male", "female"]).optional(),
        nakshatra: z.number().min(1).max(27).optional(),
        nakshatraPada: z.number().min(1).max(4).optional(),
        rashi: z.number().min(1).max(12).optional(),
        birthDate: z.string().optional(),
        birthTime: z.string().optional(),
        birthPlace: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const chart = await getHoroscopeChartById(input.chartId);
        if (!chart || chart.userId !== ctx.user.id) {
          throw new Error("Chart not found or access denied");
        }

        // Update would go here
        return { success: true };
      }),

    // Get user's saved charts
    myCharts: protectedProcedure.query(async ({ ctx }) => {
      const charts = await getHoroscopeChartsByUserId(ctx.user.id);
      return charts.map(chart => ({
        ...chart,
        nakshatraName: chart.nakshatra ? getNakshatraName(chart.nakshatra) : null,
        rashiName: chart.rashi ? getRashiName(chart.rashi) : null,
      }));
    }),

    // Get chart by ID
    getChart: publicProcedure
      .input(z.object({ chartId: z.number() }))
      .query(async ({ input }) => {
        const chart = await getHoroscopeChartById(input.chartId);
        if (!chart) return null;
        
        return {
          ...chart,
          nakshatraName: chart.nakshatra ? getNakshatraName(chart.nakshatra) : null,
          rashiName: chart.rashi ? getRashiName(chart.rashi) : null,
        };
      }),
  }),

  // Matching operations
  matching: router({
    // Calculate compatibility between two charts
    calculate: publicProcedure
      .input(z.object({
        chart1: z.object({
          chartId: z.number().optional(),
          personName: z.string().optional(),
          gender: z.enum(["male", "female"]),
          nakshatra: z.number().min(1).max(27),
          nakshatraPada: z.number().min(1).max(4).optional(),
          rashi: z.number().min(1).max(12),
        }),
        chart2: z.object({
          chartId: z.number().optional(),
          personName: z.string().optional(),
          gender: z.enum(["male", "female"]),
          nakshatra: z.number().min(1).max(27),
          nakshatraPada: z.number().min(1).max(4).optional(),
          rashi: z.number().min(1).max(12),
        }),
        saveResult: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        const { chart1, chart2 } = input;

        // Calculate all 20 Porondam scores
        const porondamScores = calculatePorondamScores(
          chart1.nakshatra,
          chart2.nakshatra,
          chart1.rashi,
          chart2.rashi,
          chart1.gender,
          chart2.gender
        );

        // Calculate overall score
        const overallScore = calculateOverallScore(porondamScores);

        // Generate recommendations
        const recommendations = generateRecommendations(porondamScores, overallScore);
        const recommendationsSinhala = generateRecommendationsSinhala(porondamScores, overallScore);

        // Get names for display
        const chart1NakshatraName = getNakshatraName(chart1.nakshatra);
        const chart2NakshatraName = getNakshatraName(chart2.nakshatra);
        const chart1RashiName = getRashiName(chart1.rashi);
        const chart2RashiName = getRashiName(chart2.rashi);

        // Save result if requested and user is authenticated
        let resultId: number | undefined;
        if (input.saveResult && ctx.user) {
          resultId = await createMatchingResult({
            userId: ctx.user.id,
            chart1Id: chart1.chartId,
            chart2Id: chart2.chartId,
            overallScore: overallScore.toString(),
            porondamScores: porondamScores as unknown as Record<string, unknown>,
            analysis: JSON.stringify({
              chart1: { ...chart1, nakshatraName: chart1NakshatraName, rashiName: chart1RashiName },
              chart2: { ...chart2, nakshatraName: chart2NakshatraName, rashiName: chart2RashiName },
            }),
            recommendations: JSON.stringify({ english: recommendations, sinhala: recommendationsSinhala }),
          });
        }

        // Count matched aspects
        const matchedCount = Object.values(porondamScores).filter(s => s.matched).length;
        const totalAspects = Object.keys(porondamScores).length;

        return {
          resultId,
          overallScore,
          matchedCount,
          totalAspects,
          porondamScores,
          recommendations: {
            english: recommendations,
            sinhala: recommendationsSinhala,
          },
          chart1Info: {
            personName: chart1.personName,
            gender: chart1.gender,
            nakshatra: chart1.nakshatra,
            nakshatraName: chart1NakshatraName,
            rashi: chart1.rashi,
            rashiName: chart1RashiName,
          },
          chart2Info: {
            personName: chart2.personName,
            gender: chart2.gender,
            nakshatra: chart2.nakshatra,
            nakshatraName: chart2NakshatraName,
            rashi: chart2.rashi,
            rashiName: chart2RashiName,
          },
          compatibility: overallScore >= 70 ? "Excellent" : overallScore >= 50 ? "Good" : overallScore >= 30 ? "Moderate" : "Challenging",
          compatibilitySinhala: overallScore >= 70 ? "විශිෂ්ට" : overallScore >= 50 ? "හොඳ" : overallScore >= 30 ? "මධ්‍යස්ථ" : "අභියෝගාත්මක",
        };
      }),

    // Get user's matching history
    history: protectedProcedure.query(async ({ ctx }) => {
      return await getRecentMatchesForUser(ctx.user.id, 20);
    }),

    // Get a specific matching result
    getResult: publicProcedure
      .input(z.object({ resultId: z.number() }))
      .query(async ({ input }) => {
        const data = await getMatchingResultWithCharts(input.resultId);
        if (!data) return null;

        return {
          ...data.result,
          chart1: data.chart1,
          chart2: data.chart2,
        };
      }),

    // Delete a matching result
    deleteResult: protectedProcedure
      .input(z.object({ resultId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const result = await getMatchingResultById(input.resultId);
        if (!result || result.userId !== ctx.user.id) {
          throw new Error("Result not found or access denied");
        }
        await deleteMatchingResult(input.resultId);
        return { success: true };
      }),
  }),

  // Reference data for frontend
  reference: router({
    // Get all nakshatras
    nakshatras: publicProcedure.query(() => {
      return NAKSHATRAS.map(n => ({
        id: n.id,
        name: n.name,
        sinhala: n.sinhala,
        lord: n.lord,
        gana: n.gana,
        yoni: n.yoni,
        nadi: n.nadi,
      }));
    }),

    // Get all rashis
    rashis: publicProcedure.query(() => {
      return RASHIS.map(r => ({
        id: r.id,
        name: r.name,
        sinhala: r.sinhala,
        english: r.english,
        lord: r.lord,
      }));
    }),

    // Get educational content about Porondam
    porondamInfo: publicProcedure.query(() => {
      return {
        title: "The 20 Porondam System",
        titleSinhala: "විසි පොරොන්දම් ක්‍රමය",
        description: "Porondam is the traditional Sri Lankan/South Indian system of horoscope matching for marriage compatibility. It examines 20 different aspects of compatibility between two individuals based on their birth charts.",
        descriptionSinhala: "පොරොන්දම යනු විවාහ ගැලපීම සඳහා උපන් කේන්දර පදනම් කරගත් සාම්ප්‍රදායික ශ්‍රී ලාංකික/දකුණු ඉන්දියානු ක්‍රමයයි. එය දෙදෙනෙකුගේ උපන් කේන්දර මත පදනම්ව ගැලපීමේ විවිධ අංශ 20ක් පරීක්ෂා කරයි.",
        aspects: [
          {
            name: "Nakath Porondam",
            nameSinhala: "නැකත් පොරොන්දම",
            description: "Checks compatibility of birth stars (Nakshatra). This is the most important aspect as it determines mental harmony and understanding between partners.",
            descriptionSinhala: "උපන් නැකත් (නක්ෂත්‍ර) ගැලපීම පරීක්ෂා කරයි. මෙය වඩාත්ම වැදගත් අංශය වන අතර එය හවුල්කරුවන් අතර මානසික සමගිය හා අවබෝධය තීරණය කරයි.",
            maxPoints: 3,
          },
          {
            name: "Gana Porondam",
            nameSinhala: "ගණ පොරොන්දම",
            description: "Examines temperament compatibility. People are classified as Deva (divine), Manushya (human), or Rakshasa (demonic) based on their birth star.",
            descriptionSinhala: "ස්වභාව ගැලපීම පරීක්ෂා කරයි. උපන් නැකත මත පදනම්ව මිනිසුන් දේව, මනුෂ්‍ය හෝ රාක්ෂස ලෙස වර්ගීකරණය කරයි.",
            maxPoints: 6,
          },
          {
            name: "Yoni Porondam",
            nameSinhala: "යෝනි පොරොන්දම",
            description: "Assesses physical and intimate compatibility. Each nakshatra is associated with an animal, and compatibility is determined by the relationship between these animals.",
            descriptionSinhala: "ශාරීරික හා සමීප ගැලපීම තක්සේරු කරයි. සෑම නැකතක්ම සතෙකු සමඟ සම්බන්ධ වන අතර, මෙම සතුන් අතර සම්බන්ධතාවය මගින් ගැලපීම තීරණය වේ.",
            maxPoints: 4,
          },
          {
            name: "Nadi Porondam",
            nameSinhala: "නාඩි පොරොන්දම",
            description: "Evaluates health and genetic compatibility. Same Nadi (Vata, Pitta, or Kapha) is considered unfavorable as it may affect progeny.",
            descriptionSinhala: "සෞඛ්‍ය හා ජාන ගැලපීම ඇගයීමට ලක් කරයි. එකම නාඩි (වාත, පිත්ත හෝ කඵ) අහිතකර ලෙස සැලකේ.",
            maxPoints: 8,
          },
          {
            name: "Rashi Porondam",
            nameSinhala: "රාශි පොරොන්දම",
            description: "Checks moon sign compatibility for emotional harmony and mutual understanding.",
            descriptionSinhala: "චිත්තවේගීය සමගිය හා අන්‍යෝන්‍ය අවබෝධය සඳහා චන්ද්‍ර රාශි ගැලපීම පරීක්ෂා කරයි.",
            maxPoints: 7,
          },
          {
            name: "Rajju Porondam",
            nameSinhala: "රජ්ජු පොරොන්දම",
            description: "Examines the physical bond through body parts classification. Same Rajju is considered inauspicious.",
            descriptionSinhala: "ශරීර කොටස් වර්ගීකරණය හරහා ශාරීරික බැඳීම පරීක්ෂා කරයි. එකම රජ්ජු අශුභ ලෙස සැලකේ.",
            maxPoints: 1,
          },
          {
            name: "Vedha Porondam",
            nameSinhala: "වේධ පොරොන්දම",
            description: "Checks for obstructions between certain nakshatra pairs that are considered incompatible.",
            descriptionSinhala: "නොගැලපෙන ලෙස සැලකෙන ඇතැම් නැකත් යුගල අතර බාධා පරීක්ෂා කරයි.",
            maxPoints: 1,
          },
          {
            name: "Mahendra Porondam",
            nameSinhala: "මහේන්ද්‍ර පොරොන්දම",
            description: "Indicates the welfare and health of children from the marriage.",
            descriptionSinhala: "විවාහයෙන් ලැබෙන දරුවන්ගේ සුභසාධනය හා සෞඛ්‍යය පෙන්නුම් කරයි.",
            maxPoints: 1,
          },
        ],
        scoringGuide: {
          excellent: { min: 70, label: "Excellent Match", labelSinhala: "විශිෂ්ට ගැලපීම" },
          good: { min: 50, label: "Good Match", labelSinhala: "හොඳ ගැලපීම" },
          moderate: { min: 30, label: "Moderate Match", labelSinhala: "මධ්‍යස්ථ ගැලපීම" },
          challenging: { min: 0, label: "Challenging Match", labelSinhala: "අභියෝගාත්මක ගැලපීම" },
        },
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
