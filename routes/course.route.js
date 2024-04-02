const express = require("express");
const { getAllCourses, getCourseById, addCourse, updateCourse, deleteCourse, getCoursesWithUsers } = require("../controllers/course.controller");
const { auth } = require("../middlewares/auth");

const router = express.Router();


router.get("/", getAllCourses);
router.get("/with-users", getCoursesWithUsers);
router.get("/:id", getCourseById);

// נקרא למידלוואר עבור כל בקשה שדורשת הרשאה
router.post("/", auth, addCourse);

router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
