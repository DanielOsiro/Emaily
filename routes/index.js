const fs = require("fs");
const ROUTES_DIR = "./routes";
const ROUTE_APPEND = "Routes.js";

module.exports = async (app) => {
  fs.readdirSync(ROUTES_DIR).forEach((file) => {
    if (file.includes(ROUTE_APPEND)) {
      require("./" + file)(app);
    }
  });
};
