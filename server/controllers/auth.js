const AuthModel = require('../models/auth')

async function login(req, res){
    const user = {
        username: req.body.username,
        password: req.body.password
    }

    AuthModel.loginUser(user, (err, result) => {
        if(err) return res.status(500).json({success: false})

        res.status(200).json(result)
    })
}

async function loggedIn(req, res){
    const username = res.locals.jwt.username
    
    AuthModel.getDataLoggedIn(username, (err, result) => {
        if(err) throw err

        res.status(200).json(result)
    })
}

module.exports = {
    login,
    loggedIn
}