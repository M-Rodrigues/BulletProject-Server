const Router = require('express-promise-router')
const bcrypt = require('bcrypt')
const cred = require('../credentials')
const db = require('../db')
const auth = require('../auth')

const router = new Router()
module.exports = router

/*  GET /usuarios
    ::  consulta todos os usuário cadastrados no sistema
    */
router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`
            select us_consulta_usuarios()
        `, [])
        
        res.send(result[0].us_consulta_usuarios);
    } catch(err) {
        res.send({status: 1, erro: err})
    }
})

/*  GET /usuarios/:id
::  consulta apenas 1 usuario especifico pelo seu cod_usuario
*/
router.get('/:id', async (req, res, next) => {
    try {
        const result = await db.query(`
        select us_consulta_usuario($1)
        `, [parseInt(req.params.id)])
        
        res.send(result[0].us_consulta_usuario);
    } catch(err) {
        res.send({status: 1, erro: err})
    }
})

/*  POST /usuarios
    ::  criar um novo usuario no sistema, ou seja
        , realiza o cadastro no sistema
    */
router.post('/', async (req, res, next) => {
    try {
        const hashPsw = await bcrypt.hash(req.body.password, cred.saltRounds); // Criptografa senha
        const hashAns = await bcrypt.hash(req.body.user.resposta, cred.saltRounds) // Criptografa resposta

        let user = req.body.user;                           // Cria novo usuario no banco
        
        const result = await db.query(`
            select us_criar_usuario($1,$2,$3,$4,$5,$6,$7)
        `,[user.nome, user.email, hashAns, hashPsw, user.dia_nasc, user.mes_nasc, user.ano_nasc]);

        console.log(result)
        
        if (result.erro) throw result.erro;

        res.send({user:result[0].us_criar_usuario, status: 0});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})


/*  DELETE /usuarios/:id
    ::  remove o cadastro de um usuário pelo seu cod_usuario
    */
router.delete('/:id', auth.authenticate, async (req, res, next) => {
    try {
        console.log(req.params);
        const result = await db.query(
            `select us_remover_usuario($1)`
            ,[parseInt(req.params.id)]);

        if (result.erro) throw result.erro;

        res.send({message: 'sucesso'});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})
