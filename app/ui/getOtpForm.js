const html = require('choo/html');
const { platform } = require('../utils');
const validator = require('validator')
module.exports = function(state, emit){
    const hidden = platform() === 'android' ? 'hidden' : '';
    let submitting = false;
    return html`
          <form onsubmit=${submitEmail} data-no-csrf>
            <input
              id="email-input"
              type="email"
              class="${hidden} border rounded-lg w-full px-2 py-1 h-12 mb-3 text-lg text-grey-70 leading-loose dark:bg-grey-80 dark:text-white"
              placeholder=${state.translate('emailPlaceholder')}
            />
            <input
              class="btn rounded-lg w-full flex flex-shrink-0 items-center justify-center"
              value="${state.translate('signInGetOTPButton')}"
              title="${state.translate('signInGetOTPButton')}"
              id="email-submit"
              type="submit"
            />
          </form>
         
      </send-signup-dialog>
    `;

    function isGovEmail(str) {
      if (!str) {
        return false;
      }
      return validator.isEmail(str) && str.endsWith('.gov.sg')
    }

    function submitEmail(event) {
      event.preventDefault();
      if (submitting) {
        return;
      }
      submitting = true;

      const el = document.getElementById('email-input');
      const email = el.value;
      emit('getSignInOtp', isGovEmail(email) ? email : null);
    }
  };
