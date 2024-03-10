const mongoose = require('mongoose');

// id, title, lecturer, tags, numLessons
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lecturer: String,
    categories: [String],
    numLessons: { type: Number, min: 1, default: 10 }
})

module.exports.Course = mongoose.model('courses', courseSchema);