import * as authSchema from "./auth-schema";
import * as checkinSchema from "./checkin-schema";
import * as communitySchema from "./community-schema";
import * as usersSchema from "./users-schema";

// Export everything individually
export * from "./auth-schema";
export * from "./checkin-schema";
export * from "./community-schema";
export * from "./users-schema";

// Also export as default for better-auth
const schema = {
  ...authSchema,
  ...checkinSchema,
  ...communitySchema,
  ...usersSchema,
};

export default schema;
