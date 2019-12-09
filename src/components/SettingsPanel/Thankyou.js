const { html, $ } = require('@forgjs/noframework');
const Icon = require('../Icon');


const Thankyou = (eventManager) => {
  const DomElement = html`
  <div class="thankyou">
    <img src="../media/logo.png"/>
    <h1>Thank you for trying out <span class="KhandBold">Dipppēr</span></h1>
    <p>
      We are concerned by your security and your privacy,
      these steps will to generate your public and privet RSA keys, they will ensure that only you and
      your contacts can read the messages. If you want to know more about how this works see the <a href="#">documentation</a>
    </p>
    <div class="navButtons">
      <button class="button next">Next ${Icon('chevron-right', 'feather-icons')}</button>
    </div>
  </div>
  `;
  $('.next', DomElement).addEventListener('click', () => eventManager.emit('next'));

  return DomElement;
};

module.exports = Thankyou;
