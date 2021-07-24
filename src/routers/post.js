const express = require('express')
const Posts = require('../models/post')
const auth = require('../middleware/auth')
const router = new express.Router()
const User = require('../models/users')
const multer = require('multer')
const sharp = require('sharp')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please Upload jpg , jpeg , png file only'))
        }

        cb(undefined, true)
    }
})

router.post('/posts', auth, upload.single('avatar'), async (req, res) => {
    // const task = new Task(req.body)
    if (!req.file) {
        let buffer = null
        const post = new Posts({
            ...req.body,
            owner: req.user._id,
            owner_name: req.user.name,
            image: buffer
        })

        try {
            await post.save()
            post.image = undefined
            res.status(201).send(post)
        } catch (e) {
            res.status(400).send(e)
        }
    }
    else {
        let buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        const post = new Posts({
            ...req.body,
            owner: req.user._id,
            owner_name: req.user.name,
            image: buffer
        })

        try {
            await post.save()
            post.image = undefined
            res.status(201).send(post)
        } catch (e) {
            res.status(400).send(e)
        }
    }

})

router.get('/posts/:id/image', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)

        if (!post || !post.image) {
            throw new Error('No avatar found')
        }
        res.set('Content-Type', 'image/png')
        res.send(post.image)
    } catch (e) {
        res.status(404).send()
    }
})


router.get('/posts', auth, async (req, res) => {
    try {
        // Alternative
        let posts1 = []
        const posts = await Posts.find({ owner: req.user._id })
        posts.forEach((post) => {
            post.image = undefined
            posts1 = [...posts1, post]
        })
        res.send(posts1)
    }
    catch (e) {
        res.status(404).send()
    }
})

router.get('/Allposts', async (req, res) => {
    try {
        let posts1 = []
        const posts = await Posts.find({})
        posts.forEach((post) => {
            post.image = undefined
            posts1 = [...posts1, post]
        })
        res.send(posts1)
    } catch (e) {
        res.status(404).send()
    }
})

router.patch('/posts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['text', 'likes', 'comments']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update' })
    }
    try {
        const post = await Posts.findOne({ _id: req.params.id, owner: req.user._id })
        if (!post) {
            return res.status(404).send()
        }
        updates.forEach((update) => post[update] = req.body[update])
        await post.save()
        post.image = undefined
        res.send(post)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/posts/:id', auth, async (req, res) => {
    try {
        const post = await Posts.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!post) {
            return res.status(404).send()
        }
        res.send(post)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router