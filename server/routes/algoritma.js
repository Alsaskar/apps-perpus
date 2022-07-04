const express = require('express')
const { algoNilai } = require('../controllers/algoritma')
const router = express.Router()

router.post('/', algoNilai)

module.exports = router;