const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

const Technology = mongoose.model('Technology', technologySchema);
module.exports = Technology;
