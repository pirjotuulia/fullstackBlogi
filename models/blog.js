const mongoose = require('mongoose')

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.statics.format = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        id: blog._id,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
}

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog