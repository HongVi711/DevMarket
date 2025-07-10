const mongoose = require('mongoose');

const bundleItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  bundleId: { type: String, required: true },
  projectId: { type: String, required: true },
});

const BundleItem = mongoose.model('BundleItem', bundleItemSchema);
module.exports = BundleItem;
