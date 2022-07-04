const db = require('../config/database')
const bcrypt = require('bcrypt')

const getData = (id_user, callback) => {
    db.query("SELECT * FROM anggota WHERE id_user = ?", [id_user], (err, result) => {
        if(err) throw err;

        callback(null, {result})
    })
}

const uploadFoto = (foto, id_user, callback) => {
    db.query("UPDATE anggota SET foto = ? WHERE id_user = ?", [foto, id_user], (err) => {
        if(err) throw err;
        callback(null, {success: true, message: 'berhasil mengupload foto'})
    })
}

const register = (user, callback) => {
    db.query("SELECT id FROM anggota WHERE nim = ? AND verified = 'diterima' ", [user.nim], (err, cek_nim) => {
        if(err) throw err;
        
        if(cek_nim.length > 0){ // jika nim sudah ada
            callback(null, {success: false, message: 'NIM telah terdaftar'})
        }else{ // jika nim belum ada
            db.query("SELECT id FROM anggota WHERE no_hp = ? AND verified = 'diterima' ", [user.no_hp], (err2, cek_no_hp) => {
                if(err2) throw err2;
                
                if(cek_no_hp.length > 0){ // jika nomor hp sudah ada
                    callback(null, {success: false, message: 'Nomor HP telah terdaftar'})
                }else{ // jika nomor hp sudah ada
                    // create hash password
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(user.password, salt)

                    db.query("INSERT INTO user(fullname, username, password, role) VALUES(?, ?, ?, 'anggota')", [user.fullname, user.nim, hash], (error, result) => {
                        if(error) throw error;

                        const query = "INSERT INTO anggota(id_user, nim, no_hp, jurusan, prodi, kelas, semester, foto_kartu_mahasiswa)\n" +
                                      "VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
                        db.query(query, [
                            result.insertId,
                            user.nim,
                            user.no_hp,
                            user.jurusan,
                            user.prodi,
                            user.kelas,
                            user.semester,
                            user.foto_kartu_mahasiswa
                        ])
                    })

                    callback(null, {success: true, message: 'Berhasil mendaftar menjadi anggota'})
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

    const query = "SELECT user.fullname, anggota.nim, anggota.jurusan, anggota.prodi, anggota.tgl_join,\n" +
    "anggota.verified FROM anggota INNER JOIN user ON anggota.id_user = user.id\n" +
    "WHERE user.role = 'anggota' AND user.fullname LIKE ?"
                  
    db.query(query, '%' + search + '%', (err, result) => { 
        if(err) throw err
        
        const totalRows = result.length
        const totalPage = Math.ceil(totalRows/limit)

        const query2 = "SELECT user.fullname, anggota.id AS idAnggota, anggota.id_user, anggota.nim, anggota.jurusan, anggota.prodi, anggota.tgl_join,\n" +
        "anggota.verified FROM anggota INNER JOIN user ON anggota.id_user = user.id\n" +
        "WHERE user.role = 'anggota' AND user.fullname LIKE ? ORDER BY anggota.id DESC LIMIT "+ limit +" OFFSET "+ offset +" "
        
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

// detail anggota
const detail = (id_anggota, callback) => {
    const query = "SELECT user.fullname, anggota.* FROM anggota INNER JOIN user ON\n" +
                  "anggota.id_user = user.id WHERE anggota.id = ?"
    db.query(query, [id_anggota], (err, result) => {
        if(err) throw err
        callback(null, {result})
    })
}

// menerima anggota - supaya mereka bisa meminjam buku
const accept = (id_anggota, callback) => {
    const query = "UPDATE anggota SET verified = 'diterima' WHERE id = ?";
    db.query(query, [id_anggota])

    callback(null, {success: true, message: 'Berhasil menerima anggota'})
}

// menolak anggota
const reject = (user, callback) => {
    db.query("UPDATE anggota SET verified = 'ditolak', alasan_ditolak = ? WHERE id = ? ", [user.alasan_ditolak, user.id_anggota])
    callback(null, {success: true, message: 'Anggota berhasil di tolak'})
}

const remove = (id_user, callback) => {
    db.query("DELETE FROM user WHERE id = ?", [id_user])
    callback(null, {success: true, message: 'Berhasil menghapus anggota'})
}

// mengambil total buku
const count = (callback) => {
    db.query("SELECT id FROM anggota", (err, result) => {
        if(err) throw err
        callback(null, {total: result.length})
    })
}

// ambil list anggota - meminjam buku
const listPeminjam = (callback) => {
    db.query("SELECT user.fullname, anggota.id AS idAnggota FROM anggota INNER JOIN user ON anggota.id_user = user.id\n" + 
             "WHERE anggota.verified = 'diterima' ORDER BY anggota.id DESC", (err, result) => {
        if(err) throw err
        callback(null, {result: result})
    })
}

module.exports = {
    getData,
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