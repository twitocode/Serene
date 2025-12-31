import { Hono } from "hono";
import { RouterVariables } from "../../types";

const app = new Hono<{
  Variables: RouterVariables;
}>();


export default app;
