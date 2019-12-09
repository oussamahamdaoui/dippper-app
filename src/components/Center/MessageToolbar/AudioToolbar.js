const { html, $ } = require('@forgjs/noframework');
const { recordAudio, msToMinAndSec } = require('../../../utils');
const {
  EventEmitter, events: {
    START_RECORDING,
    STOP_RECORDING,
    SEND_AUDIO,
    CHANGE_GROUP,
    CANCEL_RECORDING,
  },
} = require('../../../EventEmitter');


const AudioToolbar = () => {
  const bars = Array(64).fill().map(() => html`<div></div>`);
  const DomElement = html`<div class="audio-toolbar">
    <div class="time"></div>
    <div class="loading">
      ${bars}
    </div>
  </div>`;

  let recorder = null;
  let isRecording = false;
  let toPk = null;
  const timeElement = $('.time', DomElement);
  let recordingTime = 0;

  EventEmitter.subscribe(CHANGE_GROUP, (pk) => {
    toPk = pk;
  });

  EventEmitter.subscribe(START_RECORDING, async () => {
    recorder = await recordAudio();
    recorder.start();
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const source = context.createMediaStreamSource(recorder.stream);
    source.connect(analyser);
    analyser.fftSize = 128;
    isRecording = true;
    const record = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      recordingTime += 1000 / 60;
      timeElement.innerText = msToMinAndSec(recordingTime);
      analyser.getByteFrequencyData(dataArray);
      [...dataArray.slice(0, 64 / 2).reverse(),
        ...dataArray.slice(0, 64 / 2)].forEach((e, index) => {
        bars[index].style.transform = `scaleY(${e / 255})`;
      });
      if (isRecording) {
        setTimeout(record, 1000 / 60);
      }
    };
    record(analyser);
  });

  EventEmitter.subscribe(CANCEL_RECORDING, async () => {
    if (recorder && isRecording) {
      recorder.stop();
      isRecording = false;
      recordingTime = 0;
    }
  });

  EventEmitter.subscribe(STOP_RECORDING, async () => {
    const audio = await recorder.stop();
    EventEmitter.emit(SEND_AUDIO, audio.audioBlob, toPk);
    isRecording = false;
    recordingTime = 0;
  });


  return DomElement;
};

module.exports = AudioToolbar;
