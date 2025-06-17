const express = require("express");
const bioController = require("../controllers/bio.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/:uri", bioController.getBioByUri);
router.use(authMiddleware.protect);

module.exports = router;
