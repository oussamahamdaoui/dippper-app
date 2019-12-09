const { html, $ } = require('@forgjs/noframework');
const { Rule, Validator } = require('@cesium133/forgjs');
const config = require('../../config');
const {
  EventEmitter, events: {
    IS_USERNAME_AVAILABLE, USERNAME_AVAILABLE, SIGN_IN, SIGNED_IN,
  },
} = require('../../EventEmitter');


const Icon = require('../Icon');

const Info = (eventManager) => {
  const DomElement = html`
  <div class="info">
  <div class="icon">${Icon('user', 'feather-icons')}</div>
  <h1>Choose your username</h1>
  <input class="input username" type="text" placeholder="Username" name="username">
  <label class="label">
    <input type="checkbox" class="checkbox" name="termsAndConditions">
    Accept
    <a href="#">terms and conditions</a>
  </label>
  <div class="navButtons">
    <button class="button next" disabled>Next ${Icon('chevron-right', 'feather-icons')}</button>
    <button class="button prev">${Icon('chevron-left', 'feather-icons')}Prev</button>
  </div>
</div>
  `;
  const info = {};
  const next = $('.next', DomElement);
  const infoValidator = new Validator({
    username: new Rule({ type: 'string', minLength: 5, maxLength: 20 }),
    termsAndConditions: new Rule({ type: 'boolean', toBe: true }),
  });


  const validate = (e) => {
    info[e.getAttribute('name')] = e.type === 'checkbox' ? e.checked : e.value;
    if (infoValidator.test(info)) {
      next.removeAttribute('disabled');
    } else {
      next.setAttribute('disabled', true);
    }
  };

  $('.next', DomElement).addEventListener('click', () => {
    EventEmitter.emit(IS_USERNAME_AVAILABLE, info.username);
  });

  EventEmitter.subscribe(USERNAME_AVAILABLE, (isAvailable) => {
    if (isAvailable) {
      EventEmitter.emit(SIGN_IN, {
        username: info.username,
      });
    }
  });

  EventEmitter.subscribe(SIGNED_IN, ({ username }) => {
    if (username) {
      config.set('user.username', username).write();
      eventManager.emit('done');
    }
  });


  $('.prev', DomElement).addEventListener('click', () => eventManager.emit('prev'));

  $('.checkbox', DomElement).addEventListener('change', ({ target }) => {
    validate(target);
  });

  $('.username', DomElement).addEventListener('keyup', async ({ target }) => {
    validate(target);
  });

  return DomElement;
};

module.exports = Info;
