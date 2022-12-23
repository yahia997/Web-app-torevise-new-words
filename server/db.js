const mongoose = require('mongoose');

// Words //
const userSchema = new mongoose.Schema({
    word: {type: String, required: true, unique: true},
    translation: {type: String, required: true, unique: false}
}, {
    timestamps: true,
});

const Word = mongoose.model('words', userSchema);

module.exports = { Word };