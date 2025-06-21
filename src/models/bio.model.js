const { default: mongoose } = require("mongoose");

const bioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    Uri: {
      type: String,
      required: true,
      unique: true,
      sparse: true
    }, // Unique and sparse index | Phải viết thường
    backgroundImage: String,
    address: {
      street: String,
      ward: String,
      district: String,
      city: String,
      country: String
    },
    about: String,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    birthday: Date,
    website: String,
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      github: String
    },
    interests: [String],
    skills: [String]
  },
  { timestamps: true }
);

// Auto generate Uri from user's displayName if not provided
bioSchema.pre("validate", async function (next) {
  if (!this.Uri) {
    // Nếu bạn đã populate user thì có thể dùng user.userName hoặc displayName
    const User = mongoose.model("User");
    const user = await User.findById(this.user);

    if (user && user.userName) {
      this.Uri = user.userName.toLowerCase();
    } else {
      this.Uri = user._id.toString();
    }
  }
  next();
});

module.exports = mongoose.model("Bio", bioSchema);
