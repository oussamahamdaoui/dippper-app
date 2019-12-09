const { html, $ } = require('@forgjs/noframework');
const ModesToolbar = require('./ModesToolbar')();
const AudioToolbar = require('./AudioToolbar')();
const Icon = require('../../Icon');

const {
  EventEmitter, events: {
    TOOLBAR_MODES, // SET_CENTER_MODE, FOCUS_INPUT, SET_INPUT_VALUE,
    START_RECORDING,
    STOP_RECORDING,
    CANCEL_RECORDING,
  },
} = require('../../../EventEmitter');

const roots = {
  TOOLBAR_MODES: ModesToolbar,
  START_RECORDING: AudioToolbar,
};

const InputToolbar = () => {
  let current = roots[TOOLBAR_MODES];
  const DomElement = html`
  <div class="input-toolbar">
      <div class="input-toolbar__group forever">
        <span class="input-toolbar__quick-action">${Icon('paperclip', 'feather-icons')}</span>
        <!--<span class="input-toolbar__quick-action toKanban">${Icon('project')}</span> -->
        <span class="input-toolbar__quick-action recording">
          ${Icon('mic', 'feather-icons')}
          <div class="stop_recording">
            ${Icon('x', 'feather-icons')}
          </div>
        </span>
        
      </div>
      ${ModesToolbar}
  </div>`;
  // const toKanban = $('.toKanban', DomElement);

  // toKanban.addEventListener('click', () => {
  //   toKanban.classList.toggle('selected');
  //   EventEmitter.emit(FOCUS_INPUT);
  //   if (toKanban.classList.contains('selected')) {
  //     EventEmitter.emit(SET_CENTER_MODE, 'kanban');
  //     EventEmitter.emit(SET_INPUT_VALUE, '');
  //   } else {
  //     EventEmitter.emit(SET_CENTER_MODE, 'messages');
  //     EventEmitter.emit(SET_INPUT_VALUE, '');
  //   }
  // });

  const startRecording = $('.recording', DomElement);

  startRecording.addEventListener('mousedown', () => {
    EventEmitter.emit(START_RECORDING);
    startRecording.classList.add('on');
  });

  startRecording.addEventListener('mouseup', () => {
    EventEmitter.emit(TOOLBAR_MODES);
    EventEmitter.emit(STOP_RECORDING);
    startRecording.classList.remove('on');
  });

  startRecording.addEventListener('mouseleave', () => {
    EventEmitter.emit(TOOLBAR_MODES);
    EventEmitter.emit(CANCEL_RECORDING);
    startRecording.classList.remove('on');
  });

  EventEmitter.subscribe(TOOLBAR_MODES, () => {
    current.replaceWith(roots[TOOLBAR_MODES]);
    current = roots[TOOLBAR_MODES];
  });

  EventEmitter.subscribe(START_RECORDING, () => {
    current.replaceWith(roots[START_RECORDING]);
    current = roots[START_RECORDING];
  });

  return DomElement;
};


module.exports = InputToolbar;
