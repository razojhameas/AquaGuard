const mongoose = require("mongoose");

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
  console.error("error:", err);
});

//bagpmg collection sa mongo
const waterQualitySchema = new mongoose.Schema({
  timestamp: Date,
  temperature: Number,
  pH: Number,
  tds: Number,
  doConcentration: Number,
  ammoniaLevel: Number,
  nitrateLevel: Number,
});

const WaterQuality = mongoose.model("WaterQuality", waterQualitySchema);

const weightSchema = new mongoose.Schema({
  timestamp: Date,
  weight: Number,
});

const Weight = mongoose.model("Weight", weightSchema);

let counter = 0;

async function addSampleData() {
  try {
    const newData = {
      timestamp: new Date(),
      temperature: Math.random() * 10 + 25,
      pH: Math.random() * 1 + 7,
      tds: Math.random() * 10 + 150,
      doConcentration: Math.random() * 1 + 6,
      ammoniaLevel: Math.random() * 1 + 0.5,
      nitrateLevel: Math.random() * 1 + 5,
    };

    await WaterQuality.create(newData);
    console.log("New water quality data added successfully!");
    console.log(newData);

    // Add weight data
    const weightData = {
      timestamp: new Date(),
      weight: Math.random() * 10 + 50, // random weight between 50 and 60
    };

    await Weight.create(weightData);
    console.log("New weight data added successfully!");
    console.log(weightData);

    counter++;

    if (counter < 20) {
      setTimeout(addSampleData, 2000);
    }
  } catch (err) {
    console.error("Error adding sample data:", err);
  }
}

addSampleData();
