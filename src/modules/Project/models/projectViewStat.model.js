const mongoose = require('mongoose');

const projectViewStatSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  totalViews: { type: Number, required: true, default: 0 },
  totalLikes: { type: Number, required: true, default: 0 },
  totalBookmarks: { type: Number, required: true, default: 0 },
  lastViewedAt: { type: Date, required: true, default: Date.now },
});

const ProjectViewStat = mongoose.model('ProjectViewStat', projectViewStatSchema);

module.exports = ProjectViewStat;
