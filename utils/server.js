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
  log("Connected to MongoDB Atlas");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Helper for logging
const log = (message, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data ? JSON.stringify(data) : "");
};

// --- Mongoose Schemas ---
const waterQualitySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  temperature: Number,
  pH: Number,
  doConcentration: Number,
  ammoniaLevel: Number,
  turbidityLevel: Number,
});
const WaterQuality = mongoose.model("WaterQuality", waterQualitySchema);

const feedingSettingsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  isFeeding: { type: Boolean, default: false },
  rotations: { type: Number, default: 6 },
  feedPerRotation: { type: Number, default: 0 },
  feedType: { type: String, default: "" },
  distributionMode: { type: String, default: "" },
  scheduleTimes: { type: [String], default: [] },
});
const FeedingSettings = mongoose.model("FeedingSettings", feedingSettingsSchema);

const feedingStatsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  totalFeedDispensed: { type: Number, default: 0 },
  totalFeedings: { type: Number, default: 0 },
  lastFeedingTime: { type: Date, default: null },
  avgFeedPerFeeding: { type: Number, default: 0 },
});
const FeedingStats = mongoose.model("FeedingStats", feedingStatsSchema);

const weightSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  weight: Number,
});
const Weight = mongoose.model("Weight", weightSchema);

// --- Helper Functions ---
const convertTo12HourFormat = (time24) => {
  if (!time24) return null;
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${period}`;
};

const updateFeedingStats = async () => {
  try {
    const latestSettings = await FeedingSettings.findOne().sort({ timestamp: -1 });
    const { rotations, feedPerRotation } = latestSettings;
    const feedDispensed = rotations * feedPerRotation;

    let stats = await FeedingStats.findOne().sort({ timestamp: -1 });
    if (!stats) {
      stats = new FeedingStats();
    }

    stats.totalFeedings += 1;
    stats.totalFeedDispensed += feedDispensed;
    stats.lastFeedingTime = new Date();
    stats.avgFeedPerFeeding = stats.totalFeedDispensed / stats.totalFeedings;
    stats.timestamp = new Date();

    await stats.save();
    log("Feeding statistics updated successfully.");
  } catch (err) {
    console.error("Error updating feeding stats:", err);
  }
};

// --- API Endpoints ---

// Water Quality Endpoints
app.post("/api/data", async (req, res) => {
  log("[POST] /api/data", req.body);
  try {
    const doc = new WaterQuality({ ...req.body, timestamp: new Date() });
    await doc.save();
    res.json({ message: "Water quality data saved successfully" });
  } catch (err) {
    console.error("[ERROR] /api/data", err);
    res.status(500).json({ message: "Error saving water quality data" });
  }
});

app.get("/api/data/latest", async (req, res) => {
  log("[GET] /api/data/latest");
  try {
    const latest = await WaterQuality.findOne().sort({ timestamp: -1 });
    res.json(latest || {});
  } catch (err) {
    console.error("[ERROR] /api/data/latest", err);
    res.status(500).json({ message: "Error retrieving latest data" });
  }
});

app.get("/api/data", async (req, res) => {
  log("[GET] /api/data");
  try {
    const data = await WaterQuality.find().sort({ timestamp: 1 });
    res.json(data);
  } catch (err) {
    console.error("[ERROR] /api/data", err);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// Weight Sensor Endpoints
app.get("/api/weight", async (req, res) => {
  log("[GET] /api/weight");
  try {
    const latest = await Weight.findOne().sort({ timestamp: -1 });
    if (latest) res.json({ weight: latest.weight });
    else res.status(404).json({ message: "No weight data found" });
  } catch (err) {
    console.error("[ERROR] /api/weight", err);
    res.status(500).json({ message: "Error retrieving weight data" });
  }
});

app.post("/api/weight", async (req, res) => {
  log("[POST] /api/weight", req.body);
  try {
    const doc = new Weight({ ...req.body, timestamp: new Date() });
    await doc.save();
    res.json({ message: "Weight data received and saved successfully" });
  } catch (err) {
    console.error("[ERROR] /api/weight", err);
    res.status(500).json({ message: "Error saving weight data" });
  }
});

// Feeding Settings and Control Endpoints
app.get("/api/rotations", async (req, res) => {
  log("[GET] /api/rotations");
  try {
    const latest = await FeedingSettings.findOne().sort({ timestamp: -1 });
    res.json({ rotations: latest?.rotations ?? 6 });
  } catch (err) {
    console.error("[ERROR] /api/rotations", err);
    res.status(500).json({ message: "Error retrieving rotations" });
  }
});

app.get("/api/feedperrotation", async (req, res) => {
  log("[GET] /api/feedperrotation");
  try {
    const latest = await FeedingSettings.findOne().sort({ timestamp: -1 });
    res.json({ feedPerRotation: latest?.feedPerRotation ?? 0 });
  } catch (err) {
    console.error("[ERROR] /api/feedperrotation", err);
    res.status(500).json({ message: "Error retrieving feed per rotation" });
  }
});

app.get("/api/feedtype", async (req, res) => {
  log("[GET] /api/feedtype");
  try {
    const latest = await FeedingSettings.findOne().sort({ timestamp: -1 });
    res.json({ feedType: latest?.feedType ?? "" });
  } catch (err) {
    console.error("[ERROR] /api/feedtype", err);
    res.status(500).json({ message: "Error retrieving feed type" });
  }
});

app.post("/api/feedtype", async (req, res) => {
  log("[POST] /api/feedtype", req.body);
  try {
    const { feedType } = req.body;
    await FeedingSettings.findOneAndUpdate(
      {},
      { $set: { feedType, timestamp: new Date() } },
      { upsert: true, new: true, sort: { timestamp: -1 } }
    );
    res.json({ message: "Feed type updated successfully" });
  } catch (err) {
    console.error("[ERROR] /api/feedtype", err);
    res.status(500).json({ message: "Error updating feed type" });
  }
});

app.get("/api/distributionmode", async (req, res) => {
  log("[GET] /api/distributionmode");
  try {
    const latest = await FeedingSettings.findOne().sort({ timestamp: -1 });
    res.json({ distributionMode: latest?.distributionMode ?? "" });
  } catch (err) {
    console.error("[ERROR] /api/distributionmode", err);
    res.status(500).json({ message: "Error retrieving distribution mode" });
  }
});

app.post("/api/distributionmode", async (req, res) => {
  log("[POST] /api/distributionmode", req.body);
  try {
    const { distributionMode } = req.body;
    await FeedingSettings.findOneAndUpdate(
      {},
      { $set: { distributionMode, timestamp: new Date() } },
      { upsert: true, new: true, sort: { timestamp: -1 } }
    );
    res.json({ message: "Distribution mode updated successfully" });
  } catch (err) {
    console.error("[ERROR] /api/distributionmode", err);
    res.status(500).json({ message: "Error updating distribution mode" });
  }
});

app.get("/api/feedingtoggle", async (req, res) => {
  log("[GET] /api/feedingtoggle");
  try {
    const latest = await FeedingSettings.findOne().sort({ timestamp: -1 });
    res.json({ isFeeding: latest?.isFeeding ?? false });
  } catch (err) {
    console.error("[ERROR] /api/feedingtoggle", err);
    res.status(500).json({ message: "Error retrieving feeding toggle state" });
  }
});

app.post("/api/feedingtoggle", async (req, res) => {
  log("[POST] /api/feedingtoggle", req.body);
  try {
    const { isFeeding } = req.body;
    await FeedingSettings.findOneAndUpdate(
      {},
      { $set: { isFeeding, timestamp: new Date() } },
      { upsert: true, new: true, sort: { timestamp: -1 } }
    );
    if (isFeeding) {
      await updateFeedingStats();
    }
    res.json({ message: "Feeding toggle state updated successfully" });
  } catch (err) {
    console.error("[ERROR] /api/feedingtoggle", err);
    res.status(500).json({ message: "Error updating feeding toggle state" });
  }
});

app.get("/api/feeding-schedules", async (req, res) => {
  log("[GET] /api/feeding-schedules");
  try {
    const latest = await FeedingSettings.findOne().sort({ timestamp: -1 });
    const schedules = latest?.scheduleTimes ?? [];
    // Return raw 24-hour times to avoid duplication on client
    res.json({ scheduleTimes: schedules });
  } catch (err) {
    console.error("[ERROR] /api/feeding-schedules", err);
    res.status(500).json({ message: "Error retrieving feeding schedules" });
  }
});

app.post("/api/feeding-schedules", async (req, res) => {
  log("[POST] /api/feeding-schedules", req.body);
  try {
    const { scheduleTimes } = req.body;
    await FeedingSettings.findOneAndUpdate(
      {},
      { $set: { scheduleTimes, timestamp: new Date() } },
      { upsert: true, new: true, sort: { timestamp: -1 } }
    );
    res.json({ message: "Feeding schedules updated successfully" });
  } catch (err) {
    console.error("[ERROR] /api/feeding-schedules", err);
    res.status(500).json({ message: "Error updating feeding schedules" });
  }
});

app.post("/api/feeding-settings", async (req, res) => {
  log("[POST] /api/feeding-settings", req.body);
  try {
    const { rotations, feedPerRotation } = req.body;
    const update = {};
    if (rotations !== undefined) update.rotations = rotations;
    if (feedPerRotation !== undefined) update.feedPerRotation = feedPerRotation;
    update.timestamp = new Date();

    if (Object.keys(update).length > 1) {
      await FeedingSettings.findOneAndUpdate(
        {},
        { $set: update },
        { upsert: true, new: true, sort: { timestamp: -1 } }
      );
      res.json({ message: "Feeding settings updated successfully" });
    } else {
      res.status(400).json({ message: "No valid settings provided." });
    }
  } catch (err) {
    console.error("[ERROR] /api/feeding-settings", err);
    res.status(500).json({ message: "Error updating feeding settings" });
  }
});

// Feeding Statistics Endpoint
app.get("/api/feeding-stats", async (req, res) => {
  log("[GET] /api/feeding-stats");
  try {
    const latest = await FeedingStats.findOne().sort({ timestamp: -1 });
    res.json(latest || {});
  } catch (err) {
    console.error("[ERROR] /api/feeding-stats", err);
    res.status(500).json({ message: "Error retrieving feeding stats" });
  }
});

// --- New Import Endpoints ---

// Import feeding settings
app.post("/api/import/feeding-settings", async (req, res) => {
  log("[POST] /api/import/feeding-settings", req.body);
  try {
    const data = req.body;
    if (!data) return res.status(400).json({ message: "No data provided" });

    await FeedingSettings.findOneAndUpdate(
      {},
      { $set: { ...data, timestamp: new Date() } },
      { upsert: true, new: true, sort: { timestamp: -1 } }
    );
    res.json({ message: "Feeding settings imported successfully" });
  } catch (err) {
    console.error("[ERROR] /api/import/feeding-settings", err);
    res.status(500).json({ message: "Error importing feeding settings" });
  }
});

// Import feeding stats
app.post("/api/import/feeding-stats", async (req, res) => {
  log("[POST] /api/import/feeding-stats", req.body);
  try {
    const data = req.body;
    if (!data) return res.status(400).json({ message: "No data provided" });

    await FeedingStats.findOneAndUpdate(
      {},
      { $set: { ...data, timestamp: new Date() } },
      { upsert: true, new: true, sort: { timestamp: -1 } }
    );
    res.json({ message: "Feeding stats imported successfully" });
  } catch (err) {
    console.error("[ERROR] /api/import/feeding-stats", err);
    res.status(500).json({ message: "Error importing feeding stats" });
  }
});

// Import feeding schedules
app.post("/api/import/feeding-schedules", async (req, res) => {
  log("[POST] /api/import/feeding-schedules", req.body);
  try {
    const { scheduleTimes } = req.body;
    if (!scheduleTimes || !Array.isArray(scheduleTimes))
      return res.status(400).json({ message: "Invalid schedule times" });

    await FeedingSettings.findOneAndUpdate(
      {},
      { $set: { scheduleTimes, timestamp: new Date() } },
      { upsert: true, new: true, sort: { timestamp: -1 } }
    );
    res.json({ message: "Feeding schedules imported successfully" });
  } catch (err) {
    console.error("[ERROR] /api/import/feeding-schedules", err);
    res.status(500).json({ message: "Error importing feeding schedules" });
  }
});

// Import water quality data
app.post("/api/import/water-quality", async (req, res) => {
  log("[POST] /api/import/water-quality", req.body);
  try {
    const entries = req.body.entries;
    if (!entries || !Array.isArray(entries)) return res.status(400).json({ message: "Invalid water quality entries" });

    // Insert many entries in bulk
    await WaterQuality.insertMany(
      entries.map((entry) => ({ ...entry, timestamp: new Date(entry.timestamp) || new Date() }))
    );
    res.json({ message: "Water quality data imported successfully" });
  } catch (err) {
    console.error("[ERROR] /api/import/water-quality", err);
    res.status(500).json({ message: "Error importing water quality data" });
  }
});

// Import weight data
app.post("/api/import/weight", async (req, res) => {
  log("[POST] /api/import/weight", req.body);
  try {
    const entries = req.body.entries;
    if (!entries || !Array.isArray(entries)) return res.status(400).json({ message: "Invalid weight entries" });

    await Weight.insertMany(
      entries.map((entry) => ({ ...entry, timestamp: new Date(entry.timestamp) || new Date() }))
    );
    res.json({ message: "Weight data imported successfully" });
  } catch (err) {
    console.error("[ERROR] /api/import/weight", err);
    res.status(500).json({ message: "Error importing weight data" });
  }
});

// --- Sample Data Injection (for testing) ---
async function insertSampleWaterQualityAndWeight() {
  const waterSample = new WaterQuality({
    timestamp: new Date(),
    temperature: 25 + Math.random() * 5,
    pH: 7 + (Math.random() - 0.5),
    doConcentration: 6 + Math.random() * 2,
    ammoniaLevel: 0.1 + Math.random() * 0.5,
    turbidityLevel: 5 + Math.random() * 5,
  });
  log("[Sample] WaterQuality", waterSample.toObject());
  await waterSample.save();

  const weightSample = new Weight({
    timestamp: new Date(),
    weight: Math.floor(Math.random() * 100) + 1,
  });
  log("[Sample] Weight", weightSample.toObject());
  await weightSample.save();
}

async function initializePersistentData() {
  await FeedingSettings.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        timestamp: new Date(),
        isFeeding: false,
        rotations: 6,
        feedPerRotation: 0,
        feedType: "",
        distributionMode: "",
        scheduleTimes: [],
      },
    },
    { upsert: true, new: true, sort: { timestamp: -1 } }
  );

  await FeedingStats.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        timestamp: new Date(),
        totalFeedDispensed: 0,
        totalFeedings: 0,
        lastFeedingTime: null,
        avgFeedPerFeeding: 0,
      },
    },
    { upsert: true, new: true, sort: { timestamp: -1 } }
  );
}

// --- Server Startup ---
const port = 3000;
app.listen(port, "0.0.0.0", async () => {
  log(`Server started on port ${port}`);
  try {
    await initializePersistentData();
    log("[Startup] Persistent data initialized.");
  } catch (err) {
    console.error("[Startup] Error initializing data:", err);
  }

  setInterval(async () => {
    try {
      await insertSampleWaterQualityAndWeight();
      log("[Interval] Sample data inserted for water quality and weight.");
    } catch (err) {
      console.error("[Interval] Error inserting sample data:", err);
    }
  }, 5000);
});

// --- Data Export Endpoint ---
app.get("/api/export", async (req, res) => {
  log("[GET] /api/export");
  try {
    const waterQuality = await WaterQuality.find().sort({ timestamp: 1 });
    const feedingSettings = await FeedingSettings.find().sort({ timestamp: 1 });
    const feedingStats = await FeedingStats.find().sort({ timestamp: 1 });
    const weight = await Weight.find().sort({ timestamp: 1 });

    res.json({
      water_quality_data: waterQuality,
      feeding_settings_logs: feedingSettings,
      feeding_stats_logs: feedingStats,
      weight_logs: weight,
    });
  } catch (err) {
    console.error("[ERROR] /api/export", err);
    res.status(500).json({ message: "Error exporting data", error: err.message });
  }
});
