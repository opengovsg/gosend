const bcrypt = require('bcrypt')
const crypto = require('crypto')
module.exports = class AuthService {
    constructor(
     otpClient,
     mailService
    ){
        this.otpClient = otpClient
        this.mailService = mailService
        this.SALT_ROUNDS = 10
        this.EXPIRY_IN_SECONDS = 300 //expires after 5 minutes
        this.RETRIES = 4
    }
    /**
     * Sends an otp to the user
     * @param input.email {String} 
     */
     async getOTP(input) {
      try {
  
        const otp = this.generateOTP()
  
        const hash = await this.hash(otp)
        
        const hashedOtp=  { hash, retries: this.RETRIES }
  
        await this.saveHashedOTP(input.email, hashedOtp)
  
        await this.mailService.send({
          recipients: [input.email],
          subject: 'One-Time Password (OTP) for Send.go.gov.sg',
          body: `Your OTP is <b>${otp}</b>. It will expire in ${Math.floor(this.EXPIRY_IN_SECONDS / 60)} minutes. 
          Please use this to login to your Send.go.gov.sg account. <p>If your OTP does not work, please request for a new OTP.</p>`,
        })
  
        return true
      }
      catch (err){
        console.error(err)
        return false
      }
    }
    /**
     * Checks that the otp exists, is correct, or removes it if no more retries are available for that the otp
     * @param input.otp
     * @param input.email
     */
     async verifyOTP(input) {
      try {
        const hashedOtp=  await this.getHashedOTP(input.email)
        const authorized= await bcrypt.compare(input.otp, hashedOtp.hash)
          .then(async (result) => {
            if(!result){
              hashedOtp.retries -= 1
              if(hashedOtp.retries > 0){
                await this.saveHashedOTP(input.email, hashedOtp)
              }
              else{
                await this.deleteHashedOTP(input.email)
              }
              return false
            }
            else{
              return true
            }
          })
        return authorized
      }
      catch(err) {
        console.error(err)
        return false
      }
    }
    /**
     * Finds or creates user
     */
     async getUser(email) {
      try{
        // const [user] = await User.findOrCreate({ where: { email } })
        await this.deleteHashedOTP(email)
        return { email }
      } 
      catch(err){
        console.error(err)
        return null
      }
    }
    /**
     * Generates a six digit otp
     * @returns otp
     */
     generateOTP() {
      const length = 6
      const chars = '0123456789'
      // Generates cryptographically strong pseudo-random data.
      // The size argument is a number indicating the number of bytes to generate.
      const rnd = crypto.randomBytes(length)
      const d= chars.length / 256
      const value= new Array(length)
      for (let i = 0; i < length; i += 1) {
        value[i] = chars[Math.floor(rnd[i] * d)]
      }
      return value.join('')
    }
    /**
     * Hashes a value using bcrypt
     * @param value 
     */
     async hash(value) {
      return new Promise((resolve, reject) => {
        bcrypt.hash(value, this.SALT_ROUNDS, (error, hash) => {
          if(error){
            console.error(`Failed to hash value: ${error}`)
            reject(error)
          }
          resolve(hash)
        })
      })
    }
    /**
     * Saves email:hashedOtp in the otp cache
     * @param email 
     * @param hashedOtp.hash
     * @param hashedOtp.retries 
     */
     async saveHashedOTP(email, hashedOtp) {
      return new Promise((resolve, reject) => {
        this.otpClient.set(email, JSON.stringify(hashedOtp), 'EX', this.EXPIRY_IN_SECONDS, (error) => {
          if(error){
            console.error(`Failed to save hashed otp: ${error}`)
            reject(error)
          }
          resolve(true)
        })
      })
    }
    /**
     * Deletes the record keyed by email in the otp cache
     * @param email 
     */
     async deleteHashedOTP(email) {
      return new Promise((resolve, reject) => {
        this.otpClient.del(email, (error, response) => {
          if(error || response !== 1){
            console.error(`Failed to delete hashed otp: ${error}`)
            reject(error)
          }
          resolve(true)
        })
      })
    }
    /**
   * Gets the record keyed by email in the otp cache
   * @param email 
   */
     async getHashedOTP(email) {
      return new Promise((resolve, reject) => {
        this.otpClient.get(email, (error, value) => {
          if(error){
            console.error(`Failed to get hashed otp: ${error}`)
            reject(error)
          }
          if(value === null){
            console.error(`Failed to get hashed otp - value was ${value}`)
            reject(new Error('hashedOtp was null'))
          }
          resolve(JSON.parse(value))
        })
      })
    }
  
  }