const connectRedis = require('connect-redis')
const session = require('express-session')
const { sessionClient } = require('../authentication/redis')
const config = require('../config')
if(!config.session_secret){
    console.error('session_secret required but missing')
    process.exit(1)
}

const SessionStore = connectRedis(session)
const sessionOptions = {
name: 'gosend',
secret: config.session_secret,
store: new SessionStore({
    client: sessionClient,
    logErrors: true,
}),
resave: true,
saveUninitialized: false,
cookie: {
    httpOnly: true,
    secure: config.env !== 'development',
    maxAge:  24 * 60 * 60 * 1000, // 24 hours,
    sameSite: true,
},
}

module.exports = session(sessionOptions)