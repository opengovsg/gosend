const html = require('choo/html');
const modal = require('./modal');
const signinDialog = require('./signinDialog')

module.exports = function(state, emit) {
  state.modal = signinDialog();
  return html`
    <main class="main">
      ${state.modal && modal(state, emit)}
    </main>
  `;
};
