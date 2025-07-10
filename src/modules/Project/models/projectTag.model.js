const mongoose = require('mongoose');

const projectTagSchema = new mongoose.Schema({
  // id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

const ProjectTag = mongoose.model('ProjectTag', projectTagSchema);

module.exports = ProjectTag;
