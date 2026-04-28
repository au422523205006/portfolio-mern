const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  tech: String,
  description: String,
  github: String,
});

module.exports = mongoose.model("Project", projectSchema);