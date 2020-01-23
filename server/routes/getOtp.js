const AuthServiceInstance = require('../authentication')
const validator = require('validator')
module.exports = async (req, res) => {
    let { email } = req.body
    email = String(email).toLowerCase()
    if(!validator.isEmail(email) || !email.endsWith('.gov.sg')) return res.sendStatus(400)
    const success = await AuthServiceInstance.getOTP({ email })
    return res.status(success ? 200 : 500).send({ status: success })
}