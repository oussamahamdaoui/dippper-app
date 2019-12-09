const { html } = require('@forgjs/noframework');
const CodeMessage = require('./CodeMessage');
const AudioMessage = require('./AudioMessage');
const Icon = require('../../Icon');

const types = {
  code: CodeMessage,
  audio: AudioMessage,
};

const Message = ({
  type = 'code',
  data,
  date,
}) => {
  const parsedDate = new Date();
  parsedDate.setTime(date);
  const DomElement = html`<div class="message ${type}">
      <div class="message__data">
      <div class="message__avatar">${data.avatar ? html`<img src="${data.avatar}"/>` : Icon('person')}</div>
      <div class="message_time">${String(parsedDate.getHours()).padStart(2, '0')}:${String(parsedDate.getMinutes()).padStart(2, '0')}</div>
      </div>
      ${types[type](data)}
  </div>`;


  return DomElement;
};

module.exports = Message;
