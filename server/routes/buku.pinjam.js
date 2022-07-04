const express = require('express')
const {add, list, count, listPeminjam, reminder} = require('../controllers/buku.pinjam')
const router = express.Router()

router.post('/add', add)
router.get('/list', list)
router.get('/count', count)
router.post('/reminder', reminder)
router.get('/list-peminjam/:id_anggota', listPeminjam)

module.exports = router