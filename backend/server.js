require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

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


// CRUD ROUTES

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

// Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
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
