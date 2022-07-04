const express = require('express')
const {login, loggedIn} = require('../controllers/auth')
const CekToken = require('../middleware/CekToken')
const router = express.Router()

router.post('/login', login)
router.get('/logged-in', CekToken, loggedIn)

module.exports = router;