import * as authSchema from "./auth-schema"
import * as checkinSchema from "./checkin-schema"
import * as communitySchema from "./community-schema"
import * as usersSchema from "./users-schema"

export default {
  ...authSchema,
  ...checkinSchema,
  ...communitySchema,
  ...usersSchema,
};