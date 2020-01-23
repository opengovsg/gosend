const choo = require('choo');
const download = require('./ui/download');
const body = require('./ui/body');
module.exports = function(app = choo({ hash: true })) {
  app.route('/', body(require('./ui/homeSignin')));
  app.route('/download/:id', body(download));
  app.route('/download/:id/:key', body(download));
  app.route('/unsupported/:reason', body(require('./ui/unsupported')));
  app.route('/legal', body(require('./ui/legal')));
  app.route('/error', body(require('./ui/error')));
  app.route('/blank', body(require('./ui/blank')));
  app.route('/login', body(require('./ui/homeSignin')));
  app.route('*', body(require('./ui/notFound')));
  app.route('/upload', body(require('./ui/home')));
  return app;
};
