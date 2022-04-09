let camera_button = $(".btn-record-audio-video").get(0);
let video = $("#video-audio-video").get(0);
let videoPlayBack = $("#video-playback-audio-video").get(0);
let willUseAudio = true;
let toggleAudio = $('#btn-video-audio-toggle-audio');
let start_button = $("#btn-start-rec--audio-video").get(0);
let stop_button = $("#btn-stop-rec--audio-video").get(0);
let play_button = $('#btn-play-rec-audio-video').get(0);
let download_link = $("#download-video").get(0);
let currentTimeElem = $('#vid-audio--cur-time');
let maxTimeElem = $('#vid-audio--max-time');
let updateInterval;



// let logElement = document.getElementById("log");

let recordingTimeMS = 5000;

let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];

toggleAudio.on('click', function () {
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
    currentTimeElem.text(calculateTime(Math.floor(video.currentTime)));



    // audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    rafVid = requestAnimationFrame(whilePlayingVideo);
}

const calculateTime = (secs) => {
    const hour = Math.floor(secs / 3600);
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const returnedHour = hour < 10 ? `0${hour}` : `${hour}`;
    return `${returnedHour}:${returnedMinutes}:${returnedSeconds}`;
}


function format(seconds) {
    var numhours = parseInt(Math.floor(((seconds % 31536000) % 86400) / 3600), 10);
    var numminutes = parseInt(Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 10);
    var numseconds = parseInt((((seconds % 31536000) % 86400) % 3600) % 60, 10);
    return ((numhours < 10) ? "0" + numhours : numhours) +
        ":" + ((numminutes < 10) ? "0" + numminutes : numminutes) +
        ":" + ((numseconds < 10) ? "0" + numseconds : numseconds);
}

function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}

function startRecording(stream, lengthInMS) {
    let recorder = new MediaRecorder(stream);
    let data = [];

    recorder.ondataavailable = event => data.push(event.data);
    recorder.start();
    // log(recorder.state + " for " + (lengthInMS / 1000) + " seconds...");

    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = event => reject(event.name);

    });

    let recorded = wait(lengthInMS).then(
        () => recorder.state == "recording" && recorder.stop()
    );

    recorder.addEventListener('start', function () {
        // console.log(recorder.state);
        markPresent();
        stop_button.style.display = 'block';
        start_button.style.display = 'none';
    });

    recorder.addEventListener('stop', function () {
        clearInterval(updateInterval);
        currentTimeElem.text(calculateTime(0));
        //video.volume = 1;
        console.log("vid duration " + video.duration);
        maxTimeElem.text(calculateTime(video.duration));


        stop_button.style.display = 'none';
        start_button.style.display = 'block';
        play_button.style.display = 'block';
    });



    return Promise.all([
            stopped,
            recorded
        ])
        .then(() => data);
}

function stop(stream) {
    stream.getTracks().forEach(track => track.stop());
}

camera_button.addEventListener("click", function () {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: willUseAudio
    }).then(stream => {
        video.srcObject = stream;
        video.play();
        // downloadButton.href = stream;
        video.captureStream = video.captureStream || video.mozCaptureStream;
        video.style.display = 'block';
        $('.navigation-audio-video').css('display', 'none');
        $('.navigation-audio-video').parent().children('.custom-vid-player').css('display', 'block');
        $("#video-audio-video").parent().css('background-color', '#000000');
        camera_button.style.display = 'none';
        return new Promise(resolve => video.onplaying = resolve);
    });
});

start_button.addEventListener("click", function () {
    startRecording(video.captureStream(), recordingTimeMS)
        .then(recordedChunks => {
            let recordedBlob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            //video.srcObject = null;
            video.style.display = 'none';
            videoPlayBack.src = 'block';
            videoPlayBack.src = URL.createObjectURL(recordedBlob);



            // downloadButton.href = video.src;
            // downloadButton.download = "RecordedVideo.webm";

            // log("Successfully recorded " + recordedBlob.size + " bytes of " +
            //     recordedBlob.type + " media.");


        })
    // .catch();
}, false);

stop_button.addEventListener("click", function () {
    stop(video.srcObject);
}, false);

play_button.addEventListener('click', function () {
    if (video.paused || video.ended) {
        video.play();
        requestAnimationFrame(whilePlayingVideo);
    } else {
        video.pause();
        cancelAnimationFrame(rafVid);
    };
});

video.addEventListener('play', function () {
    changeButtonState('playpause');
    // videoControls.get(0).setAttribute('data-state', 'hidden');
}, false);

video.addEventListener('pause', function () {
    changeButtonState('playpause');
    // videoControls.get(0).setAttribute('data-state', 'visible');
}, false);

var changeButtonState = function (type) {
    // Play/Pause button
    if (type == 'playpause') {
        if (video.paused || video.ended) {
            play_button.setAttribute('data-state', 'play');
            play_button.children[0].src = "../assets/icons/play on icon.svg";
            // bigPlayImg.src = "../assets/icons/play frame.svg";
        } else {
            if (!video.srcObject) {
                play_button.setAttribute('data-state', 'pause');
                play_button.children[0].src = "../assets/icons/pause-button.png";
            }
            // bigPlayImg.src = "../assets/icons/time.svg";
        }
    }
    // Mute button
    else if (type == 'mute') {
        mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
    }
}

// camera_button.addEventListener('click', async function () {
//     camera_stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: willUseAudio
//     });
//     video.srcObject = camera_stream;
// video.style.display = 'block';
// $('.navigation-audio-video').css('display', 'none');
// $('.navigation-audio-video').parent().children('.custom-vid-player').css('display', 'block');
// $("#video-audio-video").parent().css('background-color', '#000000');
// // video.parentNode.style.backgroundColor = '#00000';
// console.log(video.parentNode.style.backgroundColor);
// camera_button.style.display = 'none';
// });

// start_button.addEventListener('click', function () {
//     // set MIME type of recording as video/webm
//     media_recorder = new MediaRecorder(camera_stream, {
//         mimeType: 'video/webm'
//     });

//     stop_button.style.display = 'block';
//     start_button.style.display = 'none';

//     // event : new recorded video blob available 
//     media_recorder.addEventListener('dataavailable', function (e) {
//         blobs_recorded.push(e.data);
//     });

//     // event : recording stopped & all blobs sent
//     media_recorder.addEventListener('stop', function () {
//         // create local object URL from the recorded video blobs
//         let video_local = URL.createObjectURL(new Blob(blobs_recorded, {
//             type: 'video/webm'
//         }));
//         stop_button.style.display = 'none';
//         start_button.style.display = 'block';
//         play_button.style.display = 'block';
//         download_link.href = video_local;
//     });

//     // start recording with each recorded blob having 1 second video
//     media_recorder.start(1000);
// });

// stop_button.addEventListener('click', function () {
//     media_recorder.stop();
// });