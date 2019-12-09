const { html, $ } = require('@forgjs/noframework');

const VideoInput = (eventEmitter) => {
  const DomElement = html`<div class="video-input">
    <video autoplay></video>
  </div>`;

  let imageCapture = null;
  let mediaStream = null;
  const video = $('video', DomElement);

  eventEmitter.subscribe('start-video', async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = mediaStream;
      imageCapture = new ImageCapture(mediaStream.getVideoTracks()[0]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });

  eventEmitter.subscribe('stop-video', () => {
    mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
  });

  window.e = eventEmitter;

  eventEmitter.subscribe('take-photo', async () => {
    try {
      const frame = await imageCapture.takePhoto();
      eventEmitter.emit('photo', URL.createObjectURL(frame), frame);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });


  return DomElement;
};

module.exports = VideoInput;
