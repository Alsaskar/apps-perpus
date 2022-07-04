const express = require('express')
const {
    get, 
    uploadFoto, 
    register, 
    list, 
    detail, 
    accept, 
    reject, 
    remove,
    count,
    listPeminjam
} = require('../controllers/anggota')
const CekToken = require('../middleware/CekToken')
const router = express.Router()

router.post('/regis', register)
router.get('/list', list)
router.get('/count', count)
router.get('/list-peminjam', listPeminjam)
router.get('/:id_user', CekToken, get)
router.post('/upload-foto/:id_user', uploadFoto)
router.get('/detail/:id_anggota', detail)
router.put('/accept/:id_anggota', accept)
router.put('/reject/:id_anggota', reject)
router.delete('/remove/:id_user', remove)

module.exports = router;