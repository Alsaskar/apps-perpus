const db = require('../config/database')

const add = (kembalikan, callback) => {
    const query = "INSERT INTO pengembalian_buku(id_anggota, id_buku, total_harga_denda, status, tgl_dikembalikan)\n" +
                  "VALUES(?, ?, ?, ?, ?)"
    db.query(query, [kembalikan.id_anggota, kembalikan.id_buku, kembalikan.total_harga_denda, kembalikan.status, kembalikan.tgl_dikembalikan], (err, result) => {
        if(err) throw err

        // update status
        db.query("UPDATE pinjam_buku SET status = 'sudah dikembalikan' WHERE id = ? ", [kembalikan.id_pinjam_buku])

        // update jumlah buku
        const jumlah = kembalikan.jumlah_buku + 1
        db.query("UPDATE buku SET jumlah = ? WHERE id = ? ", [jumlah, kembalikan.id_buku])

        callback(null, {success: true, message: 'Buku berhasil dikembalikan'})
    })
}

const count = (callback) => {
    db.query("SELECT id FROM pengembalian_buku", (err, result) => {
        if(err) throw err

        callback(null, {total: result.length})
    })
}

// semua data berdasarkan id anggota
const list = (paginate, callback) => {
    const page = paginate.page
    const limit = paginate.limit
    const search = paginate.search_query
    const offset = limit * page

    const query = "SELECT pengembalian_buku.*, buku.judul FROM pengembalian_buku INNER JOIN\n" +
                  "buku ON pengembalian_buku.id_buku = buku.id WHERE buku.judul LIKE ? AND pengembalian_buku.id_anggota = ?"
    db.query(query, ['%' + search + '%', paginate.id_anggota], (err, result) => {
        if(err) throw err

        const totalRows = result.length
        const totalPage = Math.ceil(totalRows/limit)

        const query2 = "SELECT pengembalian_buku.*, buku.judul FROM pengembalian_buku INNER JOIN\n" +
                       "buku ON pengembalian_buku.id_buku = buku.id WHERE buku.judul LIKE ? AND pengembalian_buku.id_anggota = ? ORDER BY pengembalian_buku.id DESC LIMIT "+ limit +" OFFSET "+ offset +" "
        db.query(query2, ['%' + search + '%', paginate.id_anggota], (error, hasil) => {
            if(error) throw error
            
            callback(null, {
                "result": hasil,
                "page": page,
                "limit": limit,
                "totalRows": totalRows,
                "totalPage": totalPage
            })
        })
    })
}

// semua data buku - tampilkan untuk admin
const listAll = (paginate, callback) => {
    const page = paginate.page
    const limit = paginate.limit
    const search = paginate.search_query
    const offset = limit * page

    const query = "SELECT pengembalian_buku.*, buku.judul, anggota.nim, user.fullname FROM pengembalian_buku INNER JOIN\n" +
                  "buku ON pengembalian_buku.id_buku = buku.id INNER JOIN anggota ON pengembalian_buku.id_anggota = anggota.id\n" + 
                  "INNER JOIN user ON anggota.id_user = user.id WHERE buku.judul LIKE ? OR user.fullname LIKE ?"
    db.query(query, ['%' + search + '%', '%' + search + '%'], (err, result) => {
        if(err) throw err

        const totalRows = result.length
        const totalPage = Math.ceil(totalRows/limit)

        const query2 = "SELECT pengembalian_buku.*, buku.judul, anggota.nim, user.fullname FROM pengembalian_buku INNER JOIN\n" +
                       "buku ON pengembalian_buku.id_buku = buku.id INNER JOIN anggota ON pengembalian_buku.id_anggota = anggota.id\n" + 
                       "INNER JOIN user ON anggota.id_user = user.id WHERE buku.judul LIKE ? OR user.fullname LIKE ? ORDER BY pengembalian_buku.id DESC LIMIT "+ limit +" OFFSET "+ offset +" "
        db.query(query2, ['%' + search + '%', '%' + search + '%'], (error, hasil) => {
            if(error) throw error
            
            callback(null, {
                "result": hasil,
                "page": page,
                "limit": limit,
                "totalRows": totalRows,
                "totalPage": totalPage
            })
        })
    })
}

module.exports = {
    add,
    count,
    list,
    listAll
}