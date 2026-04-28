const express = require("express");
const Project = require("../models/Project");
const checkAuth = require("../middleware/auth"); // ✅ import

const router = express.Router();


// 🔓 GET all projects (public)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔐 ADD project (protected)
router.post("/", checkAuth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔐 UPDATE project (protected)
router.put("/:id", checkAuth, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔐 DELETE project (protected)
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;