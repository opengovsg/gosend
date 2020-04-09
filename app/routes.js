const choo = require('choo');
const download = require('./ui/download');
const body = require('./ui/body');
const homeSignin = require('./ui/homeSignin')
const upload = require('./ui/home')

function auth (onAuth, onPublic) {
  return function (state, emit){
    return (state.user.isSignedInWithOtp() ? onAuth : onPublic)(...arguments)
  }
}

module.exports = function(app = choo({ hash: true })) {
  app.route('/', auth(body(upload), body(homeSignin)));
  app.route('/download/:id', body(download));
  app.route('/download/:id/:key', body(download));
  app.route('/unsupported/:reason', body(require('./ui/unsupported')));
  app.route('/legal', body(require('./ui/legal')));
  app.route('/error', body(require('./ui/error')));
  app.route('/blank', body(require('./ui/blank')));
  app.route('/login', body(homeSignin));
  app.route('*', body(require('./ui/notFound')));
  app.route('/upload', body(upload));
  return app;
};
