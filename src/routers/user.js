const express = require('express')
const User = require('../models/users')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const { forgotPassword } = require('../email/account')
const auth = require('../middleware/auth')

router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.userName, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/forgot/:mail', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.mail })
        if (!user) {
            throw new Error('No user found')
        }
        forgotPassword(req.params.mail)
        res.status(200).send(`Forgot Password mail sent to your mail id - ${req.params.mail}`)
    }
    catch (e) {
        res.status(400).send()
    }
})

router.patch('/forgot/:mail/newPassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.mail })
        if (!user) {
            throw new Error('No user found')
        }
        user.password = req.body.new_password
        await user.save()
        res.send(user)
    }
    catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router