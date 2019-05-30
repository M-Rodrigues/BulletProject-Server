const sender = require('../sender')

module.exports = {
    startTests: () => {
        console.log("Testes em /future-log\n")
        getFullYear()
    }
}

const getFullYear = () => {
    let method = 'GET'
    let path = '/future-log/full-year/5/2019'

    sender.sendRequest(method, path, {}, true)
        .then((res) => {
            if (res.status === 0) {
                console.log(`${method} ${path} -> ok!`)
            } else {
                console.log(`${method} ${path} -> falha`)
                console.log(res)
            }
        })
        .catch((err) => {
            console.log(`${method} ${path} -> falha`)
            console.log(err)
        })
        .finally(() => {
            getMonth()
        })
}


const getMonth = () => {
    let method = 'GET'
    let path = '/future-log/5/2019'

    sender.sendRequest(method, path, {}, true)
        .then((res) => {
            if (res.status === 0) {
                console.log(`${method} ${path} -> ok!`)
            } else {
                console.log(`${method} ${path} -> falha`)
                console.log(res)
            }
        })
        .catch((err) => {
            console.log(`${method} ${path} -> falha`)
            console.log(err)
        })
        .finally(() => {

        })
        
}