// IMPORTS
const express = require('express')
const buildRoutes = require('./routes')
const bodyParser = require('body-parser')

const app = express()
var PORT = 5000

app.use((req, res, next) => {               // MIDDLEWARE DE LOGS
    let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`${req.method} ${req.url} recieved at : ${time}`)
    next();
})
app.use((req, res, next) => {               // MIDDLEWARE PARA CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, OPTIONS, POST, PATCH, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());                 // BODY PARSER

buildRoutes(app)                            // CONTRUINDO ROTAS

app.listen(PORT, () => {                    // SERVIDOR EM MODO LISTEN
    console.log(`Server running on ${PORT}`);
})

app.get('/', (req, res) => {                // ROOT ENDPOINT
    let obj = {
        message: "Welcome to Bullet Journal API!",
        team: "Grupo R",
        date: Date.now()
    };
    res.send(obj);
})


const jwt = require('jsonwebtoken')
const cred = require('./credentials')
const auth = require('./auth')
app.get('/teste', auth.authenticate, (req, res) => {           
// app.get('/teste', (req, res) => {           
    console.log(req.body)

    var teste_token = jwt.sign(
        { data: 'my payload' },
        cred.jwtSecret,
        { expiresIn: cred.jwtExpiresIn }
    );

    console.log(`teste_token: ${teste_token}`);

    res.send({token: teste_token})
})
