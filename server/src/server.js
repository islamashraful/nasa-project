const http = require("http");

require("dotenv").config();

const app = require("./app");
const { mongoConnect } = require("../services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  const PORT = process.env.PORT || 8000;
  http.createServer(app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
