const express = require('express')
const crypto = require('crypto')
const Users = require('../models/Users')
const jwt = require('jsonwebtoken')
const { isAuthenticated, hasRole } = require('../auth/index')

const router = express.Router()

const signToken = (_id) => {
    return jwt.sign({ _id }, 'mi-secreto', {
        expiresIn: 60 * 60 * 24 * 365
    })
}

router.post('/register', (req, res) => {
    const { email, password } = req.body
    Users.findOne({ email }).exec()
        .then(user => {
            if (user) return res.send({ message: 'El usuario ya existe' })

            crypto.randomBytes(16, (err, salt) => {
                const newSalt = salt.toString('base64')
                crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (err, encryptedPassword) => {
                    const newPassword = encryptedPassword.toString('base64')
                    Users.create({
                        email,
                        password: newPassword,
                        address: req.body.address,
                        phone: req.body.phone,
                        salt: newSalt
                    }).then(() => res.send({ message: 'Usuario creado con éxito' }))
                })
            })
        })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    Users.findOne({ email }).exec()
        .then(user => {
            if (!user) return res.send({ token: null, message: 'Usuario y/o contraseña incorrectos...' })
            
            crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (err, encryptedPassword) => {
                if (user.password !== encryptedPassword.toString('base64')) return res.send({ token: null, message: 'Usuario y/o contraseña incorrectos...' })

                const token = signToken(user._id)
                return res.send({ token })
            })
        }
        )
})

router.get('/me', isAuthenticated, (req, res) => {
    res.send({
        email: req.user.email,
        role: req.user.role
    })
})

module.exports = router