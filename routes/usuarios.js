const Router = require('express-promise-router')
const bcrypt = require('bcrypt')
const cred = require('../credentials')
const db = require('../db')

const router = new Router()
module.exports = router

router.get('/', async (req, res, next) => {
    const result = await db.query('select * from usuarios', [])
    console.log(result)
    res.send(result);
})

router.post('/', async (req, res, next) => {
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
