import { emailExistsSchema } from "@serene/shared/validation";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zodValidator } from "../../middleware/zod.validator";
import { RouterVariables } from "../../types";
import { doesUserExist, getUserProfile } from "./users.service";

const app = new Hono<{
  Variables: RouterVariables;
}>();

app.get("/me", async (c) => {
  const session = c.get("session");
  const userData = await getUserProfile(session);
  return c.json({
    user: userData,
  });
});

app.get(
  "/exists/:email",
  zodValidator("param", emailExistsSchema),
  async (c) => {
    const email = c.req.param("email");
    if (!email) {
      c.var.logger.info(`User does not exist with email ${email}`);
      throw new HTTPException(403, { message: "User ID not provided" });
    }

    const exists = await doesUserExist(email);
    return c.json({ exists });
  }
);
export default app;
