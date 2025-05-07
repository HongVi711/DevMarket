const express = require("express");
const roleController = require("../controllers/role.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.use(authMiddleware.protect, authMiddleware.restrictTo("admin"));
router.post("/", roleController.createRole);
router.delete("/:name", roleController.deleteRole);

router.use(authMiddleware.protect, authMiddleware.restrictTo("admin", "user"));
router.get("/", roleController.getAllRoles);
router.get("/:name", roleController.getRoleByName);
router.patch("/:name", roleController.updateRole);

module.exports = router;
