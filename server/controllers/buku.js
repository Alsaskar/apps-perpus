const BukuModel = require('../models/buku')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images/cover_buku')
    },

    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg"){
        cb(null, true)
    }else{
        cb(null, false)
        return cb(new Error('Foto harus jpg atau png'))
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },

    fileFilter: fileFilter
}).single('foto_cover')

const add = (req, res) => {
    
    upload(req, res, (err) => {
        if (err) { // jika ada error saat upload file
            return res.status(200).json({success: false, message: err.message})
        }else{ // jika tidak ada error saat upload file
            const buku = {
                judul: req.body.judul,
                penulis: req.body.penulis,
                penerbit: req.body.penerbit,
                jumlah: req.body.jumlah,
                foto_cover: req.file.filename,
                deskripsi: req.body.deskripsi
            }

            BukuModel.add(buku, (err, result) => {
                if(err) throw err
                res.status(200).json(result)
            })
        }
    })
}

const list = (req, res) => {
    const paginate = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
        search_query: req.query.search_query || ""
    }

    BukuModel.list(paginate, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const remove = (req, res) => {
    const id_buku = req.params.id_buku

    BukuModel.remove(id_buku, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const edit = (req, res) => {
    upload(req, res, (err) => {
        if (err) { // jika ada error saat upload file
            return res.status(200).json({success: false, message: err.message})
        }else{ // jika tidak ada error saat upload file
            if(!req.file){ // jika foto dibiarkan kosong
                const buku = {
                    id_buku: req.params.id_buku,
                    judul: req.body.judul,
                    penulis: req.body.penulis,
                    penerbit: req.body.penerbit,
                    jumlah: req.body.jumlah,
                    foto_cover: '',
                    deskripsi: req.body.deskripsi
                }

                BukuModel.edit(buku, (err, result) => {
                    if(err) throw err
                    res.status(200).json(result)
                })
            }else{ // jika foto tidak dibiarkan kosong
                const buku = {
                    id_buku: req.params.id_buku,
                    judul: req.body.judul,
                    penulis: req.body.penulis,
                    penerbit: req.body.penerbit,
                    jumlah: req.body.jumlah,
                    foto_cover: req.file.filename,
                    deskripsi: req.body.deskripsi
                }

                BukuModel.edit(buku, (err, result) => {
                    if(err) throw err
                    res.status(200).json(result)
                })
            }
        }
    })
}

// ambil total buku
const count = (req, res) => {
    BukuModel.count((err, result) => {
        if(err) throw err
        res.status(200).json(result)
    })
}

// list buku - untuk meminjam buku
const listMeminjam = (req, res) => {
    BukuModel.listMeminjam((err, result) => {
        if(err) throw err
        res.status(200).json(result)
    })
}

module.exports = {
    add,
    list,
    remove,
    edit,
    count,
    listMeminjam
}