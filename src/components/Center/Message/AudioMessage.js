const { html, $ } = require('@forgjs/noframework');
const Icon = require('../../Icon');
const { msToMinAndSec, getBlobDuration } = require('../../../utils');

const AudioMessage = (message) => {
  const SIZE = 64;
  const bars = Array(SIZE).fill().map(() => html`<div></div>`);
  const DomElement = html`
    <div class="message__audio">
      <div class="audio_player">
        <button class="play">${Icon('play', 'feather-icons')}</button>
        <div class="visualizer">${bars}</div>
        <div class="time"></div>
      </div>
    </div>
  `;
  const timeElement = $('.time', DomElement);
  const blob = new Blob([message], { type: 'audio/mp3' });
  const url = window.URL.createObjectURL(blob);
  const audio = new Audio(url);
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = SIZE * 2;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  let isPlaying = false;

  getBlobDuration(blob).then((duration) => {
    timeElement.innerText = msToMinAndSec(duration);
  });

  const record = () => {
    if (!isPlaying) return;
    analyser.getByteFrequencyData(dataArray);
    [...dataArray.slice(0, SIZE / 2).reverse(),
      ...dataArray.slice(0, SIZE / 2)].forEach((e, index) => {
      bars[index].style.transform = `scaleY(${e / 255})`;
    });
    if (isPlaying) {
      setTimeout(record, 1000 / 20);
    }
  };

  $('.play', DomElement).addEventListener('click', () => {
    isPlaying = true;
    audio.play();
    record();
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    bars.forEach((bar, index) => {
      bars[index].style.transform = `scaleY(${0})`;
    });
  });


  return DomElement;
};

module.exports = AudioMessage;
