const PengembalianBukuModel = require('../models/buku.pengembalian')

const add = (req, res) => {
    const kembalikan = {
        id_pinjam_buku: req.body.id_pinjam_buku,
        id_anggota: req.body.id_anggota,
        id_buku: req.body.id_buku,
        total_harga_denda: req.body.total_harga_denda,
        status: req.body.status,
        tgl_dikembalikan: req.body.tgl_dikembalikan,
        jumlah_buku: req.body.jumlah_buku
    }

    PengembalianBukuModel.add(kembalikan, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const count = (req, res) => {
    PengembalianBukuModel.count((err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const list = (req, res) => {
    const paginate = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
        search_query: req.query.search_query || "",
        id_anggota: req.params.id_anggota
    }

    PengembalianBukuModel.list(paginate, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

const listAll = (req, res) => {
    const paginate = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
        search_query: req.query.search_query || ""
    }

    PengembalianBukuModel.listAll(paginate, (err, result) => {
        if(err) throw err
        return res.status(200).json(result)
    })
}

module.exports = {
    add,
    count,
    list,
    listAll
}