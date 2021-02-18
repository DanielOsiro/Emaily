// Generate express routes

const fs = require("fs");
const ROUTES_DIR = "./routes";
const ROUTE_APPEND = "Routes.js";

module.exports = (app) => {
  fs.readdir(ROUTES_DIR, (err, files) => {
    files.forEach((file) => {
      if (file.includes(ROUTE_APPEND)) {
        require("./" + file)(app);
      }
    });
  });
};
