const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    owner_name: {
        type: String
    },
    image: {
        type: Buffer
    }
}, {
    timestamps: true
})

const Posts = mongoose.model('Posts', postSchema)

module.exports = Posts
