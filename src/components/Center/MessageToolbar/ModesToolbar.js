const { html, $ } = require('@forgjs/noframework');
const Icon = require('../../Icon');
const {
  EventEmitter, events: {
    SET_MODE, SET_NEXT_MODE, SET_PREV_MODE, FOCUS_INPUT,
  },
} = require('../../../EventEmitter');


const languages = [
  {
    name: 'text',
    value: 'text',
  },
  {
    name: 'Javascript',
    value: 'javascript',
    icon: 'javascript',
  },
  {
    name: 'TypeScript',
    value: 'application/typescript',
    icon: 'typescript',
  },
  {
    name: 'JSX',
    value: 'jsx',
    icon: 'react',
  },
  {
    name: 'vue',
    value: 'text/x-vue',
    icon: 'vue-dot-js',
  },
  {
    name: 'Python',
    value: 'python',
    icon: 'python',
  },
  {
    name: 'Go',
    value: 'go',
    icon: 'go',
  },
  {
    name: 'Ruby',
    value: 'ruby',
    icon: 'ruby',
  },
  {

    name: 'Haskell',
    value: 'Haskell',
    icon: 'haskell',
  },
  {
    name: 'Swift',
    value: 'swift',
    icon: 'swift',

  },
  {
    name: 'R',
    value: 'r',
    icon: 'r',
  },
  {
    name: 'PHP',
    value: 'php',
    icon: 'php',
  },
  {
    name: 'SQL',
    value: 'text/x-sql',
  },
  {
    name: 'C',
    value: 'text/x-csrc',
  },
  {
    name: 'C++',
    value: 'text/x-c++src',
    icon: 'cplusplus',
  },
  {
    name: 'C#',
    value: 'text/x-csharp',
  },
  {
    name: 'Java',
    value: 'text/x-java',
    icon: 'java',
  },
  {
    name: 'Objective-C',
    value: 'text/x-objectivec',

  },
  {
    name: 'Kotlin',
    value: 'kotlin',
    icon: 'kotlin',
  },
  {
    name: 'CSS',
    value: 'css',
    icon: 'css3',
  },
  {
    name: 'HTML',
    value: 'htmlmixed',
    icon: 'html5',
  },
  {
    name: 'Sass',
    value: 'text/x-scss',
    icon: 'sass',
  },
  {
    name: 'Less',
    value: 'text/x-less',
  },
  {
    name: 'Markdown',
    value: 'gfm',
    icon: 'markdown',

  },
  {
    name: 'YAML',
    value: 'text/x-yaml',
  },
  {
    name: 'powershell',
    value: 'application/x-powershell',
    icon: 'powershell',
  },
  {
    name: 'nginx',
    value: 'text/x-nginx-conf',
    icon: 'nginx',
  },

];

const ModesToolbar = () => {
  const DomElement = html` 
  <div class="input-toolbar__group modes">
    ${languages.map(({ name, value, icon }, i) => html`
    <span value='${value}' class="input-toolbar__quick-action ${i === 0 ? 'selected' : ''}">
      ${icon ? Icon(icon, 'simple-icons') : name}
    </span>`)}
  </div>`;

  let SelectedElement = $('.selected', DomElement);

  DomElement.addEventListener('click', (e) => {
    const button = e.target.closest('SPAN');
    if (!button) return;
    EventEmitter.emit(SET_MODE, button.getAttribute('value'));
    EventEmitter.emit(FOCUS_INPUT);
    button.classList.add('selected');
    if (SelectedElement && SelectedElement !== button) {
      SelectedElement.classList.remove('selected');
    }
    SelectedElement = button;
  });

  EventEmitter.subscribe(SET_NEXT_MODE, () => {
    if (!DomElement.parentNode || !SelectedElement.nextElementSibling) return;
    SelectedElement.classList.remove('selected');
    SelectedElement = SelectedElement.nextElementSibling;
    SelectedElement.classList.add('selected');
    SelectedElement.scrollIntoView();
    EventEmitter.emit(SET_MODE, SelectedElement.getAttribute('value'));
  });

  EventEmitter.subscribe(SET_PREV_MODE, () => {
    if (!DomElement.parentNode || !SelectedElement.previousElementSibling) return;
    SelectedElement.classList.remove('selected');
    SelectedElement = SelectedElement.previousElementSibling;
    SelectedElement.classList.add('selected');
    SelectedElement.scrollIntoView();
    EventEmitter.emit(SET_MODE, SelectedElement.getAttribute('value'));
  });

  return DomElement;
};

module.exports = ModesToolbar;
