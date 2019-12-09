const { html, $ } = require('@forgjs/noframework');
const CodeMirror = require('codemirror');
const Icon = require('../Icon');
const { createAndSignMessage } = require('../../crypto');
const app = require('electron').remote.app;
const path = require('path');

const {
  EventEmitter, events: {
    SET_MODE,
    SET_NEXT_MODE,
    MESSAGE,
    SEND_MESSAGE,
    SET_SUGGESTED,
    SET_PREV_MODE,
    SET_INPUT_VALUE,
    SET_CENTER_MODE,
    INPUT_CURSOR_ACTIVITY,
    FOCUS_INPUT,
    INPUT_SEND_CURRENT_MESSAGE,
    CHANGE_GROUP,
  },
} = require('../../EventEmitter');
const config = require('../../config');

require('fs').readdirSync(path.join(app.getAppPath(), 'node_modules/codemirror/mode')).forEach((file) => {
  if (file.indexOf('.') !== -1) return;
  // eslint-disable-next-line
  require(`codemirror/mode/${file}/${file}`);
});


const InputArea = () => {
  const DomElement = html`
  <div class="input-area">
    <textarea ></textarea>
    <button class="input-area__send">${Icon('send', 'feather-icons')}</button>
  </div>
  `;
  let reroute = 'messages';
  let toPk = null;

  const codemirror = CodeMirror.fromTextArea($('textarea', DomElement), {
    lineNumbers: true,
    mode: 'text',
    theme: 'moxer',
    lineWiseCopyCut: true,
  });

  EventEmitter.subscribe(CHANGE_GROUP, (pk) => {
    toPk = pk;
  });


  EventEmitter.subscribe(SET_CENTER_MODE, (t) => {
    reroute = t;
  });

  codemirror.on('cursorActivity', (editor) => {
    const inputValue = editor.getValue();
    EventEmitter.emit(INPUT_CURSOR_ACTIVITY, inputValue);
  });

  EventEmitter.subscribe(INPUT_SEND_CURRENT_MESSAGE, async () => {
    const mode = codemirror.getOption('mode');
    const value = codemirror.getValue();
    if (value.trim() === '') return;
    const publicKey = await config.get('user.publicKey').value();
    const privateKey = await config.get('user.privateKey').value();

    const message = {
      from: publicKey,
      to: toPk,
      reroute,
      type: 'code',
      date: (new Date()).getTime(),
      data: {
        mode,
        content: value,
      },
    };
    EventEmitter.emit(MESSAGE, message); // render
    EventEmitter.emit(SEND_MESSAGE, (await createAndSignMessage(message, privateKey))); // send

    codemirror.setValue('');
  });

  codemirror.on('keydown', (cm, evt) => {
    if (evt.keyCode === 13 && evt.metaKey) {
      EventEmitter.emit(INPUT_SEND_CURRENT_MESSAGE);
    }
    if (evt.metaKey && evt.keyCode === 37) {
      EventEmitter.emit(SET_PREV_MODE, evt);
    }
    if (evt.metaKey && evt.keyCode === 39) {
      EventEmitter.emit(SET_NEXT_MODE, evt);
    }
  });


  EventEmitter.subscribe(SET_MODE, (mode) => {
    codemirror.setOption('mode', mode);
  });

  EventEmitter.subscribe(SET_SUGGESTED, (text) => {
    const wrd = codemirror.findWordAt({
      line: codemirror.getCursor().line,
      ch: codemirror.getCursor().ch,
    });
    codemirror.replaceRange(text, wrd.anchor, wrd.head);
  });

  EventEmitter.subscribe(SET_INPUT_VALUE, (value) => {
    codemirror.setValue(value);
  });

  EventEmitter.subscribe(FOCUS_INPUT, () => {
    codemirror.focus();
    codemirror.setCursor(codemirror.lineCount(), 0);
  });

  $('.input-area__send', DomElement).addEventListener('click', () => {
    EventEmitter.emit(INPUT_SEND_CURRENT_MESSAGE);
    EventEmitter.emit(FOCUS_INPUT);
  });


  setImmediate(() => {
    codemirror.refresh();
  });

  return codemirror.getWrapperElement().parentNode;
};

module.exports = InputArea;
