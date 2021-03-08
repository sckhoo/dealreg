const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abcd1234",
    database: "dealRegistration"
})



// Function for after submitting the form 
app.post('/submit', function(req, res) {

    const sql = 'SELECT MAX(dealNo) as maxNo FROM deals'

    con.query(sql, function(err, results) {   
        // information that had been send from form 
        var oppName = req.body.oppName;
        var oppValue = req.body.oppValue;
        var oppClosedate = req.body.oppClosedate;

        var custName = req.body.custName;
        var custAdd = req.body.custAdd;
        var custState = req.body.custState;
        var custCountry = req.body.custCountry;
        var custEmployee = req.body.custEmployee;
        var custVM = req.body.custVM;
        var custApps = req.body.custApps;
        var custBudget = req.body.custBudget;
        var closeDate = req.body.closeDate;
        
        var reseller = req.body.reseller;
        var submitterName = req.body.submitterName;
        var submitterDesignation = req.body.submitterDesignation;
        var submitterPhone = req.body.submitterPhone;
        var submitterEmail = req.body.submitterEmail;
        const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abcd1234",
    database: "dealRegistration"
})

app.listen(5000, function(req, res) {
    console.log('listening to port 5000');
})

app.get('/', function(req, res) {
    res.render('index');
})

app.get('/thanks', function(req, res) {
    res.render('thanks');
})

// Function for after submitting the form 
app.post('/submit', function(req, res) {

    const sql = 'SELECT MAX(dealNo) as maxNo FROM deals'

    con.query(sql, function(err, results) {   
        // information that had been send from form 
        var oppName = req.body.oppName;
        var oppValue = req.body.oppValue;
        var oppClosedate = req.body.oppClosedate;

        var custName = req.body.custName;
        var custAdd = req.body.custAdd;
        var custState = req.body.custState;
        var custCountry = req.body.custCountry;
        var custEmployee = req.body.custEmployee;
        var custVM = req.body.custVM;
        var custApps = req.body.custApps;
        var custBudget = req.body.custBudget;
        var closeDate = req.body.closeDate;
        
        var submitterReseller = req.body.submitterReseller;
        var submitterName = req.body.submitterName;
        var submitterDesignation = req.body.submitterDesignation;
        var submitterPhone = req.body.submitterPhone;
        var submitterEmail = req.body.submitterEmail;
        var submitterActivity = req.body.submitterActivity;


        // date and time
        const d = DateTime.local();

        const date = d.toLocaleString(DateTime.DATETIME_MED);

        dealNo = results[0].maxNo + 1;      
        
        var sql = `INSERT INTO deals (
            dealNo, 
            oppName, oppValue, oppClosedate, 
            custName, custAdd, custState, custCountry, custEmployee, custVM, custApps, custBudget, closeDate, 
            submitterReseller, submitterName, submitterDesignation, submitterPhone, submitterEmail, submitterActivity,
            dealRegStatus, dealRegExpiredate, dealRegSubmitdate, dealRegARdate, dealRegARby, dealRegARreason
            ) 
            VALUES (
                '${dealNo}', 
                '${oppName}', '${oppValue}, '${oppClosedate},
                '${custName}', '${custAdd}, '${custState}, '${custCountry}', ${custEmployee}', ${custVM}', ${custApps}', ${custBudget}','${closeDate}', 
                '${submitterReseller}', '${submitterName}', '${submitterDesignation}', '${submitterPhone}', '${submitterEmail}', '${submitterActivity}',
                'pending', 'none', '${date}', 'none', 'none', 'none'
            )`;

        con.query(sql, function(err, result) {
            if (err) throw err;
            res.redirect('/thanks');
        })
    })
})