const router = require('express').Router()
const createUser = require('../controller/user')

router.post('/register', createUser.register)

module.exports = router
