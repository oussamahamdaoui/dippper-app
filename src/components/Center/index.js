const { html } = require('@forgjs/noframework');
const Messages = require('./Messages')();
const Kanban = require('./Kanban')();
const Toolbar = require('./Toolbar')();
const InputArea = require('./InputArea')();
const InputToolbar = require('./MessageToolbar')();
const {
  EventEmitter, events: {
    SET_CENTER_MODE,
  },
} = require('../../EventEmitter');

const modes = {
  messages: Messages,
  kanban: Kanban,
};

const Center = () => {
  let current = Messages;

  const DomElement = html`
    <div class="center">
      ${Toolbar}
      ${current}
      ${InputToolbar}
      ${InputArea}
    </div>
  `;

  EventEmitter.subscribe(SET_CENTER_MODE, (mode) => {
    if (current !== modes[mode]) {
      current.replaceWith(modes[mode]);
      current = modes[mode];
    }
  });

  return DomElement;
};

module.exports = Center();
