const html = require('choo/html');
const { platform } = require('../utils');
const validator = require('validator')
module.exports = function(state,emit) {
    const email = state.user.otpEmail
    const hidden = platform() === 'android' ? 'hidden' : '';
    let submitting = false;
    return html`
          <form onsubmit=${submitOtp} data-no-csrf>
            <input
              id="email-input"
              type="email"
              value="${email}"
              disabled
              class="hidden border rounded-lg w-full px-2 py-1 h-12 mb-3 text-lg text-grey-70 leading-loose dark:bg-grey-80 dark:text-white"
            />
            <input
                id="otp-input"
                type="text"
                class="${hidden} border rounded-lg w-full px-2 py-1 h-12 mb-3 text-lg text-grey-70 leading-loose dark:bg-grey-80 dark:text-white"
                placeholder="123456"
            />
            <input
              class="btn rounded-lg w-full flex flex-shrink-0 items-center justify-center"
              value="${state.translate('signInOnlyButton')}"
              title="${state.translate('signInOnlyButton')}"
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

    function isOtp(str){
        if (!str) {
            return false;
        }
        return /^[0-9]{6}$/.test(str)
    }

    function submitOtp(event) {
      event.preventDefault();
      if (submitting) {
        return;
      }
      submitting = true;

      const el = document.getElementById('email-input');
      const email = el.value;
      const otpEl = document.getElementById('otp-input');
      const otp = otpEl.value;
      emit('verifySignInOtp', isGovEmail(email) && isOtp(otp)  ? {email, otp} : null);
    }
  };
