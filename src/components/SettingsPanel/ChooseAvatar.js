const { html, $ } = require('@forgjs/noframework');
const Icon = require('../Icon');
const VideoInput = require('../VideoInput');

const ChooseAvatar = (eventManager) => {
  const DomElement = html`
  <div class="choseAvatar">
    <div class="icon">${Icon('camera', 'feather-icons')}</div>
    <h1>Choose your avatar</h1>
    <div class="takePhoto">
      <h1>Use camera</h1>
      ${VideoInput(eventManager)}
      <img>
      <button>Take a photo</button>
    </div>
    <div class="navButtons">
      <button class="button next">Next ${Icon('check', 'feather-icons')}</button>
      <button class="button prev">${Icon('chevron-left', 'feather-icons')}Prev</button>
    </div>
  </div>
  `;

  $('.next', DomElement).addEventListener('click', () => {
    eventManager.emit('next');
    eventManager.emit('stop-video');
  });
  $('.prev', DomElement).addEventListener('click', () => {
    eventManager.emit('prev');
    eventManager.emit('stop-video');
  });

  $('.takePhoto button', DomElement).addEventListener('click', () => {
    eventManager.emit('take-photo');
  });

  eventManager.subscribe('photo', (src) => {
    $('.takePhoto img', DomElement).src = src;
  });

  eventManager.subscribe('loaded', (e) => {
    if (e !== DomElement) return;
    eventManager.emit('start-video');
  });


  return DomElement;
};

module.exports = ChooseAvatar;
