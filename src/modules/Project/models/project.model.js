const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // thường slug cần unique
  description: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  demoVideoUrl: { type: String }, // optional
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    required: true 
  },
  technologies: [{ type: String, required: true }], // mảng string
  price: { type: Number, required: true },
  discountPrice: { type: Number }, // optional
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublished: { type: Boolean, default: false },
  isBundleItem: { type: Boolean, default: false },
  learningPackId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPack' } // optional, tham chiếu
});

// Tự động cập nhật updatedAt mỗi khi save
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

