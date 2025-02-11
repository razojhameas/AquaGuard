const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the WaterQuality schema
const waterQualitySchema = new mongoose.Schema({
  timestamp: Date,
  temperature: Number,
  pH: Number,
  tds: Number,
  doConcentration: Number,
  ammoniaLevel: Number,
  nitrateLevel: Number,
});

// Create the WaterQuality model
const WaterQuality = mongoose.model("WaterQuality", waterQualitySchema);

// Define the Feeding schema
const feedingSchema = new mongoose.Schema({
  timestamp: Date,
  isFeeding: Boolean,
});

// Create the Feeding model
const Feeding = mongoose.model("Feeding", feedingSchema);

// Define the AlgaeControl schema
const algaeControlSchema = new mongoose.Schema({
  timestamp: Date,
  interval: Number,
});

// Create the AlgaeControl model
const AlgaeControl = mongoose.model("AlgaeControl", algaeControlSchema);

// Use bodyParser to parse JSON requests
app.use(bodyParser.json());

// API endpoint to receive data from Arduino
app.post("/api/data", (req, res) => {
  const { temperature, pH, tds, doConcentration, ammoniaLevel, nitrateLevel } =
    req.body;
  const now = new Date();

  // Create a new WaterQuality document
  const waterQualityData = new WaterQuality({
    timestamp: now,
    temperature,
    pH,
    tds,
    doConcentration,
    ammoniaLevel,
    nitrateLevel,
  });

  // Save the document to the database
  waterQualityData.save((err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error saving data" });
    } else {
      res.send({ message: "Data saved successfully" });
    }
  });
});

app.post("/api/weight", (req, res) => {
  const { weight } = req.body;
  const now = new Date();
  const weightData = { timestamp: now, weight };
  res.send({ message: "Weight data received successfully" });
  // You can also store the weight data in a database or perform other actions here
});

//API endpoint to retrieve temperature data
app.get("/api/data/temperature", (req, res) => {
  WaterQuality.find()
    .select("timestamp temperature")
    .sort({ timestamp: -1 })
    .exec((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Error retrieving temperature data" });
      } else {
        res.send(data);
      }
    });
});

// API endpoint to retrieve pH data
app.get("/api/data/pH", (req, res) => {
  WaterQuality.find()
    .select("timestamp pH")
    .sort({ timestamp: -1 })
    .exec((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Error retrieving pH data" });
      } else {
        res.send(data);
      }
    });
});

// API endpoint to retrieve TDS data
app.get("/api/data/tds", (req, res) => {
  WaterQuality.find()
    .select("timestamp tds")
    .sort({ timestamp: -1 })
    .exec((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Error retrieving TDS data" });
      } else {
        res.send(data);
      }
    });
});

// API endpoint to retrieve DO concentration data
app.get("/api/data/do", (req, res) => {
  WaterQuality.find()
    .select("timestamp doConcentration")
    .sort({ timestamp: -1 })
    .exec((err, data) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Error retrieving DO concentration data" });
      } else {
        res.send(data);
      }
    });
});

// API endpoint to retrieve ammonia level data
app.get("/api/data/ammonia", (req, res) => {
  WaterQuality.find()
    .select("timestamp ammoniaLevel")
    .sort({ timestamp: -1 })
    .exec((err, data) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Error retrieving ammonia level data" });
      } else {
        res.send(data);
      }
    });
});

// API endpoint to retrieve nitrate level data
app.get("/api/data/nitrate", (req, res) => {
  WaterQuality.find()
    .select("timestamp nitrateLevel")
    .sort({ timestamp: -1 })
    .exec((err, data) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Error retrieving nitrate level data" });
      } else {
        res.send(data);
      }
    });
});

app.post("/api/start-feeding", (req, res) => {
  // Forward the request to the Arduino to start feeding
  axios
    .post("http://arduino-ip-address/start-feeding")
    .then((response) => {
      // Update the Feeding model in the database
      const feedingData = new Feeding({
        timestamp: new Date(),
        isFeeding: true,
      });
      feedingData.save((err, doc) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Error starting feeding" });
        } else {
          res.send({ message: "Feeding started successfully" });
        }
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error starting feeding" });
    });
});

app.post("/api/stop-feeding", (req, res) => {
  // Forward the request to the Arduino to stop feeding
  axios
    .post("http://arduino-ip-address/stop-feeding")
    .then((response) => {
      // Update the Feeding model in the database
      const feedingData = new Feeding({
        timestamp: new Date(),
        isFeeding: false,
      });
      feedingData.save((err, doc) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Error stopping feeding" });
        } else {
          res.send({ message: "Feeding stopped successfully" });
        }
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error stopping feeding" });
    });
});

app.post("/api/set-interval", (req, res) => {
  const { interval } = req.body;
  const now = new Date();
  const algaeControlData = new AlgaeControl({
    timestamp: now,
    interval,
  });

  algaeControlData.save((err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error setting interval" });
    } else {
      // Forward the request to the Arduino to set the interval
      axios
        .post("http://arduino-ip-address/set-interval", { interval })
        .then((response) => {
          res.send({ message: "Interval set successfully" });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send({ message: "Error setting interval" });
        });
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
