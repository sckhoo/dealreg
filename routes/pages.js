const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql');

dotenv.config({ path: './.env'});

const router = express.Router();

var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})


router.get('/', (req,res) => {
    res.render('home');
});

//router.get('/dealreg', (req,res) => {
//    res.render('index');
//});

router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/home', (req,res) => {
    res.render('home');
});

router.get('/register', (req,res) => {
    res.render('register');
});

router.get('/thanks', (req,res) => {
    res.render('thanks');
});

router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/avmlogin', (req,res) => {
    res.render('avmlogin', {
        msg: "For AVM internal Administrator only"
    });
});

router.get('/avmregister', (req,res) => {
    res.render('avmregister', {
        msg: "For AVM internal Administrator only"
    });
});

router.get('/reason', function(req, res) { 
    var id = req.query.id;
    res.render('reason', {id : id});
})

router.get('/displaydeal', function(req, res) {
    const insertId = req.body.insertId;

    var sql = 'select * FROM deals where dealNo = ?';
    console.log(reason)
    db.query(sql, [insertId], function(err, result) {
        if (err) throw err;
        res.render('displaydeal', { result: result });
    })
})

router.get('/admin/:id/:email', function(req, res) {
    const id = req.params.id;
    const email = req.params.email;

    var sql = 'SELECT * FROM deals where dealNo = ?';

    db.query(sql, [id], function(err, result) {
        //console.log(result);
        res.render('details', { details:result, email:email });
    })
})

//router.get('/avmdealadmin', (req, res) => {
//
//	//const userName = req.query.user;
//
//  var sql = ('SELECT * FROM deals');
//
//    db.query(sql, function(err, result) {            
//        res.render('avmdealadmin', {user: userName, deal: result});
//    })
//})

module.exports = router;