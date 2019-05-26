const Router = require('express-promise-router')
const db = require('../db')
const auth = require('../auth')

/* cod_colecao do Future Log no DB
    */
const cod_fl = 3

const router = new Router()
module.exports = router

// TODAS REQUESTS DEVEM ESTAR NO FORMATO JSON

// TODO
/*  GET /future-log
    ::  consulta todas entradas de FL de um usuário
    */
router.get('/', auth.authenticate, async (req, res, next) => {
    const result = await db.query(`
        select  * 
        from entradas
        where cod_colecao = $1 and cod_usuario = $2`
    , [cod_fl, req.body.payload.cod_usuario])

    console.log(result)
    res.send(result);
})

// TODO
/*  GET /future-log/:id
    ::  consulta uma entrada de FL de um usuário
    */
router.get('/:id', auth.authenticate, async (req, res, next) => {
    const result = await db.query(`
        select *
        from entradas
        where cod_entrada = $1
    `, [parseInt(req.params.id)])
    console.log(result)
    res.send(result[0]);
})

// TODO
/*  POST /future-log
    ::  cria uma nova entrada no FL de um usuário
    */
router.post('/', auth.authenticate, async (req, res, next) => {
    try {
        console.log(req.body);

        const result = await db.query(
            `insert into entradas 
            (descricao, cod_prioridade, cod_tipo, cod_colecao, cod_status, cod_usuario) values
            ($1, $2, $3, 2, 1)`
            ,[req.body.descricao, req.body.signifier, req.body.tipo, cod_fl, req.body.status, req.body.payload.cod_usuario]);

        console.log(result);
        res.send({status: 0, res: result});        
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

// TODO
/*  PUT /future-log
    ::  atualiza dados de uma entrada de FL de um usuário
    */
router.put('/', auth.authenticate, async (req, res, next) => {
    try {
        console.log(req.body)
        let obj = req.body
        const result = await db.query(`
            update entradas
            set
                descricao = $1,
                cod_tempo = $2,
                cod_usuario = $3,
                cod_prioridade = $4,
                cod_status = $5,
                cod_tipo = $6,
                cod_colecao = $7,
                cod_entrada_parent = $8
            where cod_entrada = $9
        `,[
            obj.descricao, obj.cod_tempo, obj.payload.cod_usuario, obj.cod_prioridade,
            obj.cod_status, obj.cod_tipo, cod_fl, obj.cod_entrada_parent
        ]);

        console.log(result);

        if (result.erro) throw {err: result.erro, status: 1};

        res.send({msg: 'sucesso', status = 0});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

// TODO
/*  DELETE /future-log/:id
    ::  Remove uma entrada do FL de um usuario
    */
router.delete('/:id', auth.authenticate, async (req, res, next) => {
    try {
        const result = await db.query(
            `delete from entradas where cod_entrada = $1`
            ,[parseInt(req.params.id)]);

        console.log(result);

        if (result.erro) throw {err: result.erro, status:1}

        res.send({msg: 'sucesso', status: 0});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})
