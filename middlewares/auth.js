const jwt = require('jsonwebtoken');

// 3. ניצור מידלוואר שיבדןק את הטוקן שמגיע מהלקוח
exports.auth = (req, res, next) => {
    try {
        // console.log(req.cookie);

        // console.log(req.headers); // headers-כך מקבלים את הנתונים שהלקוח שלח ב
        const { authorization } = req.headers; // חילוץ של הטוקן מההידר

        const [, token] = authorization.split(' '); // Bearer כי הטוקן שמתקבל מכיל בהתחלה את המילה
        // console.log('token', token);

        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // מחרוזת סודית שלפיה נוצר הטוקן

        const data = jwt.verify(token, privateKey);
        // console.log('data', data); // הנתונים שמהם נוצר הטוקן
        // עכשיו נותר לבדוק הרשאות

        req.user = data; // הוספת תכונה לבקשה
        next(); // עובר לראוט/מידלוואר

        // next(data) // לא נכון - כי כאן עובר למידלוואר האחרון של השגיאות
    } catch (err) {
        // console.log('err', err);
        next({ message: err, status: 401 })
    }
}