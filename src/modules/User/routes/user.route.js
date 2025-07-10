const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../../../shared/middlewares/auth.middleware");
const {upload,uploadToCloudinary} = require("../../../shared/middlewares/upload.middleware");
const router = express.Router();

router.get("/info/:id", userController.getUserById);

router.use(authMiddleware.protect);
router.get("/info", userController.getUserById);
router.get("/:id/bio", userController.getUserWithBioById);
router.use(authMiddleware.protect, authMiddleware.restrictTo("admin", "user"));
router.get("/", userController.getAllUsers);
//router.put("/:id",upload.single("photo"),uploadToCloudinary,userController.updateUserById);

router.put(
  "/:id",
  upload,
  uploadToCloudinary,
  userController.updateUserWithBio
);
router.use(authMiddleware.protect, authMiddleware.restrictTo("admin"));
router.delete("/:id", userController.deleteUserById);

module.exports = router;
