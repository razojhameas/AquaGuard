// --- Node.js Express Server (server.js) ---
// This file would be part of your existing Node.js application.

// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors

// Initialize Express app
const app = express();
app.use(express.json()); // Use express.json() for parsing JSON bodies
app.use(cors()); // Enable CORS

// --- MongoDB Connection ---
const mongoUri = "mongodb+srv://razojhames8:TubigDSTF25@cluster0.2atsy.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUri)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Connection Event Handlers (optional, for logging)
mongoose.connection.on("connected", () => {
    console.log("Mongoose default connection open to " + mongoUri);
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose default connection disconnected");
});

// --- Define Mongoose Schemas and Models ---
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

// --- WATER QUALITY ENDPOINTS ---

// POST: Insert new water quality data (from Arduino)
app.post("/api/data", async (req, res) => {
    try {
        const doc = new WaterQuality({ ...req.body, timestamp: new Date() });
        await doc.save();
        res.json({ message: "Data saved successfully" });
    } catch (err) {
        console.error("Error saving water quality data:", err);
        res.status(500).json({ message: "Error saving data", error: err.message });
    }
});

// GET: Latest water quality sample
app.get("/api/data/latest", async (req, res) => {
    try {
        const latest = await WaterQuality.findOne().sort({ timestamp: -1 });
        res.json(latest || {});
    } catch (err) {
        console.error("Error retrieving latest water quality data:", err);
        res.status(500).json({ message: "Error retrieving latest data", error: err.message });
    }
});

// GET: All water quality data (for history/graphs)
app.get("/api/data", async (req, res) => {
    try {
        const data = await WaterQuality.find().sort({ timestamp: 1 });
        res.json(data);
    } catch (err) {
        console.error("Error retrieving all water quality data:", err);
        res.status(500).json({ message: "Error retrieving data", error: err.message });
    }
});

// POST: Insert random sample data (for testing)
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
        console.error("Error saving sample water quality data:", err);
        res.status(500).json({ message: "Error saving sample data", error: err.message });
    }
});

// --- WEIGHT ENDPOINTS ---

// GET: Latest weight
app.get("/api/weight", async (req, res) => {
    try {
        const latest = await Weight.findOne().sort({ timestamp: -1 });
        if (latest) res.json({ weight: latest.weight });
        else res.status(404).json({ message: "No weight data found" });
    } catch (err) {
        console.error("Error retrieving weight data:", err);
        res.status(500).json({ message: "Error retrieving weight data", error: err.message });
    }
});

// POST: Insert new weight
app.post("/api/weight", async (req, res) => {
    try {
        const doc = new Weight({ ...req.body, timestamp: new Date() });
        await doc.save();
        res.json({ message: "Weight data received and saved successfully" });
    } catch (err) {
        console.error("Error saving weight data:", err);
        res.status(500).json({ message: "Error saving weight data", error: err.message });
    }
});

// --- FEEDING ENDPOINTS ---

// POST: Update rotations (now also accepts feedType and distributionMode)
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
        console.error("Error updating rotations:", err);
        res.status(500).json({ message: "Error updating rotations", error: err.message });
    }
});

// POST: Update feeding state (Note: this route seems redundant with /api/feedingtoggle but kept for existing code)
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
        console.error("Error updating feeding state:", err);
        res.status(500).json({ message: "Error updating feeding state", error: err.message });
    }
});

// GET: Get current rotations value
app.get("/api/rotations", async (req, res) => {
    try {
        const latest = await Feeding.findOne().sort({ timestamp: -1 });
        res.json({ rotations: latest?.rotations ?? 6 });
    } catch (err) {
        console.error("Error retrieving rotations:", err);
        res.status(500).json({ message: "Error retrieving rotations", error: err.message });
    }
});

// GET: Get current feed type
app.get("/api/feedtype", async (req, res) => {
    try {
        const latest = await Feeding.findOne().sort({ timestamp: -1 });
        res.json({ feedType: latest?.feedType ?? "" });
    } catch (err) {
        console.error("Error retrieving feed type:", err);
        res.status(500).json({ message: "Error retrieving feed type", error: err.message });
    }
});

// POST: Set feed type
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
        console.error("Error updating feed type:", err);
        res.status(500).json({ message: "Error updating feed type", error: err.message });
    }
});

// GET: Get current distribution mode
app.get("/api/distributionmode", async (req, res) => {
    try {
        const latest = await Feeding.findOne().sort({ timestamp: -1 });
        res.json({ distributionMode: latest?.distributionMode ?? "" });
    } catch (err) {
        console.error("Error retrieving distribution mode:", err);
        res.status(500).json({ message: "Error retrieving distribution mode", error: err.message });
    }
});

// POST: Set distribution mode
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
        console.error("Error updating distribution mode:", err);
        res.status(500).json({ message: "Error updating distribution mode", error: err.message });
    }
});

// --- FEEDING TOGGLE ENDPOINTS ---

// GET: Get current feeding toggle state
app.get("/api/feedingtoggle", async (req, res) => {
    try {
        const latest = await FeedingToggle.findOne().sort({ timestamp: -1 });
        res.json({ isFeeding: latest?.isFeeding ?? false });
    } catch (err) {
        console.error("Error retrieving feeding toggle state:", err);
        res.status(500).json({ message: "Error retrieving feeding toggle state", error: err.message });
    }
});

// POST: Set feeding toggle state
app.post("/api/feedingtoggle", async (req, res) => {
    try {
        const { isFeeding } = req.body;
        // Find the latest feeding toggle document and update it, or create a new one
        let feedingToggle = await FeedingToggle.findOne().sort({ timestamp: -1 });
        if (!feedingToggle) {
            feedingToggle = new FeedingToggle({ isFeeding, timestamp: new Date() });
        } else {
            feedingToggle.isFeeding = isFeeding;
            feedingToggle.timestamp = new Date();
        }
        await feedingToggle.save();
        res.json({ message: "Feeding toggle state updated successfully" });
    } catch (err) {
        console.error("Error updating feeding toggle state:", err);
        res.status(500).json({ message: "Error updating feeding toggle state", error: err.message });
    }
});

// --- ALGAE CONTROL ENDPOINTS ---

// POST: Update interval (Note: this route seems redundant with /api/interval but kept for existing code)
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
        console.error("Error updating interval:", err);
        res.status(500).json({ message: "Error updating interval", error: err.message });
    }
});

// --- ALGAE CONTROL INTERVAL ENDPOINTS ---

// GET: Get current interval value
app.get("/api/interval", async (req, res) => {
    try {
        const latest = await AlgaeControl.findOne().sort({ timestamp: -1 });
        res.json({ interval: latest?.interval ?? 0 });
    } catch (err) {
        console.error("Error retrieving interval:", err);
        res.status(500).json({ message: "Error retrieving interval", error: err.message });
    }
});

// POST: Set interval value
app.post("/api/interval", async (req, res) => {
    try {
        const { interval } = req.body;
        const now = new Date();
        // Find the latest AlgaeControl document and update it, or create a new one
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
        console.error("Error updating interval:", err);
        res.status(500).json({ message: "Error updating interval", error: err.message });
    }
});

// --- TRANSDUCER ENDPOINTS ---

// POST: Update transducer state (Note: this route seems redundant with /api/transducer-state but kept for existing code)
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
        console.error("Error updating transducer state:", err);
        res.status(500).json({ message: "Error updating transducer state", error: err.message });
    }
});

// --- TRANSDUCER STATE ENDPOINTS ---

// GET: Get current transducer state
app.get("/api/transducer-state", async (req, res) => {
    try {
        const latest = await TransducerToggle.findOne().sort({ timestamp: -1 });
        res.json({ isTransducerOn: latest?.isTransducerOn ?? false });
    } catch (err) {
        console.error("Error retrieving transducer state:", err);
        res.status(500).json({ message: "Error retrieving transducer state", error: err.message });
    }
});

// POST: Set transducer state
app.post("/api/transducer-state", async (req, res) => {
    try {
        const { isTransducerOn } = req.body;
        const now = new Date();
        // Find the latest TransducerToggle document and update it, or create a new one
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
        console.error("Error updating transducer state:", err);
        res.status(500).json({ message: "Error updating transducer state", error: err.message });
    }
});


// --- SAMPLE DATA FOR ALL COLLECTIONS ---

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

    // Weight sample
    const weightSample = new Weight({
        timestamp: new Date(),
        weight: Math.floor(Math.random() * 100) + 1,
    });
    console.log("[Sample] Weight:", weightSample.toObject());
    await weightSample.save();

    // Feeding (rotations) sample
    // Ensure `isFeeding`, `feedType`, `distributionMode` are present for Feeding schema
    const feedingSample = new Feeding({
        timestamp: new Date(),
        rotations: Math.floor(Math.random() * 10) + 1,
        isFeeding: Math.random() > 0.5,
        feedType: (Math.random() > 0.5 ? "Flakes" : "Pellets"),
        distributionMode: (Math.random() > 0.5 ? "Manual" : "Auto"),
    });
    console.log("[Sample] Feeding:", feedingSample.toObject());
    await feedingSample.save();

    // FeedingToggle sample
    const feedingToggleSample = new FeedingToggle({
        timestamp: new Date(),
        isFeeding: Math.random() > 0.5,
    });
    console.log("[Sample] FeedingToggle:", feedingToggleSample.toObject());
    await feedingToggleSample.save();

    // AlgaeControl sample
    const algaeControlSample = new AlgaeControl({
        timestamp: new Date(),
        interval: Math.floor(Math.random() * 24) + 1, // 1-24 hour interval
    });
    console.log("[Sample] AlgaeControl:", algaeControlSample.toObject());
    await algaeControlSample.save();

    // TransducerToggle sample
    const transducerToggleSample = new TransducerToggle({
        timestamp: new Date(),
        isTransducerOn: Math.random() > 0.5,
    });
    console.log("[Sample] TransducerToggle:", transducerToggleSample.toObject());
    await transducerToggleSample.save();
}

app.post("/api/sample/all", async (req, res) => {
    try {
        await insertSampleDataAll();
        res.json({ message: "Sample data added to all collections" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding sample data to all collections", error: err.message });
    }
});

app.get("/api/sample/all", async (req, res) => {
    try {
        await insertSampleDataAll();
        res.json({ message: "Sample data added to all collections (GET)" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding sample data to all collections (GET)", error: err.message });
    }
});

// --- SERVER START ---
const port = 3000;
app.listen(port, "0.0.0.0", async () => {
    console.log(`Server started on port ${port}`);
    // Insert sample data on startup
    try {
        await insertSampleDataAll();
        console.log("[Startup] Sample data inserted into all collections.");
    } catch (err) {
        console.error("[Startup] Error inserting sample data:", err);
    }
    // Insert sample data every 3 seconds for real-time testing
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
