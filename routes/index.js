var express = require('express');
var router = express.Router();
var smsGateway = require("sms-gateway-nodejs")('vishal1785@gmail.com', 'vish5678')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Unisef',
    isSMSSent: 'false'
   });
});

router.post('/sendsms', function(req, res, next){
   // req.body object has the form values
   var destNumber = '+91' + req.body.number;
   var sms = req.body.message;

   console.log(sms +  " <- SMS to be sent to -> " + destNumber);

   // call smsGateway API to sens sms
   smsGateway.message.sendMessageToNumber('51370', destNumber, sms)
    .then((response) => {
      console.log("Msg send at -> " + response.send_at);
      res.render('index', { 
        title: 'Unisef',
        isSMSSent: 'true'
      });
    })
    .catch((error) => {
      // render the error page
      console.log(error);
    }) 
});

module.exports = router;
