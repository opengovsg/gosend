const AuthService = require('./auth.service')
const MailService = require('./mail.service')
const { otpClient } = require('./redis')
const mailer = require('./mailer')

const mailSvc = new MailService(mailer)
const authSvc = new AuthService(otpClient, mailSvc)
module.exports = authSvc