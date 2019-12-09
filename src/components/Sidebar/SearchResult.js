const { html, $ } = require('@forgjs/noframework');
const {
  EventEmitter, events: {
    ADD_FRIEND,
  },
} = require('../../EventEmitter');


const SearchResult = ({ username, publicKey }) => {
  const DomElement = html`
  <div class="search-result">
    <div>${username}</div>
    <button> Add </div>
  </div>
`;
  $('button', DomElement).addEventListener('click', () => {
    EventEmitter.emit(ADD_FRIEND, {
      username,
      publicKey,
    });
  });

  return DomElement;
};

module.exports = SearchResult;
