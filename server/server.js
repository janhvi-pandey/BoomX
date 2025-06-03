const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const videoRoutes=require('./routes/videoRoutes');
const feedRoutes = require("./routes/feedRoutes");

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://clientboom-x.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/feed", feedRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
