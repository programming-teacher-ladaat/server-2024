const bcrypt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// ניצור סכמה חדשה עם הנתונים הדרושים מתוך סכמת הקורס
const minimalCourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    numLessons: { type: Number, min: 1, default: 10 },
})

const userSchema = new mongoose.Schema({
    // _id: נוסף אוטומטית
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true/*, get(v) { return v.toUpperCase() }*/ },
    password: { type: String, required: true, minlength: [4, 'password length < 4'] },
    courses: [minimalCourseSchema],
    role: { type: String, default: 'user', enum: ['admin', 'user'] }
})

// לפני כל שמירה באוסף של משתמשים
// נוסיף את פעולת ההצפנה
// this - משתמש ששומרים במסד נתונים
// this-יש לשים לב שחובה לשלוח פונקציה רגילה ולא חץ בגלל השימוש ב
userSchema.pre('save', function (next) {
    // לא נרצה לשמור את הסיסמא במסד נתונים כמו שהיא
    // אלא נשמור סיסמא מוצפנת
    const salt = process.env.BCRYPT_SALT;
    bcrypt.hash(this.password, salt, async (err, hashPass) => {
        if (err)
            throw new Error(err.message);

        this.password = hashPass;
        next()
    })
});

module.exports.userSchema = userSchema;
module.exports.User = mongoose.model('users', userSchema);

// joi בדיקות תקינות עם
// יתרונות
// 1. בדיקות מורכבות
// 2. לפני השמירה במסד נתונים
// 3. אפשר ליצור כמה סוגים של בדיקות
module.exports.userValidator = {
    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(10).required()
    }),
    newSchema: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email(),
        password: Joi.string().min(4).max(10)
    }),
}

// 1.
// יצירת הטוקן
module.exports.generateToken = (user) => {
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // מחרוזת סודית שלפיה נוצר הטוקן
    const data = { role: user.role, user_id: user._id }; // הנתונים שרלוונטיים עבור הרשאות משתמש
    const token = jwt.sign(data, privateKey, { expiresIn: '1h' }); // יצירת הטוקן + תפוגה
    return token;
}