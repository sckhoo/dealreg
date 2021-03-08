const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

var con = mysql.createConnection({
    host: "calculator-mariadb",
    user: "root",
    password: "calculator-secret",
    database: "dealRegistration"
})

app.listen(5000, function(req, res) {
    console.log('listening to port 3000');
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
        var custName = req.body.custName;
        var country = req.body.country;
        var state = req.body.state;
        var totalEmployee = req.body.totalEmployee;
        var closeDate = req.body.closeDate;
        var reseller = req.body.reseller;
        var dealSubmitter = req.body.dealSubmitter;
        var revenue = req.body.revenue;

        // date and time
        const d = DateTime.local();

        const date = d.toLocaleString(DateTime.DATETIME_MED);

        dealNo = results[0].maxNo + 1;      
        
        var sql = `INSERT INTO deals (dealNo, oppName, endUser, country, state, totalEmployee, closeDate, reseller, submitter, revenue, status, username, submitTime, arTime, endTime, reason) VALUES ('${dealNo}', '${oppName}', '${custName}', '${country}', '${state}', '${totalEmployee}', '${closeDate}', '${reseller}','${dealSubmitter}', '${revenue}', 'pending', 'none', '${date}', 'none', 'none', 'none')`;

        con.query(sql, function(err, result) {
            if (err) throw err;
            res.redirect('/thanks');
        })
    })
})

app.get('/login', function(req, res) {
    res.render('login');
})

app.post('/login', function(req, res) {

        var username = req.body.username;
        var password = req.body.password;

        var sql = 'SELECT password FROM Admin WHERE username = ?';

        con.query(sql, [username], function (err, rows) {
            if (err) throw err;

		var pass = rows[0].password;

            if (password == pass){
                res.redirect('/admin?user='+username);
            } else {
                res.render('incorrect');
            }
        })
})

app.get('/admin', (req, res) => {

	const userName = req.query.user;

        var sql = ('SELECT * FROM deals');

        con.query(sql, function(err, result) {            
            res.render('admin', {user: userName, deal: result});
        })
})

app.get('/register', function(req, res) {
    res.render('register');
})

app.post('/register', function(req, res) {
    var username = req.body.username;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var password = req.body.password;
    var cpassword = req.body.cPassword;
    var email = req.body.email;

        var sql = 'SELECT * FROM Admin';

        con.query(sql, function (err, rows) {
            if (err) throw err;

                var user = rows[0].username;

            if (username != user){
                if (password == cpassword) {
                    var sql = `INSERT INTO Admin (username, fname, lname, password, email) VALUE ('${username}', '${fname}', '${lname}', '${password}', '${email}')`
                    con.query(sql, function(err, result) {
                        if (err) throw err;
                    })
                    res.redirect('/login');
                } else {
                    res.render('wrongPass');
                }
            } else {
                res.render('wrongUser');
            }
        })
})

app.get('/admin/:id/:user', function(req, res) {
    const id = req.params.id;
    const user = req.params.user;

    var sql = 'SELECT * FROM deals where dealNo = ?';

    con.query(sql, [id], function(err, result) {
	 res.render('details', { details:result, user:user });
    })
})

app.post('/accept/:id/:user', function(req, res) {

	const id = req.params.id;
	const userName = req.params.user;

    	//const userName = req.query.user;

        const d = DateTime.local();

        const date = d.toLocaleString(DateTime.DATETIME_MED);

	const username = userName;

    var sql = 'UPDATE deals SET status = "accept", username = ?, arTime = ? WHERE dealNo = ?';

    con.query(sql, [username, date, id], function(err, result) {
        if (err) throw err;
        res.redirect('/admin');
    })
})

app.post('/reject/:id/:user', function(req, res) {

	const id = req.params.id;
        const userName = req.params.user;

        const d = DateTime.local();

        const date = d.toLocaleString(DateTime.DATETIME_MED);

    var sql = 'UPDATE deals SET status = "reject", username = ?, arTime = ? WHERE dealNo = ?';

    con.query(sql, [userName, date, id], function(err, result) {
        if (err) throw err;
        res.redirect('/reason?id=' + id);
    })
})

app.post('/close/:id/:user', function(req, res){
    const id = req.params.id;
    const userName = req.params.user;

    const d = DateTime.local();

    const date = d.toLocaleString(DateTime.DATETIME_MED);

    var sql = 'UPDATE deals SET status = "closed", username = ?, endTime = ? WHERE dealNo = ?';

    con.query(sql, [userName, date, id], function(err, result) {
        if (err) throw err;
        res.redirect('/admin');
    })
})

app.get('/reason', function(req, res) { 
    var id = req.query.id;
    res.render('reason', {id : id});
})

app.post('/reason/:id', function(req, res) {
    const reason = req.body.reason;
    const id = req.params.id;

    var sql = 'UPDATE deals set reason = ? where dealNo = ?';

    con.query(sql, [reason, id], function(err, result) {
        if (err) throw err;
        res.redirect('/admin');
    })
})
