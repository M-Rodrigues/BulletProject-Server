const users = require('./usuarios')
const auth = require('./auth')

module.exports = (app) => {
  app.use('/usuarios', users)
  app.use('/auth', auth)
}