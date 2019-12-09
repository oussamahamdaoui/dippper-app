const toProps = (obj) => Object.keys(obj).map((key) => `${key} = "${obj[key]}"`).join(' ');

// eslint-disable-next-line no-async-promise-executor
const recordAudio = () => new Promise(async (resolve) => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  mediaRecorder.addEventListener('dataavailable', (event) => {
    audioChunks.push(event.data);
  });

  const start = () => mediaRecorder.start();

  // eslint-disable-next-line no-shadow
  const stop = () => new Promise((resolve) => {
    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      const play = () => audio.play();
      resolve({ audioBlob, audioUrl, play });
    });

    mediaRecorder.stop();
  });

  resolve({ start, stop, stream });
});


const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const msToMinAndSec = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return (seconds === 60 ? `${minutes + 1}:00` : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
};

const getBlobDuration = (blob) => {
  const tempVideoEl = document.createElement('audio');

  const durationP = new Promise((resolve) => tempVideoEl.addEventListener('loadedmetadata', () => {
    if (tempVideoEl.duration === Infinity) {
      tempVideoEl.currentTime = Number.MAX_SAFE_INTEGER;
      tempVideoEl.ontimeupdate = () => {
        tempVideoEl.ontimeupdate = null;
        resolve(tempVideoEl.duration * 1000);
        tempVideoEl.currentTime = 0;
      };
    } else { resolve(tempVideoEl.duration * 1000); }
  }));

  tempVideoEl.src = typeof blob === 'string' || blob instanceof String
    ? blob
    : window.URL.createObjectURL(blob);

  return durationP;
};

module.exports = {
  toProps,
  recordAudio,
  sleep,
  base64ToArrayBuffer,
  arrayBufferToBase64,
  msToMinAndSec,
  getBlobDuration,
};
