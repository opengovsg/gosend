const redis = require('redis')
const config = require('../config')
if (!config.redis_host || !config.redis_host.startsWith('redis://')) {
    console.error('Invalid redis host for session and otp client')
    process.exit(1)
}

const sessionClient = redis.createClient({ url: config.redis_host + "/1" })
    .on('connect', () => {
        console.info('sessionClient: Connected')
    })
    .on('error', (err) => {
        console.error(String(err))
    })


const otpClient = redis.createClient({ url: config.redis_host + "/2" })
    .on('connect', () => {
        console.info('otpClient: Connected')
    })
    .on('error', (err) => {
        console.error(String(err))
    })

module.exports = {
    sessionClient,
    otpClient
}