const { html, $, EventManager } = require('@forgjs/noframework');
const config = require('../../config');
const { EventEmitter, events: { LOGIN } } = require('../../EventEmitter');


const Thankyou = require('./Thankyou');
const GettingStarted = require('./GettingStarted');
const Info = require('./Info');
// const VerifyEmail = require('./VerifyEmail');
const License = require('./License');
// const ChooseAvatar = require('./ChooseAvatar');


const SettingsPanel = () => {
  const eventManager = new EventManager();
  const user = config.get('user').value();

  const DomElement = html`
    <div class="settings-panel-backdrop">
      <div class="settings-panel">
        ${Thankyou(eventManager)}
        ${GettingStarted(eventManager)}
        ${Info(eventManager)}
        ${License(eventManager)}
      </div>
    </div>
  `;

  // ${Info(eventManager)}
  // ${ChooseAvatar(eventManager)}
  // ${VerifyEmail(eventManager)}
  // ${License(eventManager)}

  let selected = $('.thankyou', DomElement);

  eventManager.subscribe('next', (props) => {
    if (selected.nextElementSibling) {
      selected.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'center' });
      selected = selected.nextElementSibling;
      eventManager.emit('loaded', selected, props);
    }
  });

  eventManager.subscribe('prev', () => {
    if (selected.previousElementSibling) {
      selected.previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'center' });
      selected = selected.previousElementSibling;
      eventManager.emit('loaded', selected);
    }
  });

  eventManager.subscribe('done', async () => {
    DomElement.classList.add('hide');
    config.set('user.verified', true).write();
    EventEmitter.emit(LOGIN);
  });

  if (user.verified) {
    eventManager.emit('done');
  }

  return DomElement;
};

module.exports = SettingsPanel;
