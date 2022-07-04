const express = require('express')
const {add, count, list, listAll} = require('../controllers/buku.pengembalian')
const router = express.Router()

router.post('/add', add)
router.get('/count', count)
router.get('/list-all', listAll)
router.get('/list/:id_anggota', list)

module.exports = router