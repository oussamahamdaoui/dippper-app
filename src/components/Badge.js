const { html } = require('@forgjs/noframework');

const Badge = (text) => {
  const DomElement = html`<div class="badge">
  ${text}
  </div>`;

  return DomElement;
};

module.exports = Badge;
