const mongoose = require('mongoose');

const { Schema } = mongoose;
const photoSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId, // 이렇게 하면 Mongoose가 자동으로 _id를 생성하지 않고, 네가 직접 _id 값을 넣어줘야만 저장이 가능해. Mongoose는 기본적으로 모든 Document에 _id를 자동 생성해주니까, 굳이 스키마에 _id를 정의할 필요가 없어. 즉, 스키마를 이렇게 바꾸면 돼:
    filePath: String,
    artist: String,
    title: String,
    text: String,
    tags: [String],
    earliestDate: Date,
    camera: String,
    materials: [String],
    dimensons: String
}, {collection: "photos"});

module.exports = mongoose.model('Photo', photoSchema);