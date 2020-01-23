const express = require('express');
const path = require('path');
const Sentry = require('@sentry/node');
const config = require('../config');
const routes = require('../routes');
const pages = require('../routes/pages');
const expressWs = require('@dannycoates/express-ws');
const validator = require('validator')
const sessionParser = require('../routes/session')

if (config.sentry_dsn) {
  Sentry.init({ dsn: config.sentry_dsn });
}

const isLoggedIn = (req) => {
  if(req.session && req.session.user && req.session.user.email){
    return validator.isEmail(req.session.user.email) && req.session.user.email.endsWith('.gov.sg')
  }
  return false
}
const app = express();

expressWs(app, null, { perMessageDeflate: false, wsOptions: {
  verifyClient: function(info, done){
    sessionParser(info.req, {}, ()=>{
      if(isLoggedIn(info.req)){
        return done(true)
      }
      return done(false, 401, 'Failed')
    })
  }
} });
routes(app);
app.ws('/api/ws', require('../routes/ws'));

app.use(
  express.static(path.resolve(__dirname, '../../dist/'), {
    setHeaders: function(res, path) {
      if (!/serviceWorker\.js$/.test(path)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
      res.removeHeader('Pragma');
    }
  })
);

app.use(pages.notfound);

app.listen(config.listen_port, config.listen_address);
