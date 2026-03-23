import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { saveDiagnosticResult, getDiagnosticResultsByUser, getDiagnosticResultById, getAllDiagnosticResults, getDiagnosticStats } from "./db";
import { TRPCError } from "@trpc/server";
import {
  calculateBaseType,
  calculateLayer,
  calculatePower,
  calculateShift,
  getTypeName,
  getTypeCode,
  BASE_TYPE_QUESTIONS,
  LAYER_QUESTIONS,
  POWER_QUESTIONS,
  SHIFT_SCENARIOS,
  LAYER_DESCRIPTIONS,
  LAYER_LABELS,
  TYPE_NAME_MATRIX,
} from "@shared/diagnosticData";

// Admin-only procedure: requires admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

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

  diagnostic: router({
    /** Submit full diagnostic answers and compute result */
    submit: protectedProcedure
      .input(z.object({
        baseTypeAnswers: z.record(z.string(), z.string()),
        layerAnswers: z.record(z.string(), z.number()),
        powerAnswers: z.record(z.string(), z.number()),
        shiftAnswers: z.record(z.string(), z.array(z.number())),
      }))
      .mutation(async ({ ctx, input }) => {
        // 1. Calculate Base Type
        const baseResult = calculateBaseType(input.baseTypeAnswers);

        // 2. Calculate Cognitive Layer
        const layerResult = calculateLayer(input.layerAnswers);

        // 3. Calculate Processing Power
        const powerResult = calculatePower(input.powerAnswers);

        // 4. Calculate Dynamic Shift
        const shiftResult = calculateShift(input.shiftAnswers);

        // 5. Derive 80-type
        const typeName = getTypeName(baseResult.type, layerResult.layer);
        const typeCode = getTypeCode(baseResult.type, layerResult.layer);

        // 6. Build dimension scores for radar chart
        const dimensionScores = {
          // MBTI dimension percentages
          E_I: Math.round(baseResult.scores.EI.first / Math.max(baseResult.scores.EI.first + baseResult.scores.EI.second, 1) * 100),
          S_N: Math.round(baseResult.scores.SN.first / Math.max(baseResult.scores.SN.first + baseResult.scores.SN.second, 1) * 100),
          T_F: Math.round(baseResult.scores.TF.first / Math.max(baseResult.scores.TF.first + baseResult.scores.TF.second, 1) * 100),
          J_P: Math.round(baseResult.scores.JP.first / Math.max(baseResult.scores.JP.first + baseResult.scores.JP.second, 1) * 100),
          // Layer distribution
          layerDistribution: layerResult.distribution,
          // Power & Shift
          processingPower: powerResult.score,
          dynamicShift: shiftResult.score,
          adaptability: shiftResult.adaptability,
          // Details
          powerDetails: powerResult.details,
        };

        // 7. Save to DB
        const insertId = await saveDiagnosticResult({
          userId: ctx.user.id,
          baseType: baseResult.type,
          cognitiveLayer: layerResult.layer,
          processingPower: powerResult.score,
          dynamicShift: shiftResult.score,
          typeName,
          typeCode,
          dimensionScores,
          rawAnswers: input,
        });

        return {
          id: insertId,
          baseType: baseResult.type,
          cognitiveLayer: layerResult.layer,
          layerLabel: LAYER_LABELS[layerResult.layer - 1],
          layerDescription: LAYER_DESCRIPTIONS[LAYER_LABELS[layerResult.layer - 1]],
          processingPower: powerResult.score,
          dynamicShift: shiftResult.score,
          typeName,
          typeCode,
          dimensionScores,
        };
      }),

    /** Get user's diagnostic history */
    history: protectedProcedure.query(async ({ ctx }) => {
      return getDiagnosticResultsByUser(ctx.user.id);
    }),

    /** Get a single diagnostic result by ID */
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const result = await getDiagnosticResultById(input.id);
        if (!result || result.userId !== ctx.user.id) {
          return null;
        }
        return {
          ...result,
          layerLabel: LAYER_LABELS[result.cognitiveLayer - 1],
          layerDescription: LAYER_DESCRIPTIONS[LAYER_LABELS[result.cognitiveLayer - 1]],
        };
      }),

    /** Get diagnostic metadata (question counts, etc.) */
    meta: publicProcedure.query(() => ({
      baseTypeQuestionCount: BASE_TYPE_QUESTIONS.length,
      layerQuestionCount: LAYER_QUESTIONS.length,
      powerQuestionCount: POWER_QUESTIONS.length,
      shiftScenarioCount: SHIFT_SCENARIOS.length,
      totalTypes: 80,
      typeMatrix: TYPE_NAME_MATRIX,
    })),
  }),

  admin: router({
    /** Get all diagnostic results with user info (admin only) */
    allResults: adminProcedure
      .input(z.object({
        limit: z.number().min(1).max(500).default(100),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit ?? 100;
        const offset = input?.offset ?? 0;
        return getAllDiagnosticResults(limit, offset);
      }),

    /** Get diagnostic statistics (admin only) */
    stats: adminProcedure.query(async () => {
      return getDiagnosticStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
