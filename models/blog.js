const mongoose = require('mongoose')

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

blogSchema.statics.format = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        id: blog._id,
        user: blog.user,
        comments: blog.comments
    }
}

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog