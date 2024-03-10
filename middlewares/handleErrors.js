// כאשר לא מצאנו ניתוב מסוים, נשלח שגיאה 404 דף לא נמצא
exports.pageNotFound = (req, res, next) => {
    const error = new Error(`the page is Not Found`);
    error.status = 404;
    next(error); // אוטומטית נשלח למידלוואר שתופס שגיאות
    // כי שלחנו פרמטר
}

// מידלוואר כללי לתפיסת שגיאות
// מקבל 4 פרמטרים
// הפרמטר הראשון הוא השגיאה שנשלחה לו ממידלוואר אחר
// המידלוואר האחרון שכל השגיאות ילכו אליו
// כדי שכל השגיאות יהיו מאותו פורמט
exports.serverNotFound = (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
}
