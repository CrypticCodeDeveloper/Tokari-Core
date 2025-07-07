const express = require("express");
const router = express.Router();
const jwtAuthMiddleware = require("../Middlewares/jwtAuthMiddlware");
const {
  createProject,
  getProjectById,
  getAllProjects,
  deleteProjectById,
  getProjectStats
} = require("../controllers/projectController");

// Create a project
router.post("/", jwtAuthMiddleware, createProject);
router.get("/general-stats", jwtAuthMiddleware, getProjectStats);

// Get all projects
router.get("/", jwtAuthMiddleware, getAllProjects);

// Get project by id
router.get("/:id", jwtAuthMiddleware, getProjectById);

// Delete project by id
router.delete("/:id", jwtAuthMiddleware, deleteProjectById);

// Update project by id

// Get all projects assigned to a particular user

module.exports = router;
