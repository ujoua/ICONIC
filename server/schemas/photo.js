const mongoose = require('mongoose');

const { Schema } = mongoose;
const photoSchema = new Schema({
    filePath: String,
    artist: String,
    title: String,
    text: String,
    tags: [String],
    earliestDate: Date,
    camera: String,
    materials: [String],
    dimensons: String
});

module.exports = mongoose.model('Photo', photoSchema);