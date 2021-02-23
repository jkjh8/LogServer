var express = require('express');
var router = express.Router();

const log = require('../api/log')

/* GET log listing. */
router.get('/api/getlog', log.getlog)
router.get('/api/getlogcsv', log.getlogcsv)
router.post('/api/uploadlog', log.uploadlog)

module.exports = router
