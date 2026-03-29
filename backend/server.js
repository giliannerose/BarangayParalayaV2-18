
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { body, param, query, validationResult } = require("express-validator");

const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");

const s3 = new S3Client({
 region: process.env.AWS_REGION,
 credentials: {
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
 }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WEBP files are allowed"));
    }

    cb(null, true);
  }
});


const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(session({
  secret: "sessionsecret",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

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

// User Schema (Google OAuth users)

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },

  name: String,

  email: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: String,
    default: "admin"
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

//
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/callback"
},
async (accessToken, refreshToken, profile, done) => {

  try {

    const email = profile.emails[0].value;

     const allowedAdmins = [
      "lr.grbaguio@mmdc.mcl.edu.ph",
      "lr.arlegaspi@mmdc.mcl.edu.ph",
      "lr.kdrsantos@mmdc.mcl.edu.ph",
      "mpisonjr@mmdc.mcl.edu.ph"
    ];

     // check if email is allowed
    if (!allowedAdmins.includes(email)) {
      return done(null, false);
    }

    // check if user already exists
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {

      // create new user
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        role: "admin"
      });

    }

    return done(null, user);

  } catch (err) {
    return done(err, null);
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// GOOGLE LOGIN
app.get("/auth/login",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);


// GOOGLE CALLBACK
app.get("/auth/callback",
  passport.authenticate("google", {
  failureRedirect: "/admin-login.html?error=unauthorized"
}),
  async (req, res) => {

    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // redirect to admin dashboard with token
    res.redirect(`/admin/dashboard.html?token=${token}`);

  }
);


// JWT AUTH MIDDLEWARE

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
}

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array()
    });
  }

  next();
}

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}


// CRUD ROUTES

// Announcements // 
// CREATE
app.post("/api/announcements", authenticateToken, async (req, res) => {
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
app.put("/api/announcements/:id", authenticateToken, async (req, res) =>  {
  const updated = await Announcement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
app.delete("/api/announcements/:id", authenticateToken, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Announcement deleted" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});

// External API: Weather (Open-Meteo) - FETCH LIVE DATA
app.get(
  "/api/external/weather",
  [
    query("lat").notEmpty().withMessage("lat is required").isFloat().withMessage("lat must be a valid number"),
    query("lon").notEmpty().withMessage("lon is required").isFloat().withMessage("lon must be a valid number"),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    const { lat, lon } = req.query;

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      `&current=temperature_2m,precipitation,wind_speed_10m` +
      `&timezone=Asia%2FManila`;

    const resp = await fetch(url);

    if (!resp.ok) {
      const error = new Error("External API request failed");
      error.status = 502;
      throw error;
    }

    const data = await resp.json();
    res.json(data);
  })
);

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
app.post("/api/facilities", authenticateToken, async (req, res) => {
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
app.put("/api/facilities/:id", authenticateToken, async (req, res) => {
  const updated = await Facility.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});


//delete facilities
app.delete("/api/facilities/:id", authenticateToken, async (req, res) => {
  await Facility.findByIdAndDelete(req.params.id);
  res.json({ message: "Facility deleted" });
});

//booking CRUD

//create
app.post(
  "/api/bookings",
  [
    body("facilityId").notEmpty().withMessage("facilityId is required"),
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("contactNumber").trim().notEmpty().withMessage("Contact number is required"),
    body("date").trim().notEmpty().withMessage("Date is required"),
    body("time").trim().notEmpty().withMessage("Time is required"),
    body("purpose").trim().notEmpty().withMessage("Purpose is required"),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  })
);

//read
app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find().populate("facilityId");
  res.json(bookings);
});

// UPDATE booking status (approve / reject)
app.put("/api/bookings/:id/status", authenticateToken, async (req, res) => {
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
app.post(
  "/api/projects",
  authenticateToken,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("status")
      .isIn(["ongoing", "completed"])
      .withMessage("Status must be either ongoing or completed"),
    body("progress")
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("Progress must be between 0 and 100"),
    handleValidationErrors
  ],
  asyncHandler(async (req, res) => {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  })
);

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
app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  const updated = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE project
app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
});

//OFFICIALS

// create officials
app.post("/api/officials", authenticateToken, async (req, res) => {
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
app.put("/api/officials/:id", authenticateToken, async (req, res) => {
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
app.delete("/api/officials/:id", authenticateToken, async (req, res) => {
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
app.post("/api/about", authenticateToken, async (req, res) => {
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
app.put("/api/about", authenticateToken, async (req, res) => {
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
app.delete("/api/about", authenticateToken,  async (req, res) => {
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


//file storage

app.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.status = 400;
      throw error;
    }

    const fileName = Date.now() + "-" + req.file.originalname;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    await s3.send(new PutObjectCommand(params));

    const fileUrl =
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.json({
      id: fileName,
      url: fileUrl
    });
  })
);


//
app.get("/files/:id", (req, res) => {

 const fileUrl =
   `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.params.id}`;

 res.redirect(fileUrl);

});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "File too large. Maximum size is 5MB."
      });
    }

    return res.status(400).json({
      message: err.message
    });
  }

  const status = err.status || 500;

  res.status(status).json({
    message: err.message || "Internal Server Error"
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

