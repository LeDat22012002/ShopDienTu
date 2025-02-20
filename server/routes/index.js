const userRouter = require('./user')
const {notFound , errHandle} = require('../middlewares/errorHandler')

const initRoutes = (app) => {
    app.use('/api/user' , userRouter)


    app.use(notFound)
    app.use(errHandle)
}

module.exports = initRoutes