const html = require('choo/html');
const assets = require('../../common/assets');
const { bytes } = require('../utils');
const validator = require('validator')
const getOtpForm = require('./getOtpForm')
const verifyOtpForm = require('./verifyOtpForm')
module.exports = function() {
  return function(state, emit, close) {
    const DAYS = Math.floor(state.LIMITS.MAX_EXPIRE_SECONDS / 86400);
    const form = state.user.otpEmail !== '' ? verifyOtpForm(state, emit) : getOtpForm(state, emit)
    let submitting = false;
    return html`
      <send-signup-dialog
        class="flex flex-col lg:flex-row justify-center px-8 md:px-24 w-full h-full"
      >
        <img src="${assets.get('go-icon.svg')}" class="h-16 mt-1 mb-4" />
        <section
          class="flex flex-col flex-shrink-0 self-center lg:mx-6 lg:max-w-xs"
        >
          <h1 class="text-3xl font-bold text-center lg:text-left">
            ${state.translate('accountBenefitTitle')}
          </h1>
          <ul
            class="leading-normal list-disc text-grey-80 my-2 mt-4 pl-4 md:self-center dark:text-grey-40"
          >
            <li>${state.translate('accountBenefitDownloadCount')}</li>
            <li>
              ${state.translate('accountBenefitTimeLimit', { count: DAYS })}
            </li>
            <li>${state.translate('upcomingFeatureTitle')} ${state.translate('upcomingFeature1')}</li>
          </ul>
        </section>
        <section
          class="flex flex-col flex-grow m-4 md:self-center md:w-128 lg:max-w-xs"
        >
              ${form}
          <button
            class="my-3 link-blue font-medium"
            title="${state.translate('deletePopupCancel')}"
            onclick=${cancel}
          >
            ${state.translate('deletePopupCancel')}
          </button>
        </section>
      </send-signup-dialog>
    `;

    function isGovEmail(str) {
      if (!str) {
        return false;
      }
      return validator.isEmail(str) && str.endsWith('.gov.sg')
    }

    function cancel(event) {
      close(event);
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
};
