const { html, $ } = require('@forgjs/noframework');
const {
  EventEmitter, events: {
    CHANGE_GROUP, ONLINE_FRIENDS, FRIEND_DISCONNECTED, FRIEND_CONNECTED,
  },
} = require('../../EventEmitter');


const Icon = require('../Icon');
const Badge = require('../Badge');

const GroupItem = ({
  publicKey, username, img, nbOfNewMessages,
}) => {
  const DomElement = html`
  <div class="group-item">
    ${img ? html`<img src="${img}"/>` : Icon('person')}
    <div class="group-item__status"></div>
    <span class="group-item__name">${username}</span>
    ${nbOfNewMessages ? Badge(nbOfNewMessages) : null}
  </div>`;
  const StatusElement = $('.group-item__status', DomElement);

  EventEmitter.subscribe(FRIEND_DISCONNECTED, (pk) => {
    if (pk !== publicKey) return;
    StatusElement.classList.remove('online');
    StatusElement.classList.add('offline');
  });

  EventEmitter.subscribe(FRIEND_CONNECTED, (pk) => {
    if (pk !== publicKey) return;
    StatusElement.classList.add('online');
    StatusElement.classList.remove('offline');
  });

  EventEmitter.subscribe(CHANGE_GROUP, (index) => {
    if (index === publicKey) {
      DomElement.classList.add('selected');
    } else {
      DomElement.classList.remove('selected');
    }
  });

  EventEmitter.subscribe(ONLINE_FRIENDS, (online) => {
    if (online.includes(publicKey)) {
      StatusElement.classList.add('online');
      StatusElement.classList.remove('offline');
    } else {
      StatusElement.classList.add('offline');
      StatusElement.classList.remove('online');
    }
  });

  DomElement.addEventListener('click', () => {
    if (DomElement.classList.contains('selected')) return;
    EventEmitter.emit(CHANGE_GROUP, publicKey, username);
  });

  return DomElement;
};

module.exports = GroupItem;
