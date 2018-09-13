const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = blogs.map(blog => blog.likes)
    return likes.reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
    let likes = blogs.map(blog => blog.likes)
    let most = Math.max(...likes)
    return blogs.find(blog => blog.likes === most)
}

const mostBlogs = (blogs) => {
    let authors = blogs.map(blog => blog.author)
    let authorsWithMostBlogs = []
    for (let author of authors) {
        let addBlog = authorsWithMostBlogs.find(a => a.author === author)
        if (!addBlog) {
            addBlog = { 'author': author, 'blogs': 0 }
            authorsWithMostBlogs.push(addBlog)
        }
        addBlog.blogs++
    }
    let mostBlogsAuthor = authorsWithMostBlogs[0]
    for (let author of authorsWithMostBlogs) {
        if (author.blogs > mostBlogsAuthor.blogs) {
            mostBlogsAuthor = author
        }
    }
    return mostBlogsAuthor
}

const mostLikes = (blogs) => {
    let authorsWithMostLikes = []
    for (let blog of blogs) {
        let addBlog = authorsWithMostLikes.find(a => a.author === blog.author)
        if (!addBlog) {
            addBlog = { 'author': blog.author, 'likes': 0 }
            authorsWithMostLikes.push(addBlog)
        }
        addBlog.likes += blog.likes
    }
    let mostLikesAuthor = authorsWithMostLikes[0]
    for (let blog of authorsWithMostLikes) {
        if (blog.likes > mostLikesAuthor.likes) {
            mostLikesAuthor = { 'author': blog.author, 'likes': blog.likes }
        }
    }
    return mostLikesAuthor
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}