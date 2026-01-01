import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodSchema } from "zod";
import { z } from "zod";

/**
 * A wrapper for zValidator that throws the original ZodError on failure.
 * This ensures that your global app.onError handler can catch and log
 * validation errors consistently.
 */
export const zodValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      throw result.error;
    }
  });
