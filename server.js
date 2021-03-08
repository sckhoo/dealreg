const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');
const dotenv = require('dotenv');
const cookiePaarser = require('cookie-parser');
const nodeoutlook = require('nodejs-nodemailer-outlook')


dotenv.config({ path: './.env'});

const app = express();

let ejs = require('ejs');
var fs = require('fs');
const { getMaxListeners } = require('process');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookiePaarser());

console.log("working directory is " + __dirname);



var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect( (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Database connected " + process.env.DATABASE_HOST + " " + process.env.DATABASE )
    }
})


app.listen(5000, function(req, res) {
    console.log('listening to port 5000');
})

//sendmail(102, "sckhoo@gmail.com");

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// Function for after submitting the form 
app.post('/submit', function(req, res) {

    const sql = 'SELECT MAX(dealNo) as maxNo FROM deals'

    db.query(sql, function(err, results) {   

        // information that had been send from form 
        var oppName = req.body.oppName;
        var oppValue = req.body.oppValue;
        var oppClosedate = req.body.closeDate;

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


        if ( !oppName || !oppValue || !closeDate || !custName || !submitterReseller || !submitterName || !submitterEmail ) {
            return res.status(400).render('dealreg', {
                msg: "Require Opportunity name, Prospect name, Prospect's close data, Reseller name, Reseller contact person and email"
            })
        }

        if ( !custVM ) {
            custVM = 0;
        }

        if ( !custBudget ) {
            custBudget = oppValue;
        }

        if ( !oppClosedate ) {
            oppClosedate = closeDate;
        }

        // date and time
        const d = DateTime.local();
        const date = d.toSQL({ includeOffset: false});
        //const date = d.toLocaleString(DateTime.DATETIME_MED);

        //var date;
        //date = new Date.now().toISOString().slice(0, 19).replace('T', ' ');
        
        //dealNo = results[0].maxNo + 1;      
        
        var sql = `INSERT INTO deals 
        ( 
          oppName, oppValue, oppClosedate,
          custName, custAdd, custState, custCountry, custEmployee, custVM, custApps, custBudget, closeDate,
          submitterReseller, submitterName, submitterDesignation, submitterPhone, submitterEmail, submitterActivity, dealRegStatus, dealRegSubmitdate ) 
          VALUES ( 
            '${oppName}', '${oppValue}', '${oppClosedate}', 
            '${custName}', '${custAdd}', '${custState}', '${custCountry}', '${custEmployee}', '${custVM}', '${custApps}', '${custBudget}','${closeDate}',
            '${submitterReseller}', '${submitterName}', '${submitterDesignation}', '${submitterPhone}', '${submitterEmail}', '${submitterActivity}', 'pending','${date}' )`;

        db.query(sql, function(err, result) {
            if (err) throw err;
            //console.dir(result, { depth: null });
            console.log(result.insertId);

            var sql = 'SELECT * FROM deals WHERE dealNo = ?';


            

            db.query(sql, [result.insertId], function(err, result) {
                if (err) throw err;
                console.log(result[0].dealNo);
                // sending email
                var compiled = ejs.compile( fs.readFileSync( __dirname + '\\views\\emaildeal.ejs', 'utf8'));
                var htmlToSend = compiled( { deal : result });
                console.log("sending email........");
                nodeoutlook.sendEmail({
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    },
                    from: process.env.EMAIL_USER,
                    to: result[0].submitterEmail,
                    cc: "dealreg@avmcloud.net",
                    subject: "AVM Deal registered : Reference number is " + result[0].dealNo,
                    html: htmlToSend,

                    //text: 'Pending Approval',
                    replyTo: process.env.EMAIL_USER,
                    
                    onError: (e) => console.log(e),
                    onSuccess: (i) => console.log(i)
                });  
                // finish sending email
                res.render('displaydeal', { deal : result });
            })

            //res.render('displaydeal');
            //res.redirect("/displaydeal");
        })
    })
})

function sendmail(dealid, emailto) {
    console.log("inside sendmail function");
    var sql = 'SELECT * FROM deals WHERE dealNo = ?';
    db.query(sql, dealid, function(err, result) {
        if (err) throw err;
        console.log(dealid);
        console.log(emailto);
        var compiled = ejs.compile( fs.readFileSync( __dirname + '\\views\\emaildeal.ejs', 'utf8'));
        var htmlToSend = compiled( { deal : result });
        console.log("sending email........");
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            from: process.env.EMAIL_USER,
            to: emailto,
            cc: "khoosc@avmcloud.net",
            subject: "AVM Deal Registration",
            html: htmlToSend,
            replyTo: process.env.EMAIL_USER,

            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        });  
    })
}




app.post('/accept/:id/:email', function(req, res) {

	const id = req.params.id;
	const email = req.params.email;

    //const userName = req.query.user;

    const d = DateTime.local();

    //const date = d.toLocaleString(DateTime.DATETIME_MED);

    const date = d.toSQL({ includeOffset: false});

    var sql = 'UPDATE deals SET dealRegStatus = "accept", dealRegARby = ?, dealRegARdate = ? WHERE dealNo = ?';

    db.query(sql, [email, date, id], function(err, result) {
        if (err) throw err;
        var sql = 'SELECT * FROM deals WHERE dealNo = ?';
        db.query(sql, id, function(err, result) {
            if (err) throw err;      
            sendmail(id, result[0].submitterEmail);
        })
        var sql = ('SELECT * FROM deals');
        db.query(sql, function(err, result) {            
            res.render('avmdealadmin', {email: email, deal: result});
        })
        sendmail(id, email);
    })
})

app.post('/close/:id/:email', function(req, res){
    const id = req.params.id;
    const email = req.params.email;

    const d = DateTime.local();

    const date = d.toSQL({ includeOffset: false});

    var sql = 'UPDATE deals SET dealRegStatus = "closed", dealRegARby = ?, dealRegARdate = ? WHERE dealNo = ?';

    db.query(sql, [email, date, id], function(err, result) {
        if (err) throw err;
        var sql = 'SELECT * FROM deals WHERE dealNo = ?';
        db.query(sql, id, function(err, result) {
            if (err) throw err;      
            sendmail(id, result[0].submitterEmail);
        })
        var sql = ('SELECT * FROM deals');
        db.query(sql, function(err, result) {            
            res.render('avmdealadmin', {email: email, deal: result});
        })
        sendmail(id, email);
    })
})

app.post('/reject/:id/:email', function(req, res) {

	const id = req.params.id;
    const email = req.params.email;

    const d = DateTime.local();

    const date = d.toSQL({ includeOffset: false});

    var sql = 'UPDATE deals SET dealRegStatus = "reject", dealRegARby = ?, dealRegARdate = ? WHERE dealNo = ?';

    db.query(sql, [email, date, id], function(err, result) {
        if (err) throw err;
        var sql = 'SELECT * FROM deals WHERE dealNo = ?';
        db.query(sql, id, function(err, result) {
            if (err) throw err;      
            sendmail(id, result[0].submitterEmail);
        })
        res.redirect('/reason?id=' + id);
    })
})



app.post('/reason/:id', function(req, res) {
    const reason = req.body.reason;
    const id = req.params.id;

    var sql = 'UPDATE deals set dealRegARreason = ? where dealNo = ?';
    console.log(reason)
    db.query(sql, [reason, id], function(err, result) {
        if (err) throw err;
        res.redirect('/avmlogin');
    })
})

