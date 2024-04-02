const mongoose = require('mongoose')
const { Course } = require("../models/course.model");

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().select('-__v');
        return res.json(courses);
    } catch (error) {
        next(error);
    }
};

exports.getCourseById = (req, res, next) => {
    const id = req.params.id;
    // Course.findById(id, {categories:false})
    // Course.findById(id, '-categories')

    console.log(mongoose.Types.ObjectId.isValid(id));
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        Course.findById(id, { __v: false })
            .then(c => {
                res.json(c);
            })
            .catch(err => {
                next({ message: 'course not found', status: 404 })
            })
    }
};

exports.getCoursesWithUsers = async (req, res, next) => {
    try {
        const courses = await Course.find()
            // .populate('users') // מחזיר את כל הפרטים מאוסף משתמשים join-על איזה שדה תעשה את ה
            .populate('users', 'username email -_id') // מחזיר את חלק מהפרטים מאוסף משתמשים join-על איזה שדה תעשה את ה
            .select('-__v'); // __v בלי השדה
        // אם הקוד לא קיים באוסף משתמשים - לא יחזרו פרטי האוביקט
        return res.json(courses);
    } catch (error) {
        next(error);
    }
};

exports.addCourse = async (req, res, next) => {
    // console.log(req.body);
    // if (req.body.id) {
    //     next({ message: 'add not allowed' });
    //     // אוטומטית הולך למידלוואר שתופס שגיאות
    //     // עם 4 פרמטרים
    // }
    // else {
    //     return res.json({ message: "add courses" });
    // }

    // req.user - אם הוא משתמש קיים, יש לו את התכונה

    try {
        if (req.user.role === "admin") {
            const c = new Course(req.body);
            await c.save(); // מנסה לשמור במסד נתונים
            return res.status(201).json(c); // כאן יהיו כל הנתונים של האוביקט שנשמר במ"נ
        }
        else {
            next({ message: 'only admin can add course', status: 403 })
        }
    } catch (error) {
        next(error);
    }
};

exports.updateCourse = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    try {
        // const c = await Course.updateOne({ _id: id }, { $set: req.body }, { new: true })
        // return res.json(c); // מוחזר אוביקט עם נתונים טכניים על העדכון, כמה התעדכנו וכו
        const c = await Course.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true } // החזרת האוביקט החדש שהתעדכן
        )
        return res.json(c);
    } catch (error) {
        next(error)
    }
};

exports.deleteCourse = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        try {
            if (!(await Course.findById(id)))
                return next({ message: 'course not found!!!', status: 404 })

            // אם קיים כזה קורס
            await Course.findByIdAndDelete(id)
            return res.status(204).send();
        } catch (error) {
            return next(error)
        }
    }
};