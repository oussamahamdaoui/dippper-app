const { html, $ } = require('@forgjs/noframework');
const Icon = require('../Icon');
const config = require('../../config');
const Friends = require('./Friends');


const Sidebar = () => {
  const DomElement = html`
  <div class="sidebar">
    <div class="sidebar__logo">
      <img src="../media/logo.png">
      <span>Dipppēr</span>
      <button class="sidebar__logo__button toggle-light-mode">${Icon('sun', 'feather-icons')}</button>
      <button class="sidebar__logo__button log-out">${Icon('power', 'feather-icons')}</button>
    </div>
    ${Friends}
  </div>`;

  $('.toggle-light-mode', DomElement).classList.add(config.get('theme').value() === 'light' ? 'selected' : null);

  $('.sidebar__logo', DomElement).addEventListener('click', (evt) => {
    const lightMode = evt.target.closest('.toggle-light-mode');
    const logOut = evt.target.closest('.log-out');
    if (lightMode) {
      lightMode.classList.toggle('selected');
      if (lightMode.classList.contains('selected')) {
        lightMode.ownerDocument.documentElement.classList.value = 'light';
        config.set('theme', 'light').write();
      } else {
        lightMode.ownerDocument.documentElement.classList.value = 'dark';
        config.set('theme', 'dark').write();
      }
    }
    if (logOut) {
      // eslint-disable-next-line no-console
      console.log('logging out');
    }
  });
  return DomElement;
};

module.exports = Sidebar();
