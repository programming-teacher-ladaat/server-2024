const mongoose = require('mongoose');
const { userSchema } = require('./user.model');

// mongo reletionships  - קשרי גומלין
// 1. embedded documents - מסמכים משובצים, כלומר אוביקט בתוך אוביקט
// 2. references - הפניות, יצירת 2 אוספים ואוסף אחד יכיל מפתח זר מהאוסף השני
// SQL דומה ל
// ObjectId אבל לא אוכף שהקוד קיים באוסף אלא רק שהוא מסוג

const lecturerSchema = new mongoose.Schema({
    // _id
    name: { type: String, required: [true, "name is required"] },
    salary: { type: Number, default: 50 }
});

// schema - תבנית של אוביקט בודד
// id, title, lecturer, tags, numLessons
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lecturer: lecturerSchema,
    categories: {
        type: [String],
        validate: {
            validator(v) {
                // v -  המערך
                // true/false - האם הערך תקין
                return v && v.length <= 3;
            },
            message: 'must have most 3 categories'
        }
    },
    numLessons: { type: Number, min: 1, default: 10 },
    // users: [userSchema] // userSchema יוזרס יכיל מערך מסוג
    users: [{ type: mongoose.Types.ObjectId, ref: 'users' }] // ref כדי שנוכל לחבר בין אוספים חובה לכתוב
})

// model = collection
module.exports.Course = mongoose.model('courses', courseSchema);