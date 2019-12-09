const { html } = require('@forgjs/noframework');
const octicons = require('@primer/octicons');
const simpleIcons = require('simple-icons');
const feather = require('feather-icons');

const Icon = (name, icon = 'octicons') => {
  if (icon === 'simple-icons') {
    return html`${simpleIcons.get(name).svg}`;
  }
  if (icon === 'feather-icons') {
    return html`${feather.icons[name].toSvg({ class: 'nofill' })}`;
  }
  return html`${octicons[name].toSVG()}`;
};

module.exports = Icon;
