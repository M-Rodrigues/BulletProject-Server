const Router = require('express-promise-router')
const db = require('../db')
const auth = require('../auth')
const utils = require('../utils')

const router = new Router()
module.exports = router

/*  GET /future-log/full-year
    ::  consulta todas entradas de future log dos próximos 12 meses
    */
router.get('/full-year/:month/:year', async (req, res, next) => {
    try {
        let m = parseInt(req.params.month)
        let y = parseInt(req.params.year)

        console.log("on my function")
        const result = await db.query(`
            select fl_get_entradas_next_year($1,$2,$3,$4)
        `, [m,y,m,y+1,req.body.jwt_payload.cod_usuario])
        
        console.log(result)
        
        // res.send({ data: result[0].fl_get_entradas_next_year, status: 0 });
        res.send(result);
    } catch(err) {
        res.send({status: 1, erro: err})
    }
})

/*  GET /future-log/:month/:year
    ::  consulta todas entradas de future log referentes a month/year
    */
router.get('/:month/:year', auth.authenticate, async (req, res, next) => {
    try {
        let month = req.params.month
        let year = req.params.year

        const result = await db.query(`
            select fl_get_entradas_by_monthyear($1,$2,$3)
        `, [parseInt(month), parseInt(year), req.body.jwt_payload.cod_usuario])
        
        // console.log(result)
        res.send({ status: 0, data: result[0].fl_get_entradas_by_monthyear });
    } catch(err) {
        res.send({status: 1, erro: err})
    }
})

/*  PUT /daily-log
    ::  atualiza dados de uma entrada do daily log
    */
router.put('/', auth.authenticate, async (req, res, next) => {
    try {
        // atualiza dados de uma entrada
        const result = await db.query(`
            select dl_atualiza_entrada($1,$2,$3,$4,$5)
        `,[
            req.body.cod_entrada, 
            req.body.descricao, 
            req.body.cod_prioridade,
            req.body.cod_status,
            req.body.cod_tipo
        ]);

        // console.log(result)
        if (result.erro) throw result.erro;

        res.send({ status: 0, data: result[0].dl_atualiza_entrada, status: 0 });
    } catch (err) {
        console.log(err);
        res.send({ status: 1, erro:err });
    }
})

/*  POST /daily-log
    ::  criar uma nova entrada no daily log
    */
router.post('/', auth.authenticate, async (req, res, next) => {
    try {
        let data = utils.build_data(req.body.dia, req.body.mes, req.body.ano)
        console.log(req.body)

        // Cria nova entrada no banco
        const result = await db.query(`
            select dl_criar_entrada($1,$2,$3,$4,$5,$6,$7)
        `,[req.body.descricao, req.body.dia, req.body.mes, req.body.ano, data, req.body.cod_tipo, req.body.jwt_payload.cod_usuario]);

        // console.log(result)
        if (result.erro) throw result.erro;
        
        res.send({ entrada: result[0].dl_criar_entrada, status: 0 });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

/*  DELETE /daily-log/:id
    ::  remove o uma entrada do daily log
    */
router.delete('/:id', auth.authenticate, async (req, res, next) => {
    try {
        console.log(req.params);
        const result = await db.query(
            `select dl_remover_entrada($1)`
            ,[parseInt(req.params.id)]);

        if (result.erro) throw result.erro;

        res.send({staus: 0, message: 'sucesso'});
    } catch (err) {
        console.log(err);
        res.send({status: 1, erro:err });
    }
})