const Router = require('express-promise-router')
const bcrypt = require('bcrypt')
const cred = require('../credentials')
const db = require('../db')

const router = new Router()
module.exports = router

/*  GET /usuarios
    ::  consulta todos os usuário cadastrados no sistema
    */
router.get('/', async (req, res, next) => {
    const result = await db.query('select * from usuarios', [])
    // console.log(result)
    res.send(result);
})

/*  GET /usuarios/:id
    ::  consulta apenas 1 usuario especifico pelo seu cod_usuario
    */
router.get('/:id', async (req, res, next) => {
    const result = await db.query('select * from usuarios where cod_usuario = $1', [parseInt(req.params.id)])
    // console.log(result)
    res.send(result[0]);
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
        const result = await db.query(
            `insert into usuarios (nome, email, resposta, senha)
            values ($1, $2, $3, $4)`
            ,[user.nome, user.email, hashAns, hashPsw]);

        console.log(result);

        if (result.erro) throw result.erro;
        
        // Atualiza data de nasc
        const result2 = await db.query(`                      
            update usuarios
            set
                cod_tempo_nasc = t.cod_tempo
            from
                tempo as t
            where
                email = $1
                and t.dia = $2
                and t.mes = $3
                and t.ano = $4
            
        `,[user.email, user.dia_nasc, user.mes_nasc, user.ano_nasc]);

        if (result2.erro) throw result2.erro;

        res.send({message: 'sucesso'});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

/*  DELETE /usuarios/:id
    ::  remove o cadastro de um usuário pelo seu cod_usuario
    */
router.delete('/:id', async (req, res, next) => {
    try {
        console.log(req.params);
        const result = await db.query(
            `delete from usuarios where cod_usuario = $1`
            ,[parseInt(req.params.id)]);

        console.log(result);

        if (result.erro) throw result.erro;

        res.send({message: 'sucesso'});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})
