const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  upload,
  uploadToCloudinary
} = require("../middlewares/upload.middleware");
const router = express.Router();

router.use(authMiddleware.protect, authMiddleware.restrictTo("admin", "user"));
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put(
  "/:id",
  upload.single("photo"),
  uploadToCloudinary,
  userController.updateUserById
);

router.use(authMiddleware.protect, authMiddleware.restrictTo("admin"));
router.delete("/:id", userController.deleteUserById);

module.exports = router;
