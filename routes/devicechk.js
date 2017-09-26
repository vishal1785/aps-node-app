var express = require('express');
var router = express.Router();
var pg = require('pg');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var pool = new pg.Pool();
    pool.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('db', {results: result.rows} ); }
    });
  });
  pool.end();
});

module.exports = router;
