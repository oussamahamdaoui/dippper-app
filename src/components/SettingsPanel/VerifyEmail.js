const { html, $ } = require('@forgjs/noframework');
const Icon = require('../Icon');
const Loader = require('../loader');

const VerifyEmail = (eventManager) => {
  const DomElement = html`
    <div class="verifyEmail">
      <div class="icon">${Icon('send', 'feather-icons')}</div>
      <h1></h1>
      <p>
        Please click on the link to verify your email, if you can't find it check your spams.
        Your email and phone number will be used only in case you loose your privet key.
      </p>
      <div class="loader">${Loader()}</div>
      <div class="navButtons">
        <button class="button next">Next ${Icon('chevron-right', 'feather-icons')}</button>
        <button class="button prev">${Icon('chevron-left', 'feather-icons')}Prev</button>
      </div>
    </div>
  `;
  const title = $('h1', DomElement);
  const pElement = $('p', DomElement);


  eventManager.subscribe('next', (prevData) => {
    if (!prevData) return;
    title.innerText = prevData.usePhoneNumber ? 'Validate your email and phone' : 'Validate your email';
    pElement.innerText = prevData.usePhoneNumber
      ? `Please click on the links to verify your email and phone number, if you can't find it check your spams.
    Your email and phone number will be used only in case you loose your privet key.`
      : `Please click on the link to verify your email, if you can't find it check your spams.
      Your email and phone number will be used only in case you loose your privet key.`;
  });

  $('.next', DomElement).addEventListener('click', () => eventManager.emit('next'));
  $('.prev', DomElement).addEventListener('click', () => eventManager.emit('prev'));

  return DomElement;
};

module.exports = VerifyEmail;
