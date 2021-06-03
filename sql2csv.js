const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');
const dotenv = require('dotenv');
const cookiePaarser = require('cookie-parser');
const nodeoutlook = require('nodejs-nodemailer-outlook')
const Json2csvParser = require("json2csv").Parser;


dotenv.config({ path: './.env'});

const app = express();

let ejs = require('ejs');
var fs = require('fs');
const { getMaxListeners } = require('process');


app.set('view engine', 'ejs');
app.use(express.static('public'));
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


db.query("SELECT * FROM deals", function(error, data, fields) {
    if (error) throw error;

    const jsonData = JSON.parse(JSON.stringify(data))
    console.log("jsonData", jsonData)

    const json2csvParser = new Json2csvParser({ header: true});
    const csv = json2csvParser.parse(jsonData);

    fs.writeFile("deal_sql_2_csv.csv", csv, function(error) {
      if (error) throw error;
      console.log("Write to deal_sql_2_csv.csv successfully!");
    });
});