var express = require('express');
var router = express.Router();

const data = require('../api/data')

/* GET log listing. */
router.get('/api/getdata', data.getData)
router.post('/api/addZone', data.addZone)
router.post('/api/updateName', data.updateName)
router.post('/api/updateZone', data.updateZone)

module.exports = router
