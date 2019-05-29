const Router = require('express-promise-router')
const db = require('../db')
const auth = require('../auth')
const utils = require('../utils')

const router = new Router()
module.exports = router

/*  GET /monthly-log/cp/:month/:year
    ::  consulta todas entradas de calendar-page referentes a month/year
    */
router.get('/:month/:year', auth.authenticate, async (req, res, next) => {
    try {
        let month = req.params.month
        let year = req.params.year

        const result = await db.query(`
            select cp_get_entradas_by_monthyear($1,$2,$3)
        `, [parseInt(month), parseInt(year), req.body.jwt_payload.cod_usuario])
        
        console.log(result)
        res.send(result[0].cp_get_entradas_by_monthyear);
    } catch(err) {
        res.send({status: 1, erro: err})
    }
})

/*  PUT /monthly-log/cp
    ::  atualizadados de uma entrada na calendar-page
    */
router.put('/', auth.authenticate, async (req, res, next) => {
    try {
        // atualiza dados de uma entrada
        const result = await db.query(`
            select cp_atualiza_entrada($1,$2,$3,$4)
        `,[
            req.body.cod_entrada, 
            req.body.descricao, 
            req.body.cod_prioridade,
            req.body.cod_status
        ]);

        // console.log(result)
        if (result.erro) throw result.erro;

        res.send({ entrada: result[0].cp_atualiza_entrada, status: 0 });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

/*  POST /monthly-log/cp
    ::  criar uma nova entrada na calendar-page
    */
router.post('/', auth.authenticate, async (req, res, next) => {
    try {
        let data = utils.build_data(req.body.dia, req.body.mes, req.body.ano)

        console.log(data)

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

/*  DELETE /monthly-log/cp/:id
    ::  remove o uma entrada da calendar-page
    */
router.delete('/:id', auth.authenticate, async (req, res, next) => {
    try {
        console.log(req.params);
        const result = await db.query(
            `select tp_remover_entrada($1)`
            ,[parseInt(req.params.id)]);

        if (result.erro) throw result.erro;

        res.send({message: 'sucesso'});
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})
