const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const app = require('electron').remote.app;
const path = require('path');

const adapter = new FileSync(path.join(app.getAppPath('userData'), 'config.json'));
const db = low(adapter);

db.defaults({
  user: {
    username: null,
    email: null,
    favoriteLanguages: [],
    publicKey: null,
    privateKey: null,
    verified: false,
  },
  theme: 'dark',
  friends: [],
  groups: [],
}).write();

module.exports = db;
