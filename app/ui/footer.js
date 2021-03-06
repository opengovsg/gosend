const html = require('choo/html');
const Component = require('choo/component');
const version = require('../../package.json').version;
const { browserName } = require('../utils');

class Footer extends Component {
  constructor(name, state) {
    super(name);
    this.state = state;
  }

  update() {
    return false;
  }

  createElement() {
    const translate = this.state.translate;
    const browser = browserName();
    const feedbackUrl = `https://qsurvey.mozilla.com/s3/Firefox-Send-Product-Feedback?ver=${version}&browser=${browser}`;
    return html`
      <footer
        class="flex flex-col md:flex-row items-start w-full flex-none self-start p-6 md:p-8 font-medium text-xs text-grey-60 dark:text-grey-40 md:items-center justify-between"
      >
        <a class="mozilla-logo m-2" href="https://www.mozilla.org/">
          Mozilla
        </a>
        <ul
          class="flex flex-col md:flex-row items-start md:items-center md:justify-end"
        >
          <li class="m-2">
          <a href="https://github.com/mozilla/send" _target="blank"  rel="noreferrer noopener">
            Send.go.gov.sg is powered by Mozilla Send 
          </a>
          </li>
          <li class="m-2">
            <a href="https://go.gov.sg">
            Go.gov.sg
            </a>
          </li>
          <li class="m-2">
            <a href="https://form.gov.sg">Form.gov.sg</a>
          </li>
        
        </ul>
      </footer>
    `;
  }
}

module.exports = Footer;
