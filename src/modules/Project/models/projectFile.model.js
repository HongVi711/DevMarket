const mongoose = require('mongoose');

const projectFileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  fileUrl: { type: String, required: true },
  version: { type: String, required: true },
  changelog: { type: String, required: true },
  uploadedAt: { type: Date, required: true, default: Date.now },
});

const ProjectFile = mongoose.model('ProjectFile', projectFileSchema);

module.exports = ProjectFile;
