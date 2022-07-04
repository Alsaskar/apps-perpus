const AnggotaModel = require('../models/anggota')
const multer = require('multer')
const client = require('twilio')(
    "AC0a195eaacf9f74a12d1ca172e78b0bd1",
    "f2c06f675fcca863aa9bbf540b706def"
);

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images')
    },

    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg"){
        cb(null, true)
    }else{
        cb(new Error('Foto harus jpg atau png'))
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },

    fileFilter: fileFilter
}).single('foto')

// Kartu Mahasiswa
const storageKartuMahasiswa = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images/kartu_mahasiswa')
    },

    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilterKartuMahasiswa = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg"){
        cb(null, true)
    }else{
        cb(new Error('Foto harus jpg atau png'))
    }
}

const uploadKartuMahasiswa = multer({
    storage: storageKartuMahasiswa, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },

    fileFilter: fileFilterKartuMahasiswa
}).single('foto_kartu_mahasiswa')

const get = async (req, res) => {
    const id_user = req.params.id_user
    
    AnggotaModel.getData(id_user, (err, result) => {
        if(err) throw err

        res.status(200).json(result)
    })
}

const uploadFoto = async (req, res) => {
    const id_user = req.params.id_user
    
    upload(req, res, (err) => {
        if (err) {
            return res.status(200).send({success: false, message: err.message})
        }else{
            AnggotaModel.uploadFoto(req.file.filename, id_user, (error) => {
                if(error) throw error
                return res.status(200).json({success: true, message: 'Berhasil upload foto'})
            })  
        }
    })
}

const register = async (req, res) => {
    uploadKartuMahasiswa(req, res, (err) => {
        if (err) { // jika error saat upload file
            return res.status(200).send({success: false, message: err.message})
        }else{ // jika tidak error saat upload file
            const user = {
                fullname: req.body.fullname,
                nim: req.body.nim,
                password: req.body.password,
                no_hp: "+62" + req.body.no_hp,
                jurusan: req.body.jurusan,
                prodi: req.body.prodi,
                kelas: req.body.kelas,
                semester: req.body.semester,
                foto_kartu_mahasiswa: req.file.filename
            }

            AnggotaModel.register(user, (error, result) => {
                if(error) throw error
                return res.status(200).json(result)
            })  
        }
    })
}

const list = async (req, res) => {
    const paginate = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
        search_query: req.query.search_query || ""
    }

    AnggotaModel.list(paginate, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const detail = async (req, res) => {
    const id_anggota = req.params.id_anggota

    AnggotaModel.detail(id_anggota, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const accept = async (req, res) => {
    const id_anggota = req.params.id_anggota
    const no_hp = req.body.no_hp

    client.messages.create({
        from: +19895026035,
        to: no_hp,
        body: `Admin Perpustakaan Polimdo. Akun Anda telah diterima. Sudah bisa meminjam buku`
    })

    AnggotaModel.accept(id_anggota, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const reject = async (req, res) => {
    const user = {
        alasan_ditolak: req.body.alasan_ditolak,
        id_anggota: req.params.id_anggota,
        no_hp: req.body.no_hp
    }

    // kirim sms
    client.messages.create({
        from: +19895026035,
        to: user.no_hp,
        body: `Admin Perpustakaan Polimdo. Akun Anda telah di tolak dengan alasan ${user.alasan_ditolak}. Silahkan mendaftar lagi`
    })

    AnggotaModel.reject(user, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const remove = async (req, res) => {
    const id_user = req.params.id_user

    AnggotaModel.remove(id_user, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

// ambil total buku
const count = (req, res) => {
    AnggotaModel.count((err, result) => {
        if(err) throw err
        res.status(200).json(result)
    })
}

// list peminjam - untuk meminjam buku
const listPeminjam = (req, res) => {
    AnggotaModel.listPeminjam((err, result) => {
        if(err) throw err
        res.status(200).json(result)
    })
}

module.exports = {
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
}