import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../../db/db";
import { usersTable } from "../../db/schema/users-schema";
import { authMiddleware } from "../../middleware/auth.middleware";
import { zodValidator } from "../../middleware/zod.validator";
import { RouterVariables } from "../../types";

import {
  stepFiveSchema,
  stepFourSchema,
  stepOneSchema,
  stepThreeSchema,
  stepTwoSchema,
} from "@serene/shared";
import {
  submitStep1,
  submitStep2,
  submitStep3,
  submitStep4,
  submitStep5,
  validateStep,
} from "./onboarding.service";

export const app = new Hono<{
  Variables: RouterVariables;
}>();

app.get("/", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, sessionUser.id),
    columns: {
      onboardingCompleted: true,
      onboardingStep: true,
      onboardingStarted: true,
    },
  });
  if (!user) {
    c.var.logger.error(`User ${sessionUser.email} should exist but does not`);
    throw new HTTPException(500, { message: "User should exist but does not" });
  }

  return c.json({
    step: user.onboardingStep,
    completed: user.onboardingCompleted,
    started: user.onboardingStarted,
  });
});

app.post(
  "/step1",
  authMiddleware,
  zodValidator("json", stepOneSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");

    await validateStep(sessionUser.id, 1);
    await submitStep1(body, sessionUser);
    return c.json({ success: true });
  }
);

app.post(
  "/step2",
  authMiddleware,
  zodValidator("json", stepTwoSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");

    await validateStep(sessionUser.id, 2);
    await submitStep2(body, sessionUser);

    return c.json({ success: true });
  }
);

app.post(
  "/step3",
  authMiddleware,
  zodValidator("json", stepThreeSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");

    await validateStep(sessionUser.id, 3);
    await submitStep3(body, sessionUser);
    return c.json({ success: true });
  }
);

app.post(
  "/step4",
  authMiddleware,
  zodValidator("json", stepFourSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");

    await validateStep(sessionUser.id, 4);
    await submitStep4(body, c.var.logger, sessionUser);

    return c.json({ success: true });
  }
);

app.post(
  "/step5",
  authMiddleware,
  zodValidator("json", stepFiveSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");

    await validateStep(sessionUser.id, 5);
    await submitStep5(sessionUser, body);

    return c.json({ success: true });
  }
);

export default app;
