// uploadMiddleware.js
const multer = require("multer");
const cloudinary = require("../../configs/cloudinary");
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

const uploadToCloudinary = async(req, res, next) => {
  try{
    console.log("req.files:", req.files); // Debug
    if (!req.files || (!req.files.photo && !req.files.backgroundImage)) {
      console.log("No files uploaded");
      return next();
    }

    // Xử lý upload từng file
    const uploadPromises = [];

    // Upload photo nếu có
    if (req.files.photo && req.files.photo[0]) {
      const photoPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads_DevMarket/photo" },
          (error, result) => {
            if (error) return reject(error);
            console.log("Photo upload result:", result); // Debug
            resolve({ key: "cloudinaryUrl", url: result.secure_url });
          }
        );
        bufferToStream(req.files.photo[0].buffer).pipe(stream);
      });
      uploadPromises.push(photoPromise);
    }

    // Upload backgroundImage nếu có
    if (req.files.backgroundImage && req.files.backgroundImage[0]) {
      const backgroundPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads_DevMarket/background" },
          (error, result) => {
            if (error) return reject(error);
            console.log("Background upload result:", result); // Debug
            resolve({ key: "cloudinaryBackgroundUrl", url: result.secure_url });
          }
        );
        bufferToStream(req.files.backgroundImage[0].buffer).pipe(stream);
      });
      uploadPromises.push(backgroundPromise);
    }

    // Chờ tất cả upload hoàn tất
    const results = await Promise.all(uploadPromises);
    console.log("Upload results:", results); // Debug
    // Gán URL vào req
    results.forEach((result) => {
      req[result.key] = result.url;
    });
    console.log("req.cloudinaryUrl:", req.cloudinaryUrl); // Debug
    console.log("req.cloudinaryBackgroundUrl:", req.cloudinaryBackgroundUrl);
    next();
  } catch (error) {
    console.error("Cloudinary error:", error);
    return res.status(500).json({ status: "error", message: "Lỗi khi upload ảnh", error });
  }

};

module.exports = {
  // upload, // dùng trong router như middleware multer
  upload: upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]), // Cấu hình multer để xử lý nhiều trường file
  uploadToCloudinary
};
