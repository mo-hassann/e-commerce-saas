import { z } from "zod";

export const stringArrayTransform = z
  .string()
  .or(z.array(z.any()))
  .transform((str, ctx) => {
    try {
      if (Array.isArray(str)) return str;
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not a valid array",
        });
        return z.NEVER;
      }
      return parsed;
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Not a valid JSON string",
      });
      return z.NEVER;
    }
  });
