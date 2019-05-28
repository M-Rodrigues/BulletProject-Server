const Router = require('express-promise-router')
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

/*  POST /monthly-log/tp
    ::  criar uma nova entrada na task page
    */
router.post('/', async (req, res, next) => {
    try {
        let data = build_data(req.body.dia, req.body.mes, req.body.ano)

        // Cria nova entrada no banco
        const result = await db.query(`
            select tp_criar_entrada($1,$2,$3,$4,$5,$6)
        `,[req.body.descricao, req.body.dia, req.body.mes, req.body.ano, data, req.body.jwt_payload.cod_usuario]);

        // console.log(result)
        if (result.erro) throw result.erro;

        res.send({ entrada: result[0].tp_criar_entrada, status: 0 });
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

const build_data = (dia, mes, ano) => {
    let data = ""
    
    if (!dia) data += "00"
    else if (dia < 10) data += "0" + dia
    else data += dia

    if (!mes) data += "00"
    else if (mes < 10) data += "0" + mes
    else data += mes

    if (!ano) data = data + "0000"
    else data += ano

    return data
}