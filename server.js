const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://razojhames8:TubigDSTF25@cluster0.2atsy.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0"
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

//gawa schemas at models para sa bawat collection
const waterQualitySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  temperature: Number,
  pH: Number,
  tds: Number,
  doConcentration: Number,
  ammoniaLevel: Number,
  turbidityLevel: Number,
});
const WaterQuality = mongoose.model("WaterQuality", waterQualitySchema);

const feedingSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  isFeeding: Boolean,
  rotations: Number,
  feedType: String, 
  distributionMode: String, 
});
const Feeding = mongoose.model("Feeding", feedingSchema);

const feedingToggleSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  isFeeding: Boolean,
});
const FeedingToggle = mongoose.model("FeedingToggle", feedingToggleSchema);

const algaeControlSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  interval: Number,
});
const AlgaeControl = mongoose.model("AlgaeControl", algaeControlSchema);

const weightSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  weight: Number,
});
const Weight = mongoose.model("Weight", weightSchema);

const transducerToggleSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  isTransducerOn: Boolean,
});
const TransducerToggle = mongoose.model("TransducerToggle", transducerToggleSchema);

// --- WATER QUALITY ENDPOINTS --- tralalero tralala

app.post("/api/data", async (req, res) => {
  try {
    const doc = new WaterQuality({ ...req.body, timestamp: new Date() });
    await doc.save();
    res.json({ message: "Data saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving data" });
  }
});

app.get("/api/data/latest", async (req, res) => {
  try {
    const latest = await WaterQuality.findOne().sort({ timestamp: -1 });
    res.json(latest || {});
  } catch (err) {
    res.status(500).json({ message: "Error retrieving latest data" });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const data = await WaterQuality.find().sort({ timestamp: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving data" });
  }
});

app.post("/api/data/sample", async (req, res) => {
  try {
    const sample = new WaterQuality({
      timestamp: new Date(),
      temperature: 25 + Math.random() * 5,
      pH: 7 + (Math.random() - 0.5),
      tds: 300 + Math.random() * 100,
      doConcentration: 6 + Math.random() * 2,
      ammoniaLevel: 0.1 + Math.random() * 0.5,
      turbidityLevel: 5 + Math.random() * 5,
    });
    await sample.save();
    res.json({ message: "Sample data saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving sample data" });
  }
});

// --- WEIGHT ENDPOINTS --- tung tung tung sahur

app.get("/api/weight", async (req, res) => {
  try {
    const latest = await Weight.findOne().sort({ timestamp: -1 });
    if (latest) res.json({ weight: latest.weight });
    else res.status(404).json({ message: "No weight data found" });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving weight data" });
  }
});

app.post("/api/weight", async (req, res) => {
  try {
    const doc = new Weight({ ...req.body, timestamp: new Date() });
    await doc.save();
    res.json({ message: "Weight data received and saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving weight data" });
  }
});

// --- FEEDING ENDPOINTS --- ballerina cappucina

app.post("/api/update-rotations", async (req, res) => {
  try {
    const { rotations, feedType, distributionMode } = req.body;
    const now = new Date();
    let feeding = await Feeding.findOne().sort({ timestamp: -1 });
    if (!feeding) {
      feeding = new Feeding({ timestamp: now, rotations, feedType, distributionMode });
    } else {
      feeding.rotations = rotations;
      feeding.timestamp = now;
      if (feedType !== undefined) feeding.feedType = feedType;
      if (distributionMode !== undefined) feeding.distributionMode = distributionMode;
    }
    await feeding.save();
    res.json({ message: "Rotations (and feed options) updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating rotations" });
  }
});

app.post("/api/update-feeding-state", async (req, res) => {
  try {
    const { isFeeding } = req.body;
    const now = new Date();
    let feeding = await Feeding.findOne().sort({ timestamp: -1 });
    if (!feeding) {
      feeding = new Feeding({ timestamp: now, isFeeding });
    } else {
      feeding.isFeeding = isFeeding;
      feeding.timestamp = now;
    }
    await feeding.save();
    res.json({ message: "Feeding state updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating feeding state" });
  }
});

app.get("/api/rotations", async (req, res) => {
  try {
    const latest = await Feeding.findOne().sort({ timestamp: -1 });
    res.json({ rotations: latest?.rotations ?? 6 });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving rotations" });
  }
});

app.get("/api/feedtype", async (req, res) => {
  try {
    const latest = await Feeding.findOne().sort({ timestamp: -1 });
    res.json({ feedType: latest?.feedType ?? "" });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving feed type" });
  }
});

app.post("/api/feedtype", async (req, res) => {
  try {
    const { feedType } = req.body;
    const now = new Date();
    let feeding = await Feeding.findOne().sort({ timestamp: -1 });
    if (!feeding) {
      feeding = new Feeding({ timestamp: now, feedType });
    } else {
      feeding.feedType = feedType;
      feeding.timestamp = now;
    }
    await feeding.save();
    res.json({ message: "Feed type updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating feed type" });
  }
});

app.get("/api/distributionmode", async (req, res) => {
  try {
    const latest = await Feeding.findOne().sort({ timestamp: -1 });
    res.json({ distributionMode: latest?.distributionMode ?? "" });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving distribution mode" });
  }
});

app.post("/api/distributionmode", async (req, res) => {
  try {
    const { distributionMode } = req.body;
    const now = new Date();
    let feeding = await Feeding.findOne().sort({ timestamp: -1 });
    if (!feeding) {
      feeding = new Feeding({ timestamp: now, distributionMode });
    } else {
      feeding.distributionMode = distributionMode;
      feeding.timestamp = now;
    }
    await feeding.save();
    res.json({ message: "Distribution mode updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating distribution mode" });
  }
});

// --- FEEDING TOGGLE ENDPOINTS ---

app.get("/api/feedingtoggle", async (req, res) => {
  try {
    const latest = await FeedingToggle.findOne().sort({ timestamp: -1 });
    res.json({ isFeeding: latest?.isFeeding ?? false });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving feeding toggle state" });
  }
});

app.post("/api/feedingtoggle", async (req, res) => {
  try {
    const { isFeeding } = req.body;
    const doc = new FeedingToggle({ isFeeding, timestamp: new Date() });
    await doc.save();
    res.json({ message: "Feeding toggle state updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating feeding toggle state" });
  }
});

// --- ALGAE CONTROL ENDPOINTS ---

app.post("/api/update-interval", async (req, res) => {
  try {
    const { interval } = req.body;
    const now = new Date();
    let algae = await AlgaeControl.findOne().sort({ timestamp: -1 });
    if (!algae) {
      algae = new AlgaeControl({ timestamp: now, interval });
    } else {
      algae.interval = interval;
      algae.timestamp = now;
    }
    await algae.save();
    res.json({ message: "Interval updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating interval" });
  }
});

// --- ALGAE CONTROL INTERVAL ENDPOINTS ---

app.get("/api/interval", async (req, res) => {
  try {
    const latest = await AlgaeControl.findOne().sort({ timestamp: -1 });
    res.json({ interval: latest?.interval ?? 0 });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving interval" });
  }
});

app.post("/api/interval", async (req, res) => {
  try {
    const { interval } = req.body;
    const now = new Date();
    let algae = await AlgaeControl.findOne().sort({ timestamp: -1 });
    if (!algae) {
      algae = new AlgaeControl({ timestamp: now, interval });
    } else {
      algae.interval = interval;
      algae.timestamp = now;
    }
    await algae.save();
    res.json({ message: "Interval updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating interval" });
  }
});

// --- TRANSDUCER ENDPOINTS ---

app.post("/api/update-transducer-state", async (req, res) => {
  try {
    const { isTransducerOn } = req.body;
    const now = new Date();
    let transducer = await TransducerToggle.findOne().sort({ timestamp: -1 });
    if (!transducer) {
      transducer = new TransducerToggle({ timestamp: now, isTransducerOn });
    } else {
      transducer.isTransducerOn = isTransducerOn;
      transducer.timestamp = now;
    }
    await transducer.save();
    res.json({ message: "Transducer state updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating transducer state" });
  }
});

// --- TRANSDUCER STATE ENDPOINTS ---

app.get("/api/transducer-state", async (req, res) => {
  try {
    const latest = await TransducerToggle.findOne().sort({ timestamp: -1 });
    res.json({ isTransducerOn: latest?.isTransducerOn ?? false });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving transducer state" });
  }
});

app.post("/api/transducer-state", async (req, res) => {
  try {
    const { isTransducerOn } = req.body;
    const now = new Date();
    let transducer = await TransducerToggle.findOne().sort({ timestamp: -1 });
    if (!transducer) {
      transducer = new TransducerToggle({ timestamp: now, isTransducerOn });
    } else {
      transducer.isTransducerOn = isTransducerOn;
      transducer.timestamp = now;
    }
    await transducer.save();
    res.json({ message: "Transducer state updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating transducer state" });
  }
});

// --- SAMPLE DATA FOR ALL COLLECTIONS --- temporary lang to kasi wala pang actual data collection

async function insertSampleDataAll() {
  // WaterQuality sample
  const waterSample = new WaterQuality({
    timestamp: new Date(),
    temperature: 25 + Math.random() * 5,
    pH: 7 + (Math.random() - 0.5),
    tds: 300 + Math.random() * 100,
    doConcentration: 6 + Math.random() * 2,
    ammoniaLevel: 0.1 + Math.random() * 0.5,
    turbidityLevel: 5 + Math.random() * 5,
  });
  console.log("[Sample] WaterQuality:", waterSample.toObject());
  await waterSample.save();

  const weightSample = new Weight({
    timestamp: new Date(),
    weight: Math.floor(Math.random() * 100) + 1,
  });
  console.log("[Sample] Weight:", weightSample.toObject());
  await weightSample.save();
}

app.post("/api/sample/all", async (req, res) => {
  try {
    await insertSampleDataAll();
    res.json({ message: "Sample data added to all collections" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding sample data to all collections" });
  }
});

app.get("/api/sample/all", async (req, res) => {
  try {
    await insertSampleDataAll();
    res.json({ message: "Sample data added to all collections (GET)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding sample data to all collections (GET)" });
  }
});

// --- SERVER START ---
const port = 3000;
app.listen(port, "0.0.0.0", async () => {
  console.log(`Server started on port ${port}`);
  try {
    await insertSampleDataAll();
    console.log("[Startup] Sample data inserted into all collections.");
  } catch (err) {
    console.error("[Startup] Error inserting sample data:", err);
  }
  setInterval(async () => {
    try {
      await insertSampleDataAll();
      console.log("[Interval] Sample data inserted into all collections.");
    } catch (err) {
      console.error("[Interval] Error inserting sample data:", err);
    }
  }, 3000);
});

app.get("/api/export", async (req, res) => {
  try {
    const waterQuality = await WaterQuality.find().sort({ timestamp: 1 });
    const feeding = await Feeding.find().sort({ timestamp: 1 });
    const feedingToggle = await FeedingToggle.find().sort({ timestamp: 1 });
    const algaeControl = await AlgaeControl.find().sort({ timestamp: 1 });
    const weight = await Weight.find().sort({ timestamp: 1 });
    const transducerToggle = await TransducerToggle.find().sort({ timestamp: 1 });

    res.json({
      water_quality_data: waterQuality,
      feeding_logs: feeding,
      feeding_toggle_logs: feedingToggle,
      algae_control_logs: algaeControl,
      weight_logs: weight,
      transducer_toggle_logs: transducerToggle
    });
  } catch (err) {
    res.status(500).json({ message: "Error exporting data", error: err.message });
  }
});