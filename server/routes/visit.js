const router = require('express').Router();
const Visit = require('../controller/visits');

router.post('/createVisit', Visit.createVisit);

module.exports = router;
