require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error("MongoDB error:", err));

//  Announcement Schema 
// API-READY
const announcementSchema = new mongoose.Schema({
  title: String,
  text: String,
  details: String,
  month: String,
  date: String,
  cat: String,
  postedBy: String,
  img: String,

  // for API integration  (MS1)
  apiSource: String,
  externalId: String
}, { timestamps: true });

const Announcement = mongoose.model("Announcement", announcementSchema);

// Schema

// Facility Schema (MS1)
const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, enum: ["indoor", "outdoor"] },
  capacity: Number,
  operatingHours: String,
  managedBy: String,
  features: [String],
  image: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Facility = mongoose.model("Facility", facilitySchema);

// Booking Schema (MS1)
const bookingSchema = new mongoose.Schema({
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facility",
    required: true
  },
  fullName: String,
  email: String,
  contactNumber: String,
  date: String,
  time: String,
  purpose: String,
  status: { type: String, default: "pending" }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

// Projects Schema 
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["ongoing", "completed"],
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  image: String, 
  startDate: String, 
  endDate: String,
  budget: String,
  location: String,
  ledBy: String,
  impact: String,
  year: String 
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

// Officials Schema 
const officialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  term: String,
  description: String,
  advocacy: String,
  contactInfo: String,
  image: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Official = mongoose.model("Official", officialSchema);

//About Schema
const aboutSchema = new mongoose.Schema({
  aboutText: String,
  vision: String,
  mission: String,

  goals: [String],

  emergencyContacts: {
    barangayHall: String,
    police: String,
    fire: String,
    healthCenter: String,
    rescue: String,
    emergencyMedical: String
  },

  officeInfo: {
    address: String,
    email: String,
    phone: String,
    officeHours: String
  }
}, { timestamps: true });

const About = mongoose.model("About", aboutSchema);

// Weather Snapshot Schema (MS API Integration)
const weatherSnapshotSchema = new mongoose.Schema({
  location: String,
  latitude: Number,
  longitude: Number,
  temperature: Number,
  windSpeed: Number,
  precipitation: Number,
  fetchedAt: Date,
  apiSource: String
}, { timestamps: true });

const WeatherSnapshot = mongoose.model("WeatherSnapshot", weatherSnapshotSchema);



// CRUD ROUTES

// Announcements // 
// CREATE
app.post("/api/announcements", async (req, res) => {
  try {
    const created = await Announcement.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ (all)
app.get("/api/announcements", async (req, res) => {
  const data = await Announcement.find().sort({ createdAt: -1 });
  res.json(data);
});

// UPDATE
app.put("/api/announcements/:id", async (req, res) => {
  const updated = await Announcement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
app.delete("/api/announcements/:id", async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Announcement deleted" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});

// External API: Weather (Open-Meteo) - FETCH LIVE DATA
app.get("/api/external/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      `&current=temperature_2m,precipitation,wind_speed_10m` +
      `&timezone=Asia%2FManila`;

    const resp = await fetch(url);
    if (!resp.ok) {
      return res.status(502).json({ error: "External API request failed" });
    }

    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Weather Snapshots CRUD (save API data to DB)
app.post("/api/weather-snapshots", async (req, res) => {
  try {
    const created = await WeatherSnapshot.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/weather-snapshots", async (req, res) => {
  const list = await WeatherSnapshot.find().sort({ createdAt: -1 });
  res.json(list);
});

app.delete("/api/weather-snapshots/:id", async (req, res) => {
  await WeatherSnapshot.findByIdAndDelete(req.params.id);
  res.json({ message: "Snapshot deleted" });
});



// Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// facilities CRUD
//create facilities
app.post("/api/facilities", async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json(facility);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//get facilities
app.get("/api/facilities", async (req, res) => {
  const facilities = await Facility.find({ isActive: true });
  res.json(facilities);
});

//update facilities
app.put("/api/facilities/:id", async (req, res) => {
  const updated = await Facility.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});


//delete facilities
app.delete("/api/facilities/:id", async (req, res) => {
  await Facility.findByIdAndDelete(req.params.id);
  res.json({ message: "Facility deleted" });
});

//booking CRUD

//create
app.post("/api/bookings", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//read
app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find().populate("facilityId");
  res.json(bookings);
});

// UPDATE booking status (approve / reject)
app.put("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Projects CRUD
// CREATE project
app.post("/api/projects", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all projects
app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

// READ single project
app.get("/api/projects/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
});

// UPDATE project
app.put("/api/projects/:id", async (req, res) => {
  const updated = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE project
app.delete("/api/projects/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
});

//OFFICIALS

// create officials
app.post("/api/officials", async (req, res) => {
  try {
    const official = await Official.create(req.body);
    res.status(201).json(official);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//read all officials
app.get("/api/officials", async (req, res) => {
  const officials = await Official.find().sort({ order: 1 });
  res.json(officials);
});


// read single officials
app.get("/api/officials/:id", async (req, res) => {
  const official = await Official.findById(req.params.id);
  res.json(official);
});

//update officials
app.put("/api/officials/:id", async (req, res) => {
  try {
    const updated = await Official.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Official not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//delete officials
app.delete("/api/officials/:id", async (req, res) => {
  await Official.findByIdAndDelete(req.params.id);
  res.json({ message: "Official deleted" });
});

//About - Get

app.get("/api/about", async (req, res) => {
  try {
    const about = await About.findOne();

    // If no About document exists yet
    if (!about) {
      return res.status(404).json({ message: "About content not found" });
    }

    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ABOUT PAGE - CREATE 
app.post("/api/about", async (req, res) => {
  try {
    // Prevent creating multiple About documents
    const existing = await About.findOne();
    if (existing) {
      return res.status(400).json({
        message: "About content already exists. Use PUT to update."
      });
    }

    const created = await About.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ABOUT PAGE - UPDATE
app.put("/api/about", async (req, res) => {
  try {
    const updated = await About.findOneAndUpdate(
      {},
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "About content not found. Create it first."
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ABOUT PAGE - DELETE 
app.delete("/api/about", async (req, res) => {
  try {
    const deleted = await About.findOneAndDelete();

    if (!deleted) {
      return res.status(404).json({
        message: "No About content to delete"
      });
    }

    res.json({ message: "About content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});