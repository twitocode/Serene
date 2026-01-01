import * as authSchema from "./auth-schema";
import * as checkinSchema from "./checkin-schema";
import * as communitySchema from "./community-schema";
import * as usersSchema from "./users-schema";
import * as relations from "../relations";


export * from "./auth-schema";
export * from "./checkin-schema";
export * from "./community-schema";
export * from "./users-schema";

//for better auth
const schema = {
  ...authSchema,
  ...checkinSchema,
  ...communitySchema,
  ...usersSchema,
  // Add all the relations
  ...relations,
};

export default schema;
