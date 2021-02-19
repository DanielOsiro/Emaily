let path = "./config/.env.development";

if (process.env.NODE_ENV === "production") {
  path = "./config/.env.production";
}

require("dotenv").config({ path });
