const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  bookmarkedAt: { type: Date, default: Date.now, required: true },
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;
