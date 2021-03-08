var nodeoutlook = require('nodejs-nodemailer-outlook')
const dotenv = require('dotenv');

dotenv.config({ path: './.env'});

console.log("working directory is " + __dirname);

console.log(process.env.EMAIL_USER);

nodeoutlook.sendEmail({
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        from: process.env.EMAIL_USER,
        to: 'sckhoo@gmail.com',
        subject: process.env.EMAIL_USER,
        html: '<b>This is bold text</b>',
        text: 'This is text version!',
        replyTo: process.env.EMAIL_USER,
        
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
);