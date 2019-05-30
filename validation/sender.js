const rp = require('request-promise');

const SERVER_ADDR = 'localhost'
const PORT = '5000'
const FULL_ADDR = 'http://' + SERVER_ADDR + ':' + PORT

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibXkgcGF5bG9hZCIsImlhdCI6MTU1OTIxNDg1MH0.Duw56VHHhZ3GHoGY8fEPnSuEXUhaeezD6nnEjgj-nSI'

module.exports = {
    sendRequest: (method, path, body, hd) => {
        let option = { 
            method: method,
            uri: FULL_ADDR + path,
            body: body,
            json: true 
        }

        if (hd) option.headers = { Authorization: token }

        return rp(option)
    }
}