const mongoose = require('mongoose');

const { Schema } = mongoose;
const hypeSchema = new Schema({
    pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo' },
}, {collection: "hypes"});

module.exports = mongoose.model('Hype', hypeSchema);