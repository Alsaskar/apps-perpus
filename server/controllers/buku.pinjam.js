const PinjamBukuModel = require('../models/buku.pinjam')
const client = require('twilio')(
    "AC0a195eaacf9f74a12d1ca172e78b0bd1",
    "f2c06f675fcca863aa9bbf540b706def"
);

const add = (req, res) => {
    const pinjamBuku = {
        id_buku: req.body.id_buku,
        id_anggota: req.body.id_anggota,
        tgl_pinjam: req.body.tgl_pinjam,
        tgl_pengembalian: req.body.tgl_pengembalian
    }

    PinjamBukuModel.add(pinjamBuku, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const list = (req, res) => {
    const paginate = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
        search_query: req.query.search_query || ""
    }

    PinjamBukuModel.list(paginate, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const count = (req, res) => {
    PinjamBukuModel.count((err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const listPeminjam = (req, res) => {
    const id_anggota = req.params.id_anggota

    PinjamBukuModel.listPeminjam(id_anggota, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const reminder = (req, res) => {
    const user = {
        no_hp: req.body.no_hp,
        waktu_pengembalian: req.body.waktu_pengembalian
    }

    // kirim sms
    client.messages.create({
        from: +19895026035,
        to: user.no_hp,
        body: `Admin Perpustakaan Polimdo. Waktu meminjam buku sisa ${user.waktu_pengembalian} hari lagi`
    })

    return res.status(200).json({success: true, message: 'Berhasil mengingatkan'})
}

module.exports = {
    add,
    list,
    count,
    listPeminjam,
    reminder
}