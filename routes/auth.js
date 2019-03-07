const Router = require('express-promise-router')
const bcrypt = require('bcrypt')
const cred = require('../credentials')
const jwt = require('jsonwebtoken')
const db = require('../db')

const router = new Router()
const test = '$2b$05$p46H1Df8oLH9BTSK0Ubx4eUREbcutpbrXGCwjKn05.JV27mxitqEi'

module.exports = router

router.put('/login', async (req, res, next) => { // Autentica um usuario
    try {
        let psw = req.body.password;
        
        const result = await db.query(`                         
            select * from usuarios where email = $1
        `,[req.body.email]);
        let user = result[0];                                   // Recuperar senha no banco
        
        if (!user) throw {err: "email não cadastrado"}          // ERRO: Email não cadastrado

        const match = await bcrypt.compare(psw, user.senha)     // Comparar as duas senhas
        
        if (!match) throw {err: "Senha errada"};                // ERRO: Senha não confere
        
        const token = await jwt.sign(                           // Gerar novo token
            { cod_usuario: user.cod_usuario }, 
            cred.jwtSecret, 
            { expiresIn: '10s' })
        
        res.send({ token: token })                              // Enviar token

    } catch (err) {
        res.send(err);
    }
})

router.post('/register', async (req, res, next) => { // Cria nova conta
    try {
        const hashPsw = await bcrypt.hash(req.body.password, cred.saltRounds); // Criptografa senha

        let user = req.body.user;                           // Cria novo usuario no banco
        const result = await db.query(
            `insert into usuarios (nome, dia_nasc, mes_nasc, ano_nasc, email, senha)
            values ($1, $2, $3, $4, $5, $6)`
            ,[user.nome, user.dia_nasc, user.mes_nasc, user.ano_nasc, user.email, hashPsw]);

        console.log(result);

        if (result.erro) throw result.erro;

        res.send({message: 'sucesso'});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

