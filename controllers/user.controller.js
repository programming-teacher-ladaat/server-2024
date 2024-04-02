const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User, generateToken } = require("../models/user.model");


exports.signIn = async (req, res, next) => {
    // const v = userValidator.loginSchema.validate(req.body);
    // userValidator.loginSchema // פונקציה שבודקת תקינות

    // if (v) {
    // קבלת מייל וסיסמא מגוף ההודעה
    const { email, password } = req.body;

    // חיפוש משתמש עם המייל והסיסמא בדטהבייס
    const user = await User.findOne({ email })

    if (user) {
        // בדיקת סיסמא
        // נשלח את הסיסמא הלא מוצפנת מגוף ההודעה
        // ואת הסיסמא המוצפנת מתוך הדטהבייס
        bcrypt.compare(password, user.password, (err, same) => {
            if (err)
                return next(new Error(err.message));

            if (same) {// האם הסיסמאות שוות
                // delete user.password; // מחיקת הסיסמא ממה שחוזר ללקוח
                const token = generateToken(user);
                // const token = "generateToken(user)";
                user.password = "****";
                return res.send({ user, token });
            }

            // מחזירים תשובה כללית של לא מורשה
            // כי כך מאובטח יותר
            // אחרת המשתמש יוכל להכניס סיסמאות למייל קיים עד שימצא את הסיסמא
            return next({ message: 'Auth Failed', status: 401 })
        })
    }
    else {
        // החזרת המשתמש + טוקן, אם לא קיים - 401
        return next({ message: 'Auth Failed', status: 401 })
    }
    // }
    // else {
    //     // החזרת המשתמש + טוקן, אם לא קיים - 401
    //     return next({ message: 'details not correct', status: 401 })
    // }
}

// הרשמה - משתמש חדש
exports.signUp = async (req, res, next) => {
    // קבלת שם, מייל וסיסמא מגוף ההודעה
    const { username, email, password, courses } = req.body;

    // לא נרצה לשמור את הסיסמא במסד נתונים כמו שהיא
    // אלא נשמור סיסמא מוצפנת
    try {
        // שמירת המשתמש בדטהבייס
        const user = new User({ username, email, password, courses });
        await user.save(); // pre קודם כל הולך לפעולת
        // ושם מצפין את הסיסמא

        // אם הצליח להצפין - מנסה להכניס לדטהבייס

        // אם הפרטים שלו חוקיים
        // נבדק ע"י המונגוס

        // החזרת המשתמש
        const token = generateToken(user);
        // const token = "generateToken(user)";
        user.password = "****";
        // delete user.password; // מחיקת הסיסמא ממה שחוזר ללקוח
        return res.status(201).json({ user, token });
    } catch (error) {
        return next({ message: error.message, status: 409 })
    }
}

// 4. בדיקת ההרשאות
exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const updatedUser = req.body;

    try {

        if (id !== updatedUser._id)
            return next({ message: 'user id conflict', status: 409 });
        // else if (req.user.role === "admin" || req.user.user_id === id) { // גם מנהל יכול לעדכן כל משתמש
        else if (req.user.user_id === id) {
            const u = await User.findByIdAndUpdate(
                id,
                { $set: updatedUser },
                { new: true } // החזרת האוביקט החדש שהתעדכן
            )
            return res.json(u);
        }
        else { // משתמש עם קוד שונה מקוד המשתמש לעדכון
            next({ message: `cannot update user: ${id}, you can update only your details`, status: 403 })
        }
    } catch (error) {
        next(error);
    }
};