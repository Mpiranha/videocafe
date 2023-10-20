let camera_button = $(".btn-record-audio-video").get(0);
let video = $("#video-audio-video").get(0);
let videoPlayBack = $("#video-playback-audio-video").get(0);
let willUseAudio = true;
let toggleAudio = $("#btn-video-audio-toggle-audio");
let start_button = $("#btn-start-rec--audio-video").get(0);
let stop_button = $("#btn-stop-rec--audio-video").get(0);
let play_button = $("#btn-play-rec-audio-video").get(0);
let download_link = $("#download-video").get(0);
let currentTimeElem = $("#vid-audio--cur-time");
let maxTimeElem = $("#vid-audio--max-time");
let updateInterval;

// let logElement = document.getElementById("log");

let recordingTimeMS = 5000;

let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];

toggleAudio.on("click", function () {
  willUseAudio = !willUseAudio;
});

function markPresent() {
  window.markDate = new Date();
  updateClock();
  updateInterval = setInterval(updateClock, 1000);
}

function updateClock() {
  // console.log(state);

  var currDate = new Date();
  var diff = currDate - markDate;

  currentTimeElem.text(format(diff / 1000));

  // setTimeout(function () {
  //     updateClock()
  // }, 1000);
}

const whilePlayingVideo = () => {
  currentTimeElem.text(calculateTime(Math.floor(videoPlayBack.currentTime)));

  // audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
  rafVid = requestAnimationFrame(whilePlayingVideo);
};

const calculateTime = (secs) => {
  const hour = Math.floor(secs / 3600);
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const returnedHour = hour < 10 ? `0${hour}` : `${hour}`;
  return `${returnedHour}:${returnedMinutes}:${returnedSeconds}`;
};

function format(seconds) {
  var numhours = parseInt(
    Math.floor(((seconds % 31536000) % 86400) / 3600),
    10
  );
  var numminutes = parseInt(
    Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
    10
  );
  var numseconds = parseInt((((seconds % 31536000) % 86400) % 3600) % 60, 10);
  return (
    (numhours < 10 ? "0" + numhours : numhours) +
    ":" +
    (numminutes < 10 ? "0" + numminutes : numminutes) +
    ":" +
    (numseconds < 10 ? "0" + numseconds : numseconds)
  );
}

function checkIsApproved() {
  return navigator.mediaDevices.enumerateDevices().then((infos) => {
    console.log([...infos].map((i) => i.label));
    return [...infos].some((info) => info.label !== "");
  });
}

function wait(delayInMS) {
  return new Promise((resolve) => setTimeout(resolve, delayInMS));
}

function startRecording(stream, lengthInMS) {
  let recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = (event) => data.push(event.data);
  recorder.start();
  // log(recorder.state + " for " + (lengthInMS / 1000) + " seconds...");

  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = (event) => reject(event.name);
  });

  let recorded = wait(lengthInMS).then(
    () => recorder.state == "recording" && recorder.stop()
  );

  recorder.addEventListener("start", function () {
    // console.log(recorder.state);
    markPresent();
    stop_button.style.display = "block";
    start_button.style.display = "none";
  });

  recorder.addEventListener("stop", function () {
    stop(video.srcObject);
    clearInterval(updateInterval);
    currentTimeElem.text(calculateTime(0));
    //video.volume = 1;
    console.log("vid duration " + videoPlayBack.duration);
    // maxTimeElem.text(calculateTime(videoPlayBack.duration));

    // setTimeout(function() {
    //     maxTimeElem.text(calculateTime(videoPlayBack.duration));
    //     console.log("vid duration " + videoPlayBack.duration);
    // }, 4000)

    videoPlayBack.addEventListener("loadedmetadata", function () {
      // maxTimeElem.text(calculateTime(Math.floor(videoPlayBack.duration)));

      if (videoPlayBack.duration == Infinity) {
        videoPlayBack.currentTime = 1e101;
        videoPlayBack.ontimeupdate = function () {
          this.ontimeupdate = () => {
            return;
          };
          videoPlayBack.currentTime = 0;
          maxTimeElem.text(calculateTime(Math.floor(videoPlayBack.duration)));
          return;
        };
      }
    });

    if (videoPlayBack.readyState >= 2) {
      if (videoPlayBack.duration == Infinity) {
        videoPlayBack.currentTime = 1e101;
        videoPlayBack.ontimeupdate = function () {
          this.ontimeupdate = () => {
            return;
          };
          videoPlayBack.currentTime = 0;
          maxTimeElem.text(calculateTime(Math.floor(videoPlayBack.duration)));
          return;
        };
      }
    }

    stop_button.style.display = "none";
    start_button.style.display = "block";
    play_button.style.display = "block";
  });

  return Promise.all([stopped, recorded]).then(() => data);
}

function stop(stream) {
  stream.getTracks().forEach((track) => track.stop());
}

function startVideoDisplay() {
  video.volume = 0;
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: willUseAudio,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      // downloadButton.href = stream;
      video.captureStream = video.captureStream || video.mozCaptureStream;
      video.style.display = "block";
      videoPlayBack.style.display = "none";
      play_button.style.display = "none";
      currentTimeElem.text(calculateTime(0));
      $(".navigation-audio-video").css("display", "none");
      $(".navigation-audio-video")
        .parent()
        .children(".custom-vid-player")
        .css("display", "block");
      $("#video-audio-video").parent().css("background-color", "#000000");
      camera_button.style.display = "none";
      return new Promise((resolve) => (video.onplaying = resolve));
    });
}

camera_button.addEventListener("click", function () {
  startVideoDisplay();
});

start_button.addEventListener(
  "click",
  function () {
    checkIsApproved().then((res) => {
      if (!res) {
        startVideoDisplay();
      }
    });
    startRecording(video.captureStream(), recordingTimeMS).then(
      (recordedChunks) => {
        let recordedBlob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        //video.srcObject = null;
        video.style.display = "none";
        videoPlayBack.style.display = "block";
        videoPlayBack.src = URL.createObjectURL(recordedBlob);

        // downloadButton.href = video.src;
        // downloadButton.download = "RecordedVideo.webm";

        // log("Successfully recorded " + recordedBlob.size + " bytes of " +
        //     recordedBlob.type + " media.");
      }
    );
    // .catch();
  },
  false
);

stop_button.addEventListener(
  "click",
  function () {
    stop(video.srcObject);
  },
  false
);

play_button.addEventListener("click", function () {
  if (videoPlayBack.paused || videoPlayBack.ended) {
    videoPlayBack.play();
    requestAnimationFrame(whilePlayingVideo);
  } else {
    videoPlayBack.pause();
    cancelAnimationFrame(rafVid);
  }
});

videoPlayBack.addEventListener(
  "play",
  function () {
    changeButtonState("playpause");
    // videoControls.get(0).setAttribute('data-state', 'hidden');
  },
  false
);

videoPlayBack.addEventListener(
  "pause",
  function () {
    changeButtonState("playpause");
    // videoControls.get(0).setAttribute('data-state', 'visible');
  },
  false
);

var changeButtonState = function (type) {
  // Play/Pause button
  if (type == "playpause") {
    if (videoPlayBack.paused || videoPlayBack.ended) {
      play_button.setAttribute("data-state", "play");
      play_button.children[0].src = "../assets/icons/play on icon.svg";
      // bigPlayImg.src = "../assets/icons/play frame.svg";
    } else {
      // if (!videoPlayBack.srcObject) {
      play_button.setAttribute("data-state", "pause");
      play_button.children[0].src = "../assets/icons/pause-button.png";
      // }
      // bigPlayImg.src = "../assets/icons/time.svg";
    }
  }
  // Mute button
  else if (type == "mute") {
    mute.setAttribute("data-state", videoPlayBack.muted ? "unmute" : "mute");
  }
};

// Audio Recording

let audio_start_button = $(".btn-record-audio").get(0);
let audio = $("#audio-recorder").get(0);
let audioPlayBack = $("#audio-player").get(0);
let start_rec_button = $("#btn-start-rec--audio-video").get(0);
let stop_rec_button = $("#btn-stop-rec--audio-video").get(0);
let play_audio_button = $("#btn-play-rec-audio-video").get(0);
let download_audio_link = $("#download-video").get(0);
let audio_currentTimeElem = $("#audio--cur-time");
let audio_maxTimeElem = $("#audio--max-time");
let can = $("#audio_display").get(0);
let canCtx = can.getContext("2d");

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let analyser;
var array;

let javascriptNode;

audio_start_button.addEventListener("click", function () {
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  array = new Uint8Array(analyser.frequencyBinCount);

  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
  startAudioDisplay();
});

function startAudioDisplay() {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      let microphone = audioContext.createMediaStreamSource(stream);
      audio.volume = 0;
      audio.srcObject = stream;
      audio.play();
      // downloadButton.href = stream;
      audio.captureStream = audio.captureStream || audio.mozCaptureStream;
      // video.style.display = 'block';
      audioPlayBack.style.display = "none";
      // play_button.style.display = 'none';
      audio_currentTimeElem.text(calculateTime(0));
      $(".navigation-audio").css("display", "none");
      $(".navigation-audio")
        .parent()
        .children(".custom-vid-player")
        .css("display", "block");
      // $("#video-audio-video").parent().css('background-color', '#000000');

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      analyser.maxDecibels = -30;
      analyser.minDecibels = -80;

      console.log(
        "min decibel " +
          analyser.minDecibels +
          "max decibel " +
          analyser.maxDecibels
      );
      can.setAttribute(
        "height",
        $(".custom-aud-player").get(0).scrollHeight - 43
      );
      can.setAttribute("width", $(".custom-aud-player").get(0).scrollWidth);

      // wavesurfer.microphone.start();
      loopingFunction();
      // javascriptNode.onaudioprocess = () => {
      //   array = new Uint8Array(analyser.frequencyBinCount);
      //   analyser.getByteFrequencyData(array);
      //   var values = 0;

      //   var length = array.length;
      //   for (var i = 0; i < length; i++) {
      //     values += array[i];
      //   }

      //   var average = values / length;
      //   this.average = average;
      //   console.log(Math.round(average));
      // };
      audio_start_button.style.display = "none";
      return new Promise((resolve) => (audio.onplaying = resolve));
    });
  // draw();
}

// window.onresize = function () {
//   can.setAttribute("height", $(".custom-aud-player").get(0).scrollHeight - 43);
//   can.setAttribute("width", $(".custom-aud-player").get(0).scrollWidth);
// };

function loopingFunction() {
  requestAnimationFrame(loopingFunction);
  analyser.getByteFrequencyData(array);
  draw(array);
}

function draw(data) {
  data = [...data];

  canCtx.clearRect(0, 0, can.offsetWidth, can.offsetHeight);
  canCtx.fillStyle = "#000000";
  canCtx.fillRect(0, 0, can.offsetWidth, can.offsetHeight);
  canCtx.strokeStyle = "#c17c10";
  canCtx.strokeSize = 100;
  let space = can.offsetWidth / data.length;
  data.forEach((value, i) => {
    canCtx.beginPath();
    canCtx.moveTo(space * i, 0); //x,y
    canCtx.lineTo(space * i, 0 + value); //x,y
    canCtx.stroke();
  });
}

// var wavesurfer;

// wavesurfer = WaveSurfer.create({
//   container: "#audio_display",
//   waveColor: "black",
//   interact: false,
//   cursorWidth: 0,
//   plugins: [WaveSurfer.microphone.create()],
// });

// function draw() {
//   const drawVisual = requestAnimationFrame(draw);
//   //analyser.getByteTimeDomainData(array);
//   canCtx.fillStyle = "rgb(0, 0, 0)";
//   canCtx.fillRect(0, 0, can.offsetWidth, can.offsetHeight);
//   canCtx.lineWidth = 1;
//   canCtx.strokeStyle = "rgb(200, 200, 200)";
//   canCtx.beginPath();
//   const sliceWidth = can.offsetWidth / analyser.frequencyBinCount;
//   let x = 0;
//   for (let i = 0; i < analyser.frequencyBinCount; i++) {
//     const v = array[i] / 128.0;
//     const y = v * (can.offsetHeight / 2);
//     if (i === 0) {
//       canCtx.moveTo(x, y);
//     } else {
//       canCtx.lineTo(x, y);
//     }
//     x += sliceWidth;
//   }

//   canCtx.lineTo(can.offsetWidth, can.offsetHeight / 2);
//   canCtx.stroke();
// }

// function draw() {
//   drawVisual = requestAnimationFrame(draw);

//   analyser.getByteFrequencyData(array);

//   canCtx.fillStyle = "rgb(0, 0, 0)";
//   canCtx.fillRect(0, 0, can.offsetWidth, can.offsetHeight);

//   const barWidth = (can.offsetWidth / analyser.frequencyBinCount) * 2.5;
//   canCtx.beginPath();
//   let barHeight;
//   let x = 0;

//   for (let i = 0; i < analyser.frequencyBinCount; i++) {
//     barHeight = array[i] / 2;

//     canCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
//     console.log()
//     canCtx.fillRect(x, can.offsetHeight - barHeight / 2, barWidth, barHeight);

//     x += barWidth + 1;
//   }
// }
