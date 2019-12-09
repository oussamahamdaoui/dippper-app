const { html, $ } = require('@forgjs/noframework');
const Icon = require('../Icon');
const { EventEmitter, events: { CHANGE_GROUP } } = require('../../EventEmitter');

const Toolbar = () => {
  const DomElement = html`
  <div class="toolbar">
    <div class="toolbar__title"></div>
    <div class="toolbar__search">
      ${Icon('search')}
      <input type="text" placeholder="Search anything...">
    </div>
    <button class="toolbar__button bell red">${Icon('bell')}</button>
    <button class="toolbar__button pin">${Icon('pin')}</button>
    <button class="toolbar__button settings">${Icon('kebab-horizontal')}</button>
  </div>`;

  EventEmitter.subscribe(CHANGE_GROUP, (id, username) => {
    $('.toolbar__title', DomElement).innerText = username;
  });

  return DomElement;
};

module.exports = Toolbar;
