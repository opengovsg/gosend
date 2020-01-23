const html = require('choo/html');
const modal = require('./modal');
const signupDialog = require('./signupDialog')

module.exports = function(state, emit) {
  state.modal = signupDialog({});
  return html`
    <main class="main">
      ${state.modal && modal(state, emit)}
    </main>
  `;
};
