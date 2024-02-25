const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.rlqur99.mongodb.net/nasaapp?retryWrites=true&w=majority`;
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  const PORT = process.env.PORT || 8000;
  http.createServer(app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
