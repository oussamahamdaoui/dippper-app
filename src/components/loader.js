const { html } = require('@forgjs/noframework');

const Loader = () => {
  const DomElement = html`
  <div class="sk-chase">
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
  </div>
  `;

  return DomElement;
};

module.exports = Loader;
