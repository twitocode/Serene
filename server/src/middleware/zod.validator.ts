import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodSchema } from "zod";
import { z } from "zod";

/**
 * A wrapper for zValidator that throws an HTTPException on failure.
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
      if (result.error instanceof z.ZodError) {
        const validationErrors = result.error.flatten().fieldErrors;
        throw new HTTPException(422, {
          message: "Validation Failed",
          cause: validationErrors,
        });
      }
    }
  });
