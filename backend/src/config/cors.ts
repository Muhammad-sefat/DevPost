import { CorsOptions } from "cors";
import { env } from "./env";

// Both the public web app and the admin app hit this same API,
// so both origins need to be explicitly whitelisted (credentials: true
// requires an exact origin match — you can't use "*").
export const corsOptions: CorsOptions = {
  origin: [env.CLIENT_URL, env.ADMIN_URL],
  credentials: true,
};
