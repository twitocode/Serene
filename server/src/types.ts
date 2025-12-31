import { PinoLogger } from "hono-pino";
import { auth } from "./lib/auth";

export type RouterVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  logger: PinoLogger;
};
