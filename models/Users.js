const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    pfp: {
        type: String,
        required: true,
    },
    coins: {
        type: Number,
    },
    course_progress: {
        type: Array,
    },
    investments: {
        type: Array,
    },
    date: {
        type: Date,
        default: new Date,
    },
})

const Users = mongoose.model('Users', userSchema);

module.exports = Users