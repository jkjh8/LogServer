var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const log = require('./log')
const user = require('./users')
const data = require('./data')

router.use(log)
router.use(user)
router.use(data)

module.exports = router;
