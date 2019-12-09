const { html, emptyElement } = require('@forgjs/noframework');
const {
  EventEmitter, events: {
    MESSAGE,
    GOT_MESSAGES,
    GET_MESSAGES,
    CHANGE_GROUP,
    AUDIO_MESSAGE,
  },
} = require('../../EventEmitter');
const config = require('../../config');
const Message = require('./Message');


const Messages = () => {
  const DomElement = html`<div class="messages"></div>`;
  let selectedFriend = null;
  const myPk = config.get('user.publicKey').value();

  EventEmitter.subscribe(MESSAGE, (message) => {
    if (message.reroute !== 'messages') return;
    if (message.from !== selectedFriend && message.from !== myPk) return;
    const m = Message(message);
    DomElement.append(m);
    m.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  });

  EventEmitter.subscribe(CHANGE_GROUP, (publicKey) => {
    selectedFriend = publicKey;
  });

  EventEmitter.subscribe(GET_MESSAGES, () => {
    emptyElement(DomElement);
  });

  EventEmitter.subscribe(AUDIO_MESSAGE, (message) => {
    if (message.reroute !== 'messages') return;
    if (message.from !== selectedFriend && message.from !== myPk) return;
    const m = Message(message);
    DomElement.append(m);
    m.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  });

  EventEmitter.subscribe(GOT_MESSAGES, (messages) => {
    messages.map((message) => Message(message)).forEach((message) => {
      DomElement.appendChild(message);
    });
  });
  return DomElement;
};

module.exports = Messages;
