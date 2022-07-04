const db = require('../config/database')

const add = (buku, callback) => {
    db.query("SELECT id FROM buku WHERE judul = ?", [buku.judul], (err, result) => {
        if(err) throw err;

        if(result.length > 0){ // jika buku sudah ada
            callback(null, {success: false, message: 'Buku sudah ada'})
        }else{ // jika buku belum ada
            const query = "INSERT INTO buku(judul, penulis, penerbit, foto_cover, jumlah, deskripsi)\n" +
                          "VALUES(?, ?, ?, ?, ?, ?)"
            db.query(query, [buku.judul, buku.penulis, buku.penerbit, buku.foto_cover, buku.jumlah, buku.deskripsi])

            callback(null, {success: true, message: 'Berhasil menambahkan buku'})
        }
    })
}

const list = (paginate, callback) => {
    const page = paginate.page
    const limit = paginate.limit
    const search = paginate.search_query
    const offset = limit * page

    const query = "SELECT * FROM buku WHERE judul LIKE ?"

    db.query(query, '%' + search + '%', (err, result) => {
        if(err) throw err

        const totalRows = result.length
        const totalPage = Math.ceil(totalRows/limit)

        const query2 = "SELECT * FROM buku\n" + 
                       "WHERE judul LIKE ? ORDER BY id DESC LIMIT "+ limit +" OFFSET "+ offset +" "
        db.query(query2, '%' + search + '%', (error, hasil) => {
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

const remove = (id_buku, callback) => {
    db.query("DELETE FROM buku WHERE id = ?", [id_buku])
    callback(null, {success: true, message: 'Data berhasil dihapus'})
}

const edit = (buku, callback) => {
    if(buku.foto_cover === ''){ // jika foto dibiarkan kosong
        const query = "UPDATE buku SET judul = ?, penulis = ?, penerbit = ?, jumlah = ?,\n" +
                      "deskripsi = ? WHERE id = ?";
        db.query(query, [buku.judul, buku.penulis, buku.penerbit, buku.jumlah, buku.deskripsi, buku.id_buku])
    }else{ // jika foto diganti
        const query = "UPDATE buku SET judul = ?, penulis = ?, penerbit = ?, jumlah = ?, foto_cover = ?,\n" +
                      "deskripsi = ? WHERE id = ?";
        db.query(query, [buku.judul, buku.penulis, buku.penerbit, buku.jumlah, buku.foto_cover, buku.deskripsi, buku.id_buku])
    }

    callback(null, {success: true, message: 'Buku berhasil di edit'})
}

// mengambil total buku
const count = (callback) => {
    db.query("SELECT id FROM buku", (err, result) => {
        callback(null, {total: result.length})
    })
}

// list buku - untuk meminjam buku
const listMeminjam = (callback) => {
    db.query("SELECT id AS idBuku, judul FROM buku ORDER BY id DESC", (err, result) => {
        if(err) throw err;
        callback(null, {result: result})
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