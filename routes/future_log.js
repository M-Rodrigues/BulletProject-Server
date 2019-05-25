const Router = require('express-promise-router')
const db = require('../db')
const auth = require('../auth')

const router = new Router()
module.exports = router

// TODAS REQUESTS DEVEM ESTAR NO FORMATO JSON

// TODO
// Buscar todas entradas do ML de um usuário
router.get('/', async (req, res, next) => {
    const result = await db.query('select * from usuarios', [])
    console.log(result)
    res.send(result);
})

// TODO
// Busca uma entrada específica do ML de um usuário
router.get('/:id', async (req, res, next) => {
    const result = await db.query('select * from usuarios where cod_usuario = $1', [parseInt(req.params.id)])
    console.log(result)
    res.send(result[0]);
})

// TODO
// Criar nova entrada no FL de um usuário
router.post('/', async (req, res, next) => {
    try {
        console.log(req.body);

        const result = await db.query(
            `insert into entradas 
            (descricao, cod_prioridade, cod_tipo, cod_colecao, cod_status) values
            ($1, $2, $3, 2, 1)`
            ,[req.body.descricao, req.body.signifier, req.body.tipo]);

        console.log(result);

        res.send({status: 'ok', res: result});        
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

// TODO
// Atualizar dados da uma entrada do FL de um usuário
router.put('/', async (req, res, next) => {
    try {
        console.log(req.params);
        const result = await db.query(
            `update ...`
            ,[parseInt(req.params.id)]);

        console.log(result);

        if (result.erro) throw result.erro;

        res.send({message: 'sucesso'});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

// TODO
// Remover uma entrada do FL de um usuário
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
