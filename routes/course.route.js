const express = require("express");
const {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

const router = express.Router();
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
