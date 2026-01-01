import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends HTTPException {
  public readonly code: string;
  constructor(status: ContentfulStatusCode, message: string, code: string = "APP_ERROR") {
    super(status, { message });
    this.code = code;
  }
}
