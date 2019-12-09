const { html, $ } = require('@forgjs/noframework');
const Icon = require('../Icon');
const OptionalInput = require('../OptionalInput');

const License = (eventManager) => {
  const DomElement = html`
  <div class="chooseLicense">
  <div class="icon">${Icon('key', 'feather-icons')}</div>
  <h1>Choose your license</h1>
  <div class="licenses">
    <label class="label">
      <input type="radio" name="license" class="free">
      Free license: up to 5 groups and 5gb of file storage (1gb file size limit)
    </label>
    <label class="label">
      <input type="radio" name="license" class="pro">
      <span class="KhandBold">Pro license</span>: 100 groups and 50gb of file storage (5gb file size limit)
    </label>
  </div>
  ${OptionalInput({ type: 'text', placeholder: 'License Key', class: 'input' }, eventManager, 'toggle-license')}
  <div class="navButtons">
    <button class="button next">Finish ${Icon('check', 'feather-icons')}</button>
    <button class="button prev">${Icon('chevron-left', 'feather-icons')}Prev</button>
  </div>
</div>
  `;

  $('.next', DomElement).addEventListener('click', () => eventManager.emit('done'));
  $('.prev', DomElement).addEventListener('click', () => eventManager.emit('prev'));


  DomElement.addEventListener('click', (evt) => {
    const input = evt.target.closest('input');
    if (input && input.classList.contains('pro')) {
      eventManager.emit('toggle-license', true);
    } else if (input && input.classList.contains('free')) {
      eventManager.emit('toggle-license', false);
    }
  });

  return DomElement;
};

module.exports = License;
