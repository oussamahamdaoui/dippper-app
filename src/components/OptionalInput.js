const { html, $ } = require('@forgjs/noframework');
const { toProps } = require('../utils');

const defaultProps = {
  type: 'text',
  placeholder: 'Phone number',
  value: true,
};


const OptionalInput = (props = defaultProps, eventHandler, event = 'show-optional-input') => {
  const DomElement = html`
    <div class="optional-input" style="max-height:0px;overflow: hidden;">
      <input ${toProps(props)}>
    </div>
  `;

  const input = $('input', DomElement);

  eventHandler.subscribe(event, (val) => {
    const {
      scrollHeight,
      firstElementChild,
      style,
    } = DomElement;

    const styles = window.getComputedStyle(firstElementChild);
    const margin = parseFloat(styles.marginTop)
      + parseFloat(styles.marginBottom);

    if (val === true) {
      input.removeAttribute('disabled');
      style.maxHeight = `${scrollHeight + margin}px`;
      firstElementChild.focus();
      return;
    } if (val === false) {
      style.maxHeight = '0px';
      input.setAttribute('disabled', true);
      return;
    }

    if (style.maxHeight === '0px') {
      input.removeAttribute('disabled');
      style.maxHeight = `${scrollHeight + margin}px`;
      firstElementChild.focus();
    } else {
      style.maxHeight = '0px';
      input.setAttribute('disabled', true);
    }
  });

  return DomElement;
};

module.exports = OptionalInput;
