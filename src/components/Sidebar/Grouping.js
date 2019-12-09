const { html } = require('@forgjs/noframework');
const Icon = require('../Icon');

const Groupment = (title, elements, ...icon) => {
  const DomElement = html`<div class="sidebar__groupment">
    <div class="sidebar__groupment__title">
      ${icon ? Icon(...icon) : null}
      <span>${title}</span>
      ${Icon('plus', { class: 'plus' })}
    </div>
    <div class="groupment__elements">
      ${elements}
    </div>
  </div>`;

  return DomElement;
};

module.exports = Groupment;
