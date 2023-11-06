const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
require('dotenv').config()

const sendValidationCodeEmail = async (mail, validationCode, mailSuccess) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: process.env.mailerUser, 
            pass: process.env.mailerPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    transporter.use('compile', hbs({
        extName: '.handlebars',
        viewPath: './layouts/validationCode/',
        viewEngine: {
            extName: '.handlebars',
            layoutsDir: './layouts/validationCode/',
            defaultLayout: 'validationCode',
            partialsDir: './layouts/validationCode/'
        },
    }))
    const callback = (error) => {
        mailSuccess(error ? false : true)
    }
    transporter.sendMail({
        from: '"login-mft ✔" <seba.coppola02@gmail.com>',
        to: mail,
        subject: "Validation Code!",
        template: "validationCode",
        context: {
            validationCode: validationCode,
        }
    }, callback)
}

const sendRecoveryCodeEmail = async (mail, validationCode, mailSuccess) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: process.env.mailerUser, 
            pass: process.env.mailerPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    transporter.use('compile', hbs({
        extName: '.handlebars',
        viewPath: './layouts/retrievePassword/',
        viewEngine: {
            extName: '.handlebars',
            layoutsDir: './layouts/retrievePassword/',
            defaultLayout: 'forgotenPass',
            partialsDir: './layouts/retrievePassword/'
        },
    }))
    const callback = (error) => {
        mailSuccess(error ? false : true)
    }
    transporter.sendMail({
        from: '"login-mft ✔" <seba.coppola02@gmail.com>',
        to: mail,
        subject: "Forgoten Password?",
        template: "forgotenPass",
        context: {
            validationCode: validationCode,
        }
    }, callback)
}

module.exports = { sendValidationCodeEmail, sendRecoveryCodeEmail }