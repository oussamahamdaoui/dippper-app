const {
  html, $$, $, EventManager,
} = require('@forgjs/noframework');
const Sortable = require('sortablejs');

const {
  EventEmitter, events: {
    SET_INPUT_VALUE,
    // CREATE_KANBAN_CARD,
    INPUT_CURSOR_ACTIVITY,
    FOCUS_INPUT,
    MESSAGE,
  },
} = require('../../../EventEmitter');

const Icon = require('../../Icon');

const KanbanCard = (text, eventManager) => {
  const DomElement = html`
    <div class="kanban__card">
      <div class="kanban__content">${text}</div>
      <div class="delete">${Icon('trash', 'feather-icons')}</div>
    </div>
  `;

  $('.delete', DomElement).addEventListener('click', (e) => {
    e.stopPropagation();
    eventManager.emit('set-selected', DomElement.parentNode.parentNode);
    DomElement.remove();
    EventEmitter.emit(SET_INPUT_VALUE, '');
  });

  DomElement.addEventListener('click', (e) => {
    e.stopPropagation();
    EventEmitter.emit(SET_INPUT_VALUE, $('.kanban__content', DomElement).innerText);
    EventEmitter.emit(FOCUS_INPUT);
    eventManager.emit('set-selected', DomElement);
  });
  return DomElement;
};


const Kanban = () => {
  const eventManager = new EventManager();

  const DomElement = html`
    <div class="kanban">
      <div class="kanban__row selected">
        <div class="kanban-row__title">To Do</div>
        <div class="kanban-row-cards">
        </div>
      </div>
      <div class="kanban__row">
        <div class="kanban-row__title">In progress</div>
        <div class="kanban-row-cards">
        </div>
      </div>
      <div class="kanban__row">
        <div class="kanban-row__title">Done</div>
        <div class="kanban-row-cards">
        </div>
      </div>
    </div>
  `;

  let selected = $('.kanban__row', DomElement);

  $$('.kanban-row-cards', DomElement).forEach((e) => {
    Sortable.create(e, {
      group: 'shared',
      onEnd: () => { EventEmitter.emit(FOCUS_INPUT); },
    });
  });

  eventManager.subscribe('set-selected', (elem) => {
    if (selected) {
      selected.classList.remove('selected');
    }
    selected = elem;
    selected.classList.add('selected');
  });

  $$('.kanban__row', DomElement).forEach((row) => {
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      eventManager.emit('set-selected', row);
      EventEmitter.emit(SET_INPUT_VALUE, '');
      EventEmitter.emit(FOCUS_INPUT);
    });
  });

  EventEmitter.subscribe(MESSAGE, ({ reroute, data }) => {
    if (reroute !== 'kanban') return;
    if (!data.content) return;
    if (selected && selected.classList.contains('kanban__card')) return;
    ($('.kanban-row-cards', selected) || $('.kanban__row .kanban-row-cards', DomElement)).appendChild(KanbanCard(data.content, eventManager));
    EventEmitter.emit(SET_INPUT_VALUE, '');
  });

  EventEmitter.subscribe(INPUT_CURSOR_ACTIVITY, (value) => {
    if (!selected || !selected.classList.contains('kanban__card')) return;
    if (value === '') {
      eventManager.emit('set-selected', selected.parentNode.parentNode);
      return;
    }
    $('.kanban__content', selected).innerText = value;
  });


  return DomElement;
};

module.exports = Kanban;
