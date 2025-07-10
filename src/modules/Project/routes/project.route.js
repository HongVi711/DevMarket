const express = require("express");
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../../../shared/middlewares/auth.middleware");
const {upload,uploadToCloudinary} = require("../../../shared/middlewares/upload.middleware");

const router = express.Router();

router.get("/project", projectController.getAllProjects);
router.get('/projects/:slug', projectController.getProjectDetailBySlug);

router.use(authMiddleware.protect, authMiddleware.restrictTo("admin", "user"));
router.post('/create', projectController.createProject);

router.use(authMiddleware.protect);

module.exports = router;
