const db = require('../config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginUser = (user, callback) => {
    const query = 'SELECT username, password, role FROM user WHERE username = ?'
    db.query(query, user.username, (err, result) => {
        if(err) throw err;

        const cekUser = result.length;
        const row = result[0]

        if(cekUser > 0){ // jika username benar
            bcrypt.compare(user.password, row.password, (error, response) => {
                if(error) throw error;

                if(response){ // berhasil login

                    // daftarkan token
                    const payload = { username: row.username }
                    const token = jwt.sign(payload, "Token008007***", {expiresIn: '1day'});

                    const users = {
                        username: row.username,
                        role: row.role,
                        token: token,
                        success: true
                    }

                    callback(null, users)
                }else{ // password salah
                    callback(null, {message: 'Password salah', success: false})
                }
            })
        }else{ // jika email salah
            callback(null, {message: 'Username salah', success: false})
        }
    })
}

// ambil data user yang sedang login
const getDataLoggedIn = (username, callback) => {
    db.query("SELECT * FROM user WHERE username = ?", [username], (err, result) => {
        if(err) throw err;

        const user = {
            id: result[0].id,
            fullname: result[0].fullname,
            username: result[0].username,
            role: result[0].role,
            loggedIn: true
        }

        callback(null, user)
    })
}

module.exports = {
    loginUser,
    getDataLoggedIn
}