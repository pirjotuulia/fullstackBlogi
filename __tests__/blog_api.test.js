const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('../utils/test_helper')

describe('blog api get', async () => {
    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(b => b.save()))
    })

    test('all blogs are returned as json by GET /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body.length).toBe(blogsInDatabase.length)
        const returnedTitles = response.body.map(b => b.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    })
    test('there as many blogs as were added', async () => {
        const response = await api
            .get('/api/blogs')

        expect(response.body.length).toBe(initialBlogs.length)
    })
    test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
        const blogsInDatabase = await blogsInDb()
        const aBlog = blogsInDatabase[0]

        const response = await api
            .get(`/api/blogs/${aBlog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body.title).toBe(aBlog.title)
    })
    test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
        const validNonexistingId = await nonExistingId()
        const response = await api
            .get(`/api/blogs/${validNonexistingId}`)
            .expect(404)
    })
    test('400 returned by GET /api/blogs/:id with invalid id', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
        const response = await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })

    test('the first blog is about React patterns', async () => {
        const response = await api
            .get('/api/blogs')

        expect(response.body[0].title).toBe('React patterns')
    })
})
describe('blog api post', () => {
    test('POST /api/blogs succeeds with valid data', async () => {
        const blogsAtStart = await blogsInDb()
        const blog = new Blog({
            title: 'Testcase for api-post',
            author: 'Test Author',
            url: 'http://www.test.com',
            likes: 0
        })
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAfterOperation = await blogsInDb()
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

        const titles = blogsAfterOperation.map(b => b.title)
        expect(titles).toContain('Testcase for api-post')
    })
    test('POST /api/blogs fails with proper statuscode if content is missing', async () => {
        const blog = new Blog({
            author: 'Test Author',
            url: 'http://www.test.com',
            likes: 0
        })
        const blogsNow = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(blog)
            .expect(400)

        const blogsAfterOperation = await blogsInDb()
        expect(blogsAfterOperation.length).toBe(blogsNow.length)
    })
    test('blog without likes gets 0 likes ', async () => {
        const blog = new Blog({
            author: 'Test Author',
            title: 'Testcase',
            url: 'http://www.test.com'
        })
        const response = await api
            .post('/api/blogs')
            .send(blog)
            .expect(200)
        expect(response.body.likes).toBe(0)
    })
    test('blog without url or title gets 400 ', async () => {
        const blogWithoutUrl = new Blog({
            author: 'Test Author',
            title: 'Testcase'
        })
        const blogWithoutTitle = new Blog({
            author: 'Test Author',
            url: 'http://www.test.com'
        })
        await api
            .post('/api/blogs')
            .send(blogWithoutUrl)
            .expect(400)
        await api
            .post('/api/blogs')
            .send(blogWithoutTitle)
            .expect(400)

    })
    describe('deletion of a blog', async () => {
        let addedBlog
        beforeAll(async () => {
            addedBlog = new Blog({
                author: 'Test Author',
                title: 'DeleteTestCase',
                url: 'http://www.test.com',
                likes: 0
            })
            await addedBlog.save()
        })
        test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
            console.log("id",addedBlog._id)
            const blogsAtStart = await blogsInDb()
            await api
                .delete(`/api/blogs/${addedBlog._id}`)
                .expect(204)
            const blogsAfterOperation = await blogsInDb()
            const titles = blogsAfterOperation.map(b => b.title)
            expect(titles).not.toContain(addedBlog.title)
            expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
        })
    })
    afterAll(() => {
        server.close()
    })
})