const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("GET /launches", () => {
    it("should respond with 200 status", async () => {
      await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /launches", () => {
    it("should respond with 201 status", async () => {
      const validPostData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-62 f",
        launchDate: "January 4, 2028",
      };
      await request(app).post("/launches").send(validPostData).expect(201);
    });

    it("should return error for required properties", () => {
      const launchData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-62 f",
        launchDate: "January 4, 2028",
      };
      Object.keys(launchData).forEach(async (item) => {
        const invalidLaunchData = {
          ...launchData,
        };
        delete invalidLaunchData[item];
        const response = await request(app)
          .post("/launches")
          .send(invalidLaunchData)
          .expect(400);

        expect(response.body).toStrictEqual({
          error: "Missing required launch property",
        });
      });
    });

    it("should return error of invalid dates", async () => {
      const launchData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-62 f",
        launchDate: "foo",
      };
      const response = await request(app)
        .post("/launches")
        .send(launchData)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });

    it("should match send and returned launch data", async () => {
      const launchData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-62 f",
        launchDate: "January 10, 2025",
      };
      const launchDataWithouDate = {
        ...launchData,
      };
      delete launchDataWithouDate.launchDate;

      const response = await request(app)
        .post("/launches")
        .send(launchData)
        .expect(201);

      expect(response.body).toMatchObject(launchDataWithouDate);

      const requestedDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestedDate);
    });
  });
});
