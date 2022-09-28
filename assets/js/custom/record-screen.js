let btn_start = $("#record-screen-only-btn");
let video = $("#video-display").get(0);
let videoPlayBack = $("#video-playback").get(0);
let currentTimeElem = $('#vid-audio--cur-time');
let maxTimeElem = $('#vid-audio--max-time');
let start_button = $("#btn-start-rec--audio-video").get(0);
let stop_button = $("#btn-stop-rec--audio-video").get(0);
let play_button = $('#btn-play-rec-audio-video').get(0);
let updateInterval;

let recordingTimeMS = 5000;

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

        videoPlayBack.addEventListener('loadedmetadata', function () {
            // maxTimeElem.text(calculateTime(Math.floor(videoPlayBack.duration)));

            if (videoPlayBack.duration == Infinity) {
                videoPlayBack.currentTime = 1e101;
                videoPlayBack.ontimeupdate = function () {
                    this.ontimeupdate = () => {
                        return;
                    }
                    videoPlayBack.currentTime = 0;
                    maxTimeElem.text(calculateTime(Math.floor(videoPlayBack.duration)));
                    return;
                }
            }
        });

        if (videoPlayBack.readyState >= 2) {
            if (videoPlayBack.duration == Infinity) {
                videoPlayBack.currentTime = 1e101;
                videoPlayBack.ontimeupdate = function () {
                    this.ontimeupdate = () => {
                        return;
                    }
                    videoPlayBack.currentTime = 0;
                    maxTimeElem.text(calculateTime(Math.floor(videoPlayBack.duration)));
                    return;
                }
            }
        }


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

function startVideoDisplay() {
    navigator.mediaDevices.getDisplayMedia({
        video: true,
    }).then(stream => {
        video.srcObject = stream;
        video.play();

        video.captureStream = video.captureStream || video.mozCaptureStream;
        video.style.display = 'block';
        videoPlayBack.style.display = 'none';
        $('.navigation-screen-only').css('display', 'none');
        $('.navigation-screen-only').parent().children('.custom-vid-player').css('display', 'block');
        $("#video-display").parent().css('background-color', '#000000');
        // camera_button.style.display = 'none';
        return new Promise(resolve => video.onplaying = resolve);
    });
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

function checkIsApproved() {
    return navigator.mediaDevices.enumerateDevices()
        .then(infos => {
            console.log([...infos].map(i => i.label));
            return [...infos].some(info => info.label !== "")
        });
}

function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}

function stop(stream) {
    stream.getTracks().forEach(track => track.stop());
}

btn_start.on("click", async function () {
    startVideoDisplay();
});

start_button.addEventListener("click", function () {

    checkIsApproved().then((res) => {

        if (!res) {
            startVideoDisplay();
        }
    });
    startRecording(video.captureStream(), recordingTimeMS)
        .then(recordedChunks => {
            let recordedBlob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            //video.srcObject = null;
            video.style.display = 'none';
            videoPlayBack.style.display = 'block';
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

const whilePlayingVideo = () => {
    currentTimeElem.text(calculateTime(Math.floor(videoPlayBack.currentTime)));



    // audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    rafVid = requestAnimationFrame(whilePlayingVideo);
}



play_button.addEventListener('click', function () {
    if (videoPlayBack.paused || videoPlayBack.ended) {
        videoPlayBack.play();
        requestAnimationFrame(whilePlayingVideo);
    } else {
        videoPlayBack.pause();
        cancelAnimationFrame(rafVid);
    };
});

videoPlayBack.addEventListener('play', function () {
    changeButtonState('playpause');
    // videoControls.get(0).setAttribute('data-state', 'hidden');
}, false);

videoPlayBack.addEventListener('pause', function () {
    changeButtonState('playpause');
    // videoControls.get(0).setAttribute('data-state', 'visible');
}, false);

var changeButtonState = function (type) {
    // Play/Pause button
    if (type == 'playpause') {
        if (videoPlayBack.paused || videoPlayBack.ended) {
            play_button.setAttribute('data-state', 'play');
            play_button.children[0].src = "../assets/icons/play on icon.svg";
            // bigPlayImg.src = "../assets/icons/play frame.svg";
        } else {
            // if (!videoPlayBack.srcObject) {
            play_button.setAttribute('data-state', 'pause');
            play_button.children[0].src = "../assets/icons/pause-button.png";
            // }
            // bigPlayImg.src = "../assets/icons/time.svg";
        }
    }
    // Mute button
    else if (type == 'mute') {
        mute.setAttribute('data-state', videoPlayBack.muted ? 'unmute' : 'mute');
    }
}
