const jwt = require('jsonwebtoken')
const cred = require('../credentials')

module.exports = {
    authenticate: (req, res, next) => {
        let token = req.headers.authorization;
        // console.log(req.headers)
        // console.log(req.headers.authorization);

        if (token) { // verify token
            jwt.verify(token, cred.jwtSecret, (err, decoded) => {
                if (err) {
                    res.send({
                        msg: 'Token expirou',
                        error: err,
                        status: -1
                    }) // Token Expirou
                } else {
                    // res.send({
                    //     msg: 'Token verificado com sucesso',
                    //     decoded: decoded
                    // }) // Autenticado

                    console.log(decoded)
                    req.body.jwt_payload = decoded
                    console.log("Request authenticated")
                    next()
                }
            })
        } else {
            res.send({
                msg: 'Requisição sem token...',
                status: -2
            })        
        }
    }
}