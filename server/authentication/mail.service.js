module.exports = class MailService {
  constructor(mailer){
      this.mailer = mailer
  }
   async send(input) {
    try {
      const sent= await new Promise((resolve,reject) => {
        this.mailer.sendMail({
          from: 'GoSend <donotreply@mail.go.gov.sg>',
          to: input.recipients,
          subject: input.subject,
          html: input.body,
        }, (err, info) => {
          if(err != null){
            console.error(String(err))
            reject(err)
          }
          else{
            console.info(info)
            resolve(true)
          }
        })
      })
      return sent
    }
    catch (err) {
      console.error(err)
      return false
    }
  }
}