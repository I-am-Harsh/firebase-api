var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { home : "nav-link active", upload : "nav-link" })
});

module.exports = router;
