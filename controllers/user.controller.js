const bcrypt = require('bcrypt');
const { User } = require("../models/user.model");

exports.signIn = async (req, res, next) => {
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
                return res.send({ user });
            }

            // מחזירים תשובה כללית של לא מורשה
            // כי כך מאובטח יותר
            // אחרת המשתמש יוכל להכניס סיסמאות למייל קיים עד שימצא את הסיסמא
            next({ message: 'Auth Failed', status: 401 })
        })
    }

    // החזרת המשתמש + טוקן, אם לא קיים - 401
}

// הרשמה - משתמש חדש
exports.signUp = async (req, res, next) => {
    // קבלת שם, מייל וסיסמא מגוף ההודעה
    const { username, email, password } = req.body;

    // לא נרצה לשמור את הסיסמא במסד נתונים כמו שהיא
    // אלא נשמור סיסמא מוצפנת
    try {
        // שמירת המשתמש בדטהבייס
        const user = new User({ username, email, password });
        await user.save(); // pre קודם כל הולך לפעולת
        // ושם מצפין את הסיסמא

        // אם הצליח להצפין - מנסה להכניס לדטהבייס

        // אם הפרטים שלו חוקיים
        // נבדק ע"י המונגוס

        // החזרת המשתמש
        return res.status(201).json(user);
    } catch (error) {
        return next({ message: error.message, status: 409 })
    }
}