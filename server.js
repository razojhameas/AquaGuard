const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://razojhames8:QTQUOaIOPR3TrA1W@cluster0.2atsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("konekted to mongodb - gumana na omg letsgo what  a skibid");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

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
  rotations: Number, // Add this field
});

const Feeding = mongoose.model("Feeding", feedingSchema);

// Define the AlgaeControl schema
const algaeControlSchema = new mongoose.Schema({
  timestamp: Date,
  interval: Number,
});

// Create the AlgaeControl model
const AlgaeControl = mongoose.model("AlgaeControl", algaeControlSchema);

// Define the Weight schema
const weightSchema = new mongoose.Schema({
  timestamp: Date,
  weight: Number,
});

// Create the Weight model
const Weight = mongoose.model("Weight", weightSchema);

// Define the TransducerToggle schema
const transducerToggleSchema = new mongoose.Schema({
  timestamp: Date,
  isTransducerOn: Boolean,
});

// Create the TransducerToggle model
const TransducerToggle = mongoose.model(
  "TransducerToggle",
  transducerToggleSchema
);

// Use bodyParser to parse JSON requests
app.use(bodyParser.json());

app.use(cors()); // Add this line

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

  const transducerToggleSchema = new mongoose.Schema({
    timestamp: Date,
    isTransducerOn: Boolean,
  });

  const TransducerToggle = mongoose.model(
    "TransducerToggle",
    transducerToggleSchema
  );

  // Save the document to the database
  waterQualityData.save((err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error saving data" });
    } else {
      res.header("Content-Type", "application/json");
      res.send({ message: "Data saved successfully" });
    }
  });
});

// API endpoint to retrieve weight data
app.get("/api/weight", (req, res) => {
  Weight.findOne()
    .sort({ timestamp: -1 })
    .then((data) => {
      if (data) {
        res.json({ weight: data.weight }); // Return the weight value in JSON format
      } else {
        res.status(404).send({ message: "No weight data found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error retrieving weight data" });
    });
});

app.post("/api/weight", async (req, res) => {
  try {
    const { weight } = req.body;
    const now = new Date();

    // Create a new Weight document
    const weightData = new Weight({
      timestamp: now,
      weight,
    });

    // Save the document to the database
    await weightData.save();
    res.header("Content-Type", "application/json");
    res.send({ message: "Weight data received and saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error saving weight data" });
  }
});

app.get("/api/data", (req, res) => {
  WaterQuality.find()
    .then((data) => {
      res.header("Content-Type", "application/json");
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error retrieving data" });
    });
});

app.post("/api/update-rotations", async (req, res) => {
  try {
    const { rotations } = req.body;
    const now = new Date();

    // Update the Feeding document with the new rotations value
    const feeding = await Feeding.findOne().sort({ timestamp: -1 });
    if (!feeding) {
      // If no document is found, create a new one
      const newFeeding = new Feeding({
        timestamp: now,
        rotations,
      });
      await newFeeding.save();
    } else {
      feeding.rotations = rotations;
      await feeding.save();
    }

    res.header("Content-Type", "application/json");
    res.send({ message: "Rotations updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating rotations" });
  }
});

app.post("/api/update-feeding-state", async (req, res) => {
  try {
    const { isFeeding } = req.body;
    const now = new Date();

    // Update the Feeding document with the new feeding state
    const feeding = await Feeding.findOne().sort({ timestamp: -1 });
    if (!feeding) {
      // If no document is found, create a new one
      const newFeeding = new Feeding({
        timestamp: now,
        isFeeding,
      });
      await newFeeding.save();
    } else {
      feeding.isFeeding = isFeeding;
      await feeding.save();
    }

    res.header("Content-Type", "application/json");
    res.send({ message: "Feeding state updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating feeding state" });
  }
});

app.post("/api/update-interval", async (req, res) => {
  try {
    const { interval } = req.body;
    const now = new Date();

    // Update the AlgaeControl document with the new interval value
    const algaeControl = await AlgaeControl.findOne().sort({ timestamp: -1 });
    if (!algaeControl) {
      // If no document is found, create a new one
      const newAlgaeControl = new AlgaeControl({
        timestamp: now,
        interval,
      });
      await newAlgaeControl.save();
    } else {
      algaeControl.interval = interval;
      await algaeControl.save();
    }

    res.header("Content-Type", "application/json");
    res.send({ message: "Interval updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating interval" });
  }
});

app.post("/api/update-transducer-state", async (req, res) => {
  try {
    const { isTransducerOn } = req.body;
    const now = new Date();

    // Update the TransducerToggle document with the new transducer state
    const transducerToggle = await TransducerToggle.findOne().sort({
      timestamp: -1,
    });
    if (!transducerToggle) {
      // If no document is found, create a new one
      const newTransducerToggle = new TransducerToggle({
        timestamp: now,
        isTransducerOn,
      });
      await newTransducerToggle.save();
    } else {
      transducerToggle.isTransducerOn = isTransducerOn;
      await transducerToggle.save();
    }

    res.header("Content-Type", "application/json");
    res.send({ message: "Transducer state updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating transducer state" });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
