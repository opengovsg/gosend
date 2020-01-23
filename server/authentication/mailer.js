const config = require('../config')
const nodemailer = require('nodemailer')
const directTransport = require('nodemailer-direct-transport')
let mailer
if(!config.mail_host){
  console.info('Mailer: Using direct transport')
  mailer = nodemailer.createTransport(directTransport({ debug:true }))
}
else{
    if(config.mail_port && config.mail_user && config.mail_pass){
    console.info('Mailer: Using SMTP transport')
    mailer = nodemailer.createTransport({
        host:config.mail_host,
        port:config.mail_port,
        auth: {
            user: config.mail_user,
            pass: config.mail_pass
        }
    })
  }
  else{
    console.error('Mailer: Missing values in config.mailOptions')
    process.exit(1)
  }
}
module.exports = mailer