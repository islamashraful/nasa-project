const http = require("http");

const app = require("./app");
const { mongoConnect } = require("../services/mongo");
const { loadPlanetsData } = require("./models/planets.model");

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();

  const PORT = process.env.PORT || 8000;
  http.createServer(app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
