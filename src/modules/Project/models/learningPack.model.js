const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now, required: true },
}, { _id: false }); // Không cần _id cho mỗi document nhỏ trong mảng

const learningPackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  projectId: { type: String, required: true },
  videoUrls: { type: [String], required: true },
  documents: { type: [documentSchema], required: false, default: [] },
});

const LearningPack = mongoose.model('LearningPack', learningPackSchema);
module.exports = LearningPack;
