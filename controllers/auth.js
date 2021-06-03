const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if ( !email || !password ) {
            return res.status(400).render('login', { msg: "Please provide email and password" })
        }

        db.query('Select * FROM users WHERE email = ?', [email], async (error, results) => {
                console.log(results);
                if ( !results || !(await bcrypt.compare(password, results[0].password))) {
                   res.status(401).render('login', { msg: "Email or password is incorrect" });
                } else {
                    res.status(200).render('dealreg', { msg: "Please note that inaccurate or incomplete information will cause your Deal Registration application to be rejected" });
                }
            })
    } catch (error) {
        console.log(error);
        }
    }


exports.register = (req, res) => {
    //console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error)
        } 

        if ( results.length > 0) {
            return res.render('register', {
                msg: "That email already registered"
            })
        } else if ( password !== passwordConfirm ) {
            return res.render('register', {
                msg: "Passwords do not match"
            })
        } else if ( !name || !email || !password ) {
            return res.render('register', {
                msg: "Missing data"
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password:hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    msg: "User registered"
                });
            }
        })

    })

}

////////////

exports.avmlogin = async (req, res) => {
    try {
        
        const { email, password } = req.body;
        if ( !email || !password ) {
            return res.status(400).render('avmlogin', {
                msg: "Please provide email and password"
            })
        }
        //console.log("email is " + email);
        db.query('Select * FROM admin WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if ( !results || !(await bcrypt.compare(password, results[0].password))) {
               res.status(401).render('avmlogin', {
                    msg: "Email or password is incorrect"
            })
        } else {
            var sql = ('SELECT * FROM deals');
            db.query(sql, function(err, result) {            
                res.render('avmdealadmin', {email: email, deal: result});
            })
        }})

    } catch (error) {
        console.log(error)
    }
}

exports.avmregister = (req, res) => {
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM admin WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error)
        } 

        if ( results.length > 0) {
            return res.render('avmregister', {
                msg: "That email already registered"
            })
        } else if ( (password !== passwordConfirm) || !password ) {
            return res.render('avmregister', {
                msg: "Passwords do not match"
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO admin SET ?', { name: name, email: email, password:hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('avmlogin', {
                    msg: "User registered"
                });
            }
        })

    })

}