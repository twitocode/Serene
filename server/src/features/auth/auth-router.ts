import { Hono } from "hono";
import { type AuthType, auth } from "./auth";

const app = new Hono<{
  Variables: AuthType;
}>();


export default app;
