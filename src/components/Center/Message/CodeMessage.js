const { html, $ } = require('@forgjs/noframework');
const CodeMirror = require('codemirror');
const Icon = require('../../Icon');
const { clipboard } = require('electron');


const CodeMessage = ({ mode = 'javascript', content = '' }) => {
  const DomElement = html`
  <div class="message__code">
    <div class="message__tools">
      <span class="copy">${Icon('copy', 'feather-icons')}</span>
    </div>
    <textarea class="code-message__textarea"></textarea>
  </div>
    `;
  const codemirror = CodeMirror.fromTextArea($('.code-message__textarea', DomElement), {
    lineNumbers: true,
    mode,
    theme: 'moxer',
    value: content,
    readOnly: true,
    cursorHeight: 0,
  });

  $('.copy', DomElement).addEventListener('click', () => {
    clipboard.writeText(content);
  });

  codemirror.on('mousedown', (e, evt) => evt.preventDefault());


  setImmediate(() => {
    codemirror.setValue(content);
    codemirror.refresh();
  });

  return codemirror.getWrapperElement().parentNode;
};

module.exports = CodeMessage;
