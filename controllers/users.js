const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
    response.json(users.map(User.format))
})
usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        if (!body.username || !body.password) {
            return response.status(400).json({ error: 'username or password missing'})
        }
        const existingUser = await User.find({ username: body.username })
        if (existingUser.length > 0) {
            return response.status(400).json({ error: 'username must be unique' })
        }
        if (body.password.length < 3) {
            return response.status(400).json({ error: 'password must have at least 3 characters' })
        }
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        if (body.adult === undefined) {
            body.adult = true
        }
        const user = new User({
            username: body.username,
            name: body.name,
            adult: body.adult,
            passwordHash
        })

        const savedUser = await user.save()
        console.log('savedUser', savedUser)
        response.json(User.format(savedUser))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
})

module.exports = usersRouter