const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


// 🔐 LOGIN ROUTE (IMPORTANT)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  console.log("LOGIN HIT:", username, password); // 👈 debug

  if (username === "admin" && password === "1234") {
    res.json({ success: true, token: "secret123" });
  } else {
    res.status(401).json({ success: false });
  }
});


// routes
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);


// test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});