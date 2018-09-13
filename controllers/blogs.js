const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
    response.json(blogs.map(b => Blog.format(b)))

})

blogsRouter.get('/:id', async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(Blog.format(blog))
        } else {
            response.status(404).send({ message: 'not found' })
        }
    } catch (exception) {
        // console.log(exception)
        response.status(400).send({ error: 'invalid id' })
    }
})

blogsRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        if (body.title === undefined || body.url === undefined) {
            return response.status(400).json({ error: 'title or author missing' })
        }
        const blog = new Blog(request.body)
        if (blog.likes === undefined) {
            blog.likes = 0
        }
        const savedBlog = await blog.save()
        response.json(Blog.format(savedBlog))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog
            .findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        response.status(400).send({ error: 'malformatted id' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    try {
        const updatedBlog = await Blog
            .findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(Blog.format(updatedBlog))
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter
