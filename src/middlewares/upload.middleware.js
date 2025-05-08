// uploadMiddleware.js
const multer = require("multer");
const cloudinary = require("../configs/cloudinary");
const { Readable } = require("stream");

// Không lưu file vào disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Hàm chuyển buffer sang stream để upload lên Cloudinary
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {}; // _read là hàm bắt buộc
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: "uploads_DevMarket" }, // Optional: folder trên Cloudinary
    (error, result) => {
      if (error) return res.status(500).json({ error });
      req.cloudinaryUrl = result.secure_url; // Gán URL vào req để dùng sau
      next();
    }
  );

  bufferToStream(req.file.buffer).pipe(stream);
};

module.exports = {
  upload, // dùng trong router như middleware multer
  uploadToCloudinary
};
