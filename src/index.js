const { html } = require('@forgjs/noframework');
const Center = require('./components/Center');
const Sidebar = require('./components/Sidebar');
const SettingsPanel = require('./components/SettingsPanel');
const config = require('./config');

const app = html`
<div class="app">
  ${SettingsPanel()}
  ${Sidebar}
  ${Center}
</div>
`;

document.body.appendChild(app);
document.documentElement.classList.value = config.get('theme');
