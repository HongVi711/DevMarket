const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now, required: true },
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
