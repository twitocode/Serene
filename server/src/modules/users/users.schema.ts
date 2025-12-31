import z from "zod";

export const emailExistsSchema = z.object({
  email: z.email("Not an email"),
});
