const html = require('choo/html');
const Component = require('choo/component');
const assets = require('../../common/assets');

class Promo extends Component {
  constructor(name, state) {
    super(name);
    this.state = state;
  }

  update() {
    return false;
  }

  createElement() {
    return html`
      <send-promo
        class="w-full flex-row items-center content-center justify-center bg-white text-grey-80 px-4 py-3 flex border-b border-grey-banner leading-normal dark:bg-grey-90 dark:text-grey-20 dark:border-grey-80"
      >
        <div class="flex items-center mx-auto">
          <span class="ml-2 sm:ml-4 text-xs sm:text-base">
            ${this.state.translate('trailheadPromo')}${' '}
            <a
              class="underline link-blue"
              href="https://go.gov.sg/send-feedback"
              target="_blank"
              rel="noopener noreferrer"
              >${this.state.translate('sendFeedback')}</a
            >
          </span>
        </div>
      </send-promo>
    `;
  }
}

module.exports = Promo;
