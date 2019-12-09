const { EventManager } = require('@forgjs/noframework');
const io = require('socket.io-client');
const { decryptAndVerifyMessage, generateSignature, createAndSignMessage } = require('./crypto');
const config = require('./config');
const {
  base64ToArrayBuffer,
  arrayBufferToBase64,
} = require('./utils');

const socket = io('https://dippper.com', { // https://dippper.com, http://localhost:3000
  transports: ['websocket'],
  secure: true,
  rejectUnauthorized: false,
  path: '/chat/socket.io',
});


const events = {
  CHANGE_GROUP: 'CHANGE_GROUP',
  SET_MODE: 'SET_MODE',
  MESSAGE: 'MESSAGE',
  CHANGE_TOOLBAR: 'CHANGE_TOOLBAR',
  TOOLBAR_SUGGEST: 'TOOLBAR_SUGGEST',
  TOOLBAR_MODES: 'TOOLBAR_MODES',
  SET_SUGGESTED: 'SET_SUGGESTED',
  SET_NEXT_MODE: 'SET_NEXT_MODE',
  SET_PREV_MODE: 'SET_PREV_MODE',
  SET_NTH_SUGGESTION: 'SET_NTH_SUGGESTION',
  ALERT: 'ALERT',
  SET_INPUT_VALUE: 'SET_INPUT_VALUE',
  CREATE_KANBAN_CARD: 'CREATE_KANBAN_CARD',
  INPUT_CURSOR_ACTIVITY: 'INPUT_CURSOR_ACTIVITY',
  SET_CENTER_MODE: 'SET_CENTER_MODE',
  FOCUS_INPUT: 'FOCUS_INPUT',
  INPUT_SEND_CURRENT_MESSAGE: 'INPUT_SEND_CURRENT_MESSAGE',
  // message events
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  GOT_MESSAGE: 'GOT_MESSAGE',
  SEND_MESSAGE: 'SEND_MESSAGE',
  IS_TYPING: 'IS_TYPING',
  GET_ONLINE_FRIENDS: 'GET_ONLINE_FRIENDS',
  ONLINE_FRIENDS: 'ONLINE_FRIENDS',
  LOGIN: 'LOGIN',
  LOGGED_IN: 'LOGGED_IN',
  FRIEND_DISCONNECTED: 'FRIEND_DISCONNECTED',
  FRIEND_CONNECTED: 'FRIEND_CONNECTED',
  GOT_MESSAGES: 'GOT_MESSAGES',
  GET_MESSAGES: 'GET_MESSAGES',
  FIND_FRIEND: 'FIND_FRIEND',
  FOUND_FRIEND: 'FOUND_FRIEND',
  ADD_FRIEND: 'ADD_FRIEND',
  FRIEND_ADDED: 'FRIEND_ADDED',
  IS_USERNAME_AVAILABLE: 'IS_USERNAME_AVAILABLE',
  USERNAME_AVAILABLE: 'USERNAME_AVAILABLE',
  SIGN_IN: 'SIGN_IN',
  SIGNED_IN: 'SIGNED_IN',
  START_RECORDING: 'START_RECORDING',
  STOP_RECORDING: 'STOP_RECORDING',
  SEND_AUDIO: 'SEND_AUDIO',
  AUDIO_MESSAGE: 'AUDIO_MESSAGE',
  CANCEL_RECORDING: 'CANCEL_RECORDING',
};

const EventEmitter = new EventManager();

EventEmitter.subscribe(events.SIGN_IN, async ({ username }) => {
  const privateKey = await config.get('user.privateKey').value();
  const publicKey = await config.get('user.publicKey').value();
  const login = {
    publicKey,
    date: (new Date()).getTime(),
    username,
  };
  socket.emit(events.SIGN_IN, {
    ...login,
    signature: generateSignature(login, privateKey),
  });
});

EventEmitter.subscribe(events.CHANGE_GROUP, (from) => {
  EventEmitter.emit(events.GET_MESSAGES, from);
});


EventEmitter.subscribe(events.SEND_AUDIO, async (blob, toPk) => {
  const publicKey = await config.get('user.publicKey').value();
  const privateKey = await config.get('user.privateKey').value();

  const message = {
    from: publicKey,
    to: toPk,
    date: (new Date()).getTime(),
    type: 'audio',
    reroute: 'messages',
    data: arrayBufferToBase64(await blob.arrayBuffer()),
  };

  const encrypted = await createAndSignMessage(message, privateKey, publicKey);

  socket.emit(events.SEND_AUDIO, encrypted);
});

EventEmitter.subscribe(events.ADD_FRIEND, ({ username, publicKey }) => {
  socket.emit(events.ADD_FRIEND, { username, publicKey });
});

EventEmitter.subscribe(events.IS_USERNAME_AVAILABLE, (username) => {
  socket.emit(events.IS_USERNAME_AVAILABLE, username);
});

EventEmitter.subscribe(events.FIND_FRIEND, (username) => {
  socket.emit(events.FIND_FRIEND, username);
});

EventEmitter.subscribe(events.SEND_MESSAGE, async (message) => {
  socket.emit(events.MESSAGE, message);
});

EventEmitter.subscribe(events.GET_ONLINE_FRIENDS, () => {
  socket.emit(events.GET_ONLINE_FRIENDS, config.get('friends').map((e) => e.publicKey).value());
});

EventEmitter.subscribe(events.LOGIN, async () => {
  const privateKey = await config.get('user.privateKey').value();
  const publicKey = await config.get('user.publicKey').value();
  const login = {
    publicKey,
    date: (new Date()).getTime(),
    friends: config.get('friends').map((e) => e.publicKey).value(),
  };
  socket.emit(events.LOGIN, {
    ...login,
    signature: generateSignature(login, privateKey),
  });
});

EventEmitter.subscribe(events.GET_MESSAGES, async (from, page) => {
  socket.emit(events.GET_MESSAGES, from, page);
});

socket.on(events.GOT_MESSAGES, async (messages) => {
  const privateKey = await config.get('user.privateKey').value();
  const publicKey = await config.get('user.publicKey').value();

  messages.forEach(async (message) => {
    const decrypted = await decryptAndVerifyMessage(message, privateKey, publicKey);
    EventEmitter.emit(events.GOT_MESSAGES, [decrypted]);
  });
});

socket.on(events.LOGGED_IN, () => {
  EventEmitter.emit(events.LOGGED_IN);
});

socket.on(events.AUDIO_MESSAGE, async (audioMessage) => {
  const privateKey = await config.get('user.privateKey').value();
  const publicKey = await config.get('user.publicKey').value();
  const decrypted = await decryptAndVerifyMessage(audioMessage, privateKey, publicKey);
  decrypted.data = base64ToArrayBuffer(decrypted.data);
  EventEmitter.emit(events.AUDIO_MESSAGE, decrypted);
});

socket.on(events.MESSAGE, async (message) => {
  const privateKey = await config.get('user.privateKey').value();
  const publicKey = await config.get('user.publicKey').value();
  if (message.from === publicKey) return;
  new Audio('../media/notification.wav').play();
  const decrypted = await decryptAndVerifyMessage(message, privateKey, publicKey);
  EventEmitter.emit(events.MESSAGE, decrypted);
});

socket.on(events.ONLINE_FRIENDS, (online) => {
  EventEmitter.emit(events.ONLINE_FRIENDS, online);
});

socket.on(events.LOGGED_IN, () => {
  EventEmitter.emit(events.GET_ONLINE_FRIENDS);
});

socket.on(events.FRIEND_DISCONNECTED, (pk) => {
  EventEmitter.emit(events.FRIEND_DISCONNECTED, pk);
});

socket.on(events.FRIEND_CONNECTED, (pk) => {
  EventEmitter.emit(events.FRIEND_CONNECTED, pk);
});

socket.on(events.FOUND_FRIEND, (friend) => {
  EventEmitter.emit(events.FOUND_FRIEND, friend);
});

socket.on(events.USERNAME_AVAILABLE, (isAvailable) => {
  EventEmitter.emit(events.USERNAME_AVAILABLE, isAvailable);
});

socket.on(events.SIGNED_IN, (isSignedIn) => {
  EventEmitter.emit(events.SIGNED_IN, isSignedIn);
});

socket.on(events.FRIEND_ADDED, ({ publicKey, username }) => {
  EventEmitter.emit(events.FRIEND_ADDED, { publicKey, username });
});

module.exports = {
  events,
  EventEmitter,
};
