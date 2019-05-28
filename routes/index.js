const users = require('./usuarios')
const auth = require('./auth')
const flog = require('./future_log')
const tp = require('./task_page')

module.exports = (app) => {
  app.use('/usuarios', users)
  app.use('/auth', auth)
  app.use('/future-log', flog)
  app.use('/monthly-log/tp', tp)
}