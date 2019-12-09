const { html, $ } = require('@forgjs/noframework');
const config = require('../../config');
const Icon = require('../Icon');
const { generatePublicPrivateKey } = require('../../crypto');
const { clipboard } = require('electron')


const GettingStarted = (eventManager) => {
  const user = config.get('user').value();
  const DomElement = html`
  <div class="gettingStarted">
    <div class="icon">${Icon('shield', 'feather-icons')}</div>
    <h1>RSA keys</h1>
    <div class="keys">
      <div class="key">
        <div class="copy-icon"><span>Click to copy</span> ${Icon('clipboard', 'feather-icons')}</div>        
        <div class="public">${user.publicKey}</div>
      </div>
      <div class="key">
        <div class="copy-icon"><span>Click to copy</span> ${Icon('clipboard', 'feather-icons')}</div>
        <div class="private">${user.privateKey}</div>
      </div>
    </div>
    <div class="navButtons">
      <button class="button next" ${user.publicKey ? '' : 'disabled'}>Next ${Icon('chevron-right', 'feather-icons')}</button>
      <button class="button prev">${Icon('chevron-left', 'feather-icons')}Prev</button>
    </div>
  </div>`;
  $('.next', DomElement).addEventListener('click', () => eventManager.emit('next', {
    publicKey: config.get('user.publicKey').value(),
  }));
  $('.prev', DomElement).addEventListener('click', () => eventManager.emit('prev'));

  eventManager.subscribe('loaded', async (item) => {
    if (item !== DomElement || user.publicKey) return;
    const { publicKey, privateKey } = await generatePublicPrivateKey();
    $('.public', DomElement).innerText = publicKey;
    $('.private', DomElement).innerText = privateKey;
    config.set('user.publicKey', publicKey).value();
    config.set('user.privateKey', privateKey).value();
    config.get('friends').push({ username: 'me', publicKey }).write();
    config.write();
    $('.next', DomElement).removeAttribute('disabled');
  });

  $('.keys', DomElement).addEventListener('click', ({ target }) => {
    clipboard.writeText($('.public', DomElement).innerText);
    target.closest('.key').classList.add('selected');
    setTimeout(() => {
      target.closest('.key').classList.remove('selected');
    }, 300);
  });

  return DomElement;
};

module.exports = GettingStarted;
