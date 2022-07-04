const jwt = require('jsonwebtoken')

const cekToken = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, 'Token008007***', (error, decoded) => {
            if (error) {
                return res.status(200).json({
                    message: error.message,
                    loggedIn: false
                })
            } else {
                res.locals.jwt = decoded;
                next()
            }
        })
    }else{
        return res.status(200).json({
            message: 'Unauthorized',
            loggedIn: false
        })
    }
}

module.exports = cekToken