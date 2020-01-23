const AuthServiceInstance = require('../authentication')
const validator = require('validator')
module.exports = async (req, res) => {
    let { email, otp } = req.body
    email = String(email).toLowerCase()
    if(!validator.isEmail(email) || !email.endsWith('.gov.sg')  || !/^[0-9]{6}$/.test(otp) ) return res.sendStatus(400)
    const authorized = await AuthServiceInstance.verifyOTP({ email, otp })
    if(authorized){
      const user = await AuthServiceInstance.getUser(email)
      if(user!==null && req.session){
        req.session.user = user
        return res.sendStatus(200)
      }
      else{
        return res.sendStatus(401)
      }
    }
    else{
      return res.sendStatus(401)
    }
}