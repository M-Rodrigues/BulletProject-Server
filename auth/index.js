const jwt = require('jsonwebtoken')
const cred = require('../credentials')

module.exports = {
    authenticate: (req, res, next) => {
        let token = req.headers.token;
        console.log(req.headers.authorization);
        
        if (token) { // verify token
            jwt.verify(token, cred.jwtSecret, (err, decoded) => {
                if (err) {
                    res.status(401).send(err); // Token Expirou
                } else {
                    next(); // Autenticado
                }
            })
        } else {
            res.status(401).send('Authenticate yourself first!'); // request sem token
        }
    }
}