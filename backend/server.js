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

  // for API integration later (MS1)
  apiSource: String,
  externalId: String
}, { timestamps: true });

const Announcement = mongoose.model("Announcement", announcementSchema);

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
