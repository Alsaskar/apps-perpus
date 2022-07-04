const express = require('express')
const {add, list, remove, edit, count, listMeminjam} = require('../controllers/buku')
const router = express.Router()

router.post('/add', add)
router.get('/list', list)
router.get('/count', count)
router.get('/list-meminjam', listMeminjam)
router.delete('/delete/:id_buku', remove)
router.put('/edit/:id_buku', edit)

module.exports = router