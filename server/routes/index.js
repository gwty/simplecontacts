var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')(/*options*/)
var db = pgp(process.env['DATABASE_URL'])


/* GET home page. */
router.get('/api/all', function(req, res, next) {
    db.query('SELECT * FROM contacts.contacts where status=true')
  .then(function (data) {
    res.jsonp(data);
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
});

router.get('/api/:column=:val', function(req, res, next) {
    var column = req.params.column;
    var val = req.params.val;
    
    if (column=="id") {
    db.one('SELECT * FROM contacts.contacts where status=true and '+column+'='+val)
  .then(function (data) {
    returned_data = []
    returned_data.push(data);
    res.jsonp(returned_data);
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
    }
  
  else {
          db.query('SELECT * FROM contacts.contacts where '+column+" ~* '^"+val+"'")
  .then(function (data) {
    res.jsonp(data);
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
  }
});


router.post('/api/', function(req, res, next) {
 var first_name = req.body.first_name;
 var last_name = req.body.last_name;
 var email = req.body.email;
 var phone_number = req.body.phone_number;
 var country = req.body.country;
 var type = req.body.type;
 var id = null;
 
 db.one("INSERT INTO contacts.contacts (first_name, last_name, email, phone_number, country, type,status) VALUES (${first_name},${last_name},${email},${phone_number},${country},${type},True) RETURNING id", {
     first_name:first_name,
     last_name:last_name,
     email:email,
     phone_number:phone_number,
     country:country,
     type:type
 })
  .then(function (data) {
      res.send(data);
  })
    .catch(function (error) {
    console.log('ERROR:', error)
  });
    
});


router.delete('/api/delete/:id', function(req, res, next) {
 var id = req.params.id;
 db.one("delete from contacts.contacts where id = "+id)
  .then(function (data) {
  })
    .catch(function (error) {
    console.log('ERROR:', error)
  });
});

router.delete('/api/archive/:id', function(req, res, next) {
 var id = req.params.id;
 db.one("UPDATE contacts.contacts set status=false where id = "+id)
  .then(function (data) {
  })
    .catch(function (error) {
    console.log('ERROR:', error)
  });
});

router.put('/api/update/:id', function(req, res, next) {
 console.log(req.body);
 var id = req.params.id;
 var first_name = req.body.first_name;
 var last_name = req.body.last_name;
 var email = req.body.email;
 var phone_number = req.body.phone_number;
 var country = req.body.country;
 var type = req.body.type;
 db.one("UPDATE contacts.contacts set first_name = ${first_name},last_name = ${last_name}, email = ${email}, phone_number = ${phone_number }, country = ${country}, type = ${type}  where id ="+id, {
     first_name:first_name,
     last_name:last_name,
     email:email,
     phone_number:phone_number,
     country:country,
     type:type
 }  
)
  .then(function (data) {
  })
    .catch(function (error) {
    console.log('ERROR:', error)
  });
});

module.exports = router;
