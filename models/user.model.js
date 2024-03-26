const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 4 },
})

// לפני כל שמירה באוסף של משתמשים
// נוסיף את פעולת ההצפנה
// this - משתמש ששומרים במסד נתונים
// this-יש לשים לב שחובה לשלוח פונקציה רגילה ולא חץ בגלל השימוש ב
userSchema.pre('save', function (next) {
    // לא נרצה לשמור את הסיסמא במסד נתונים כמו שהיא
    // אלא נשמור סיסמא מוצפנת
    bcrypt.hash(this.password, +process.env.BCRYPT_SALT, async (err, hashPass) => {
        if (err)
            throw new Error(err.message);

        this.password = hashPass;
        next()
    })
})

module.exports.User = mongoose.model('users', userSchema);