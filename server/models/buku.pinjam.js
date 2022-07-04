const db = require('../config/database')

// meminjam buku
const add =(pinjamBuku, callback) => {
    db.query('SELECT id FROM pinjam_buku WHERE id_buku = ? AND id_anggota = ? AND status = "belum dikembalikan"', [pinjamBuku.id_buku, pinjamBuku.id_anggota], (err, result) => {
        if(err) throw err

        const cekData = result.length

        if(cekData > 0) { // jika anggota telah meminjam data yang sama, maka tidak bisa meminjam
            callback(null, {success: false, message: 'Peminjam telah meminjam buku ini. Untuk meminjamnya, silahkan mengembalikan buku terlebih dahulu'})
        }else{ // jika anggota belum meminjam buku yang sama
            // cek anggota, apakah sudah melebihi 3 kali meminjam buku
            db.query("SELECT id FROM pinjam_buku WHERE id_anggota = ? AND status = 'belum dikembalikan'", [pinjamBuku.id_anggota], (error, cekAnggota) => {
                if(error) throw error

                if(cekAnggota.length >= 3){ // jika 3 kali, tidak bisa meminjam buku
                    callback(null, {success: false, message: 'Tidak bisa meminjam buku dikarenakan peminjam telah 3 kali meminjam buku. Harap dikembalikan terlebih dahulu'})
                }else{ // jika belum melebihi 3 kali, maka bisa meminjam buku
                    db.query('SELECT jumlah FROM buku WHERE id = ?', [pinjamBuku.id_buku], (err2, result2) => {
                        if(err2) throw err2

                        if(result2[0].jumlah === 0){ // jika jumlah buku habis
                            callback(null, {success: false, message: 'Buku habis karena telah dipinjam oleh mahasiswa/i lain'})
                        }else{
                            // kurangi jumlah buku
                            const kurangiJumlah = result2[0].jumlah - 1
                            db.query("UPDATE buku SET jumlah = ? WHERE id = ?", [kurangiJumlah, pinjamBuku.id_buku])

                            db.query("INSERT INTO pinjam_buku(id_buku, id_anggota, tgl_pinjam, tgl_pengembalian)\n" + 
                            "VALUES(?, ?, ?, ?)", [pinjamBuku.id_buku, pinjamBuku.id_anggota, pinjamBuku.tgl_pinjam, pinjamBuku.tgl_pengembalian])

                            callback(null, {success: true, message: 'Berhasil meminjam buku'})
                        }
                    })
                }
            })
        }
    })
}

const list = (paginate, callback) => {
    const page = paginate.page
    const limit = paginate.limit
    const search = paginate.search_query
    const offset = limit * page

    const query = "SELECT pinjam_buku.*, user.fullname, anggota.nim, anggota.no_hp, buku.judul, buku.jumlah FROM pinjam_buku INNER JOIN\n" +
                  "anggota ON pinjam_buku.id_anggota = anggota.id INNER JOIN user ON anggota.id_user = user.id\n" +
                  "INNER JOIN buku ON pinjam_buku.id_buku = buku.id\n" +
                  "WHERE user.fullname LIKE ? OR anggota.nim LIKE ?"
    db.query(query, ['%' + search + '%', '%' + search + '%'], (err, result) => {
        if(err) throw err

        const totalRows = result.length
        const totalPage = Math.ceil(totalRows/limit)

        const query2 = "SELECT pinjam_buku.*, user.fullname, anggota.nim, anggota.no_hp, buku.judul, buku.jumlah FROM pinjam_buku INNER JOIN\n" +
                       "anggota ON pinjam_buku.id_anggota = anggota.id INNER JOIN user ON anggota.id_user = user.id\n" +
                       "INNER JOIN buku ON pinjam_buku.id_buku = buku.id\n" +
                       "WHERE user.fullname LIKE ? OR anggota.nim LIKE ? ORDER BY id DESC LIMIT "+ limit +" OFFSET "+ offset +" "
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

// hitung total data pinjaman
const count = (callback) => {
    db.query('SELECT id FROM pinjam_buku WHERE status = "belum dikembalikan"', (err, result) => {
        if(err) throw err

        callback(null, {total: result.length})
    })
}

// mengambil data peminjam buku - berdasarkan id_anggota
const listPeminjam = (id_anggota, callback) => {
    const query = "SELECT pinjam_buku.tgl_pinjam, pinjam_buku.tgl_pengembalian, pinjam_buku.status, buku.judul, buku.penulis, buku.penerbit FROM\n" +
                  "pinjam_buku INNER JOIN buku ON pinjam_buku.id_buku = buku.id WHERE pinjam_buku.id_anggota = ?\n" +
                  "ORDER BY pinjam_buku.id DESC"
    db.query(query, [id_anggota], (err, result) => {
        if(err) throw err
        callback(null, {result: result})
    })
}

module.exports = {
    add,
    list,
    count,
    listPeminjam
}