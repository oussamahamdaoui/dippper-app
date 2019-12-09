const { html, $, emptyElement } = require('@forgjs/noframework');
const Icon = require('../Icon');
const config = require('../../config');
const GroupItem = require('./GroupItem');
const SearchResult = require('./SearchResult');
const {
  EventEmitter, events: {
    CHANGE_GROUP,
    LOGGED_IN,
    FIND_FRIEND,
    FOUND_FRIEND,
    FRIEND_ADDED,
    GET_ONLINE_FRIENDS,
  },
} = require('../../EventEmitter');


const Friends = () => {
  const DomElement = html`<div class="sidebar__groupment">
    <div class="sidebar__groupment__title">
      ${Icon('person')}
      <span>Friends</span>
      ${Icon('plus')}
    </div>
    <div class="groupment__find-friend">
      <input type="text" class="friend-name input" placeholder="username">
      <div class="results"></div>
      <div>
        <button class="button search">Search</button>
        <button class="button cancel">Cancel</button>
      </div>
    </div>
    <div class="groupment__elements">
    </div>
  </div>`;

  const GroupElement = $('.groupment__elements', DomElement);
  const AddElement = $('.sidebar__groupment__title', DomElement);
  const friendPk = $('.groupment__find-friend', DomElement);
  const usernameElement = $('input', friendPk);
  const searchResults = $('.results', friendPk);

  const close = () => {
    friendPk.classList.remove('visible');
    usernameElement.value = '';
  };


  EventEmitter.subscribe(LOGGED_IN, async () => {
    const friends = (await config.get('friends').value());
    friends.map(GroupItem).forEach((element) => GroupElement.appendChild(element));
    if (!friends[0]) return;
    EventEmitter.emit(CHANGE_GROUP, friends[0].publicKey, friends[0].username);
  });

  AddElement.addEventListener('click', async () => {
    friendPk.classList.toggle('visible');
  });

  $('.search', friendPk).addEventListener('click', async () => {
    EventEmitter.emit(FIND_FRIEND, usernameElement.value);
    emptyElement(searchResults);
  });

  EventEmitter.subscribe(FOUND_FRIEND, (matchingUsers) => {
    matchingUsers.forEach((user) => {
      searchResults.appendChild(SearchResult(user));
    });
  });

  EventEmitter.subscribe(FRIEND_ADDED, async ({ username, publicKey }) => {
    await config.get('friends').push({
      username,
      publicKey,
    }).write();
    EventEmitter.emit(GET_ONLINE_FRIENDS);
    GroupElement.appendChild(GroupItem({ username, publicKey }));
    close();
  });


  $('.cancel', friendPk).addEventListener('click', close);

  return DomElement;
};

module.exports = Friends();
