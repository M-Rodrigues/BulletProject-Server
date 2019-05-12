const Router = require('express-promise-router')
const bcrypt = require('bcrypt')
const cred = require('../credentials')
const jwt = require('jsonwebtoken')
const db = require('../db')

const router = new Router()
const test = '$2b$05$p46H1Df8oLH9BTSK0Ubx4eUREbcutpbrXGCwjKn05.JV27mxitqEi'

module.exports = router

router.put('/login', async (req, res, next) => {        // Autentica um usuario
    try {
        let psw = req.body.password;
        
        const result = await db.query(`                         
            select * from usuarios where email = $1
        `,[req.body.email]);
        let user = result[0];                                   // Recuperar senha no banco
        
        if (!user) throw {status: 1, msg: "email não cadastrado"}          // ERRO: Email não cadastrado

        const match = await bcrypt.compare(psw, user.senha)     // Comparar as duas senhas
        
        if (!match) throw {status: 2, msg: "Senha errada"};                // ERRO: Senha não confere
        
        const token = await jwt.sign(                           // Gerar novo token
            { cod_usuario: user.cod_usuario }, 
            cred.jwtSecret, 
            { expiresIn: '10s' })
        
        res.send({ status: 0, token: token })                              // Enviar token

    } catch (err) {
        res.send(err);
    }
})

router.put('/recover', async (req, res, next) => {      // Troca senha sem estar logado
    try {
        const result = await db.query(`                            
            select resposta from usuarios where email = $1
        `,[req.body.email]);                                    // Verifica se email existe no banco
        
        if (!result[0]) 
            throw {status: 1, msg: 'Email não cadastrado.'}
        
        if (req.body.new_psw != req.body.new_psw2)              // Verifica se as duas senhas são iguais
            throw {status: 2, msg: 'Senhas novas não conferem.'}

        const match = await bcrypt.compare(req.body.resposta, result[0].resposta)     // Comparar as duas resposta de segurança
        
        if (!match)                                             // ERRO: Senha não confere
            throw {status: 3, msg: 'Resposta de segurança não confere.'};
        
        const hashPsw = await bcrypt.hash(req.body.new_psw, cred.saltRounds); // Criptografa senha
        const result2 = await db.query(`                            
            update usuarios set senha = $1 where email = $2
        `,[hashPsw, req.body.email]);                           // atualiza a senha
        
        res.send({status: 0, msg: "Senha alterada com sucesso."})
    
    } catch (err) {
        console.log("Erro...")
        console.log(err)
    
        res.send(err)
    }
})


