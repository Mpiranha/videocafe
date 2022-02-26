const calculateTime = (secs) => {
    const hour = Math.floor(secs / 3600);
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const returnedHour = hour < 10 ? `0${hour}` : `${hour}`;
    return `${returnedHour}:${returnedMinutes}:${returnedSeconds}`;
}


let videoContainer = $('.video-outter');

videoContainer.each(function () {
    let container = $(this).get(0);


    let video = $(this).find('video').get(0);

    // let videoControls = $(this).find('.controls');

    let playpause = $(this).find('.btn-vid-play-pause').get(0);
    let bigPlay = $(this).find('.btn-play-settings').get(0);
    // let bigPlayImg = $(this).find('.btn-play-settings img').get(0);
    let playpauseImage = $(this).find('.btn-vid-play-pause img').get(0);

    let progress = $(this).find('#progress').get(0);

    let progressBar = $(this).find('#progress-bar').get(0);

    let vidCurTime = $(this).find('.vid-current-time').get(0);

    let vidLength = $(this).find('.vid-length').get(0);

    let vidInnerContainer = $(this).find('.video-inner');

    vidLength.textContent = calculateTime(Math.floor(video.duration));

    let rafVid = null;

    var handleFullscreen = function () {
        // If fullscreen mode is active...	
        if (isFullScreen()) {
            vidInnerContainer.css('height', '350px');
            // ...exit fullscreen mode
            // (Note: this can only be called on document)
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
            setFullscreenData(false);
        } else {
            //vidInnerContainer.css('height', '100%');
            // ...otherwise enter fullscreen mode
            // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
            if (container.requestFullscreen) container.requestFullscreen();
            else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
            else if (container.webkitRequestFullScreen) {
                // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and 
                // ensures that our custom controls are visible:
                // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
                // figure[data-fullscreen=true] .controls { z-index:2147483647; }
                video.webkitRequestFullScreen();
            } else if (container.msRequestFullscreen) container.msRequestFullscreen();
            setFullscreenData(true);
        }
    }

    var fullscreen = $(this).find('.btn-fs').get(0);

    var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

    if (!fullScreenEnabled) {
        fullscreen.style.display = 'none';
    }

    var isFullScreen = function () {
        return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    }

    var setFullscreenData = function (state) {
        container.setAttribute('data-fullscreen', !!state);
        // Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
        fullscreen.setAttribute('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
    } // Checks if the document is currently in fullscreen mode


    // videoControls.get(0).setAttribute('data-state', 'visible');

    var supportsProgress = (document.createElement('progress').max !== undefined);
    if (!supportsProgress) progress.setAttribute('data-state', 'fake');


    var changeButtonState = function (type) {
        // Play/Pause button
        if (type == 'playpause') {
            if (video.paused || video.ended) {
                playpause.setAttribute('data-state', 'play');
                playpauseImage.src = "../assets/icons/play one icon.svg";
                // bigPlayImg.src = "../assets/icons/play frame.svg";
            } else {
                playpause.setAttribute('data-state', 'pause');
                playpauseImage.src = "../assets/icons/time.svg"
                // bigPlayImg.src = "../assets/icons/time.svg";
            }
        }
        // Mute button
        else if (type == 'mute') {
            mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
        }
    }

    video.addEventListener('loadedmetadata', function () {
        progress.setAttribute('max', video.duration);
    });

    video.addEventListener('timeupdate', function () {
        // For mobile browsers, ensure that the progress element's max attribute is set
        if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
        progress.value = video.currentTime;
        progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
    });

    video.addEventListener('play', function () {
        changeButtonState('playpause');
        // videoControls.get(0).setAttribute('data-state', 'hidden');
    }, false);

    video.offsetParent.addEventListener("mouseover", function () {
        // videoControls.get(0).setAttribute('data-state', 'visible');
    });

    video.offsetParent.addEventListener("mouseout", function () {
        if (video.paused) {
            return;
        }
        // videoControls.get(0).setAttribute('data-state', 'hidden');
    });

    video.addEventListener('pause', function () {
        changeButtonState('playpause');
        // videoControls.get(0).setAttribute('data-state', 'visible');
    }, false);

    playpause.addEventListener('click', function (e) {
        if (video.paused || video.ended) {
            video.play();
            requestAnimationFrame(whilePlayingVideo);
        } else {
            video.pause();
            cancelAnimationFrame(rafVid);
        };
    });

    bigPlay.addEventListener('click', function (e) {
        if (video.paused || video.ended) {
            video.play();
            requestAnimationFrame(whilePlayingVideo);
        } else {
            video.pause();
            cancelAnimationFrame(rafVid);
        };
    });

    progress.addEventListener('click', function (e) {
        // var pos = (e.pageX - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
        // video.currentTime = pos * video.duration;
        var pos = e.offsetX;
        video.currentTime = pos * video.duration / this.offsetWidth;
        vidCurTime.textContent = calculateTime(Math.floor(video.currentTime));
        // console.log(pos);
    }, false);

    fullscreen.addEventListener('click', function (e) {
        handleFullscreen();
    });

    // Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
    document.addEventListener('fullscreenchange', function (e) {
        setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
    });
    document.addEventListener('webkitfullscreenchange', function () {
        setFullscreenData(!!document.webkitIsFullScreen);
    });
    document.addEventListener('mozfullscreenchange', function () {
        setFullscreenData(!!document.mozFullScreen);
    });
    document.addEventListener('msfullscreenchange', function () {
        setFullscreenData(!!document.msFullscreenElement);
    });




    const whilePlayingVideo = () => {
        vidCurTime.textContent = calculateTime(Math.floor(video.currentTime));


        // audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
        rafVid = requestAnimationFrame(whilePlayingVideo);
    }

    $('#reset-player-color').click(function () {
        if ($(this).is(':checked')) {
            $('#skin-color-input').val('#2c0640');
            $('.clr-field').css('color', '#2c0640');
            $('#skin-color-input').trigger('change');
        }
    });

    $('#skin-color-input').on('change', function () {
        $('.vid-controls').css('background-color', $(this).val());
    });


    $('.logo-width').on('input', function () {
        $('.logo-height').val(Math.ceil($(this).val() / 1.5));
        // $('.logo-height').trigger('input');
        $('.vid-logo').css('width', $(this).val() + 'px');
        $('.vid-logo').css('height', $('.logo-height').val() + 'px');
    });

    $('.logo-height').on('input', function () {
        $('.logo-width').val(1.5 * $(this).val());
        // $('.logo-width').trigger('input');

        $('.vid-logo').css('height', $(this).val() + 'px');
        $('.vid-logo').css('width', $('.logo-width').val() + 'px');
    });

    const REGEXP = /[0-9]/;
    $('.number-input').each(function () {
        $(this).on('keypress', function (event) {
            console.log(event.key);
            if (!REGEXP.test(event.key)) {
                event.preventDefault();
            }
        });
    });

    $('#vid-logo-pos-input').on('change', function () {

        if ($(this).val() == 'top-left') {
            $('.vid-logo-display').css({
                'display': 'block',
                'position': 'absolute',
                'left': '16px',
                'right': 'initial',
            });
            $('.logo-size-wrap').css('display', 'block');
        } else if ($(this).val() == 'top-right') {
            $('.vid-logo-display').css({
                'display': 'block',
                'position': 'absolute',
                'right': '16px',
                'left': 'initial',
            });
            $('.logo-size-wrap').css('display', 'block');
        } else if ($(this).val() == 'play-bar') {
            $('.vid-logo-display').css(
                'display', 'none');
            $('.vid-controls .vid-logo-display').css({
                'display': 'table',
                'position': 'static'
            });

            $('.vid-controls .vid-logo-display img').css('width', 'auto');



            $('.logo-size-wrap').css('display', 'none');


        }
    });

    $('[data-target=".show-logo-trigger"]').on('click', function () {
        if ($(this).is(':checked')) {
            $('.vid-logo-display').css('display', 'block');
        } else {
            $('.vid-logo-display').css('display', 'none');
        }

    });


    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#selected-logo').attr('src', e.target.result);
                $('.vid-logo').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#vid-img-upload").change(function () {
        readURL(this);
    });

    $("#play-color-input").on("change", function () {
        $(".btn-play-select").css("color", $(this).val());
        $(".btn-play-settings").css("color", $(this).val());
    });

    $('.btn-play-select').each(function () {
        $(this).on('click', function () {
            removeSelected($('.btn-play-select'));

            $(this).addClass('selected');

            $('.btn-play-settings i').attr('class', $(this).children('i').attr('class'));
        });
    });

    $('.anim-select').on('change', function () {
        $(".btn-play-settings").attr('class', 'btn no-shadow btn-play-settings ' + $(this).val());
        if ($('#set-infinite').is(':checked')) {
            $(".btn-play-settings").addClass('animate__infinite');
        }
    });

    $('#set-infinite').on('change', function () {
        if ($(this).is(':checked')) {
            $(".btn-play-settings").addClass('animate__infinite');
        } else {
            $(".btn-play-settings").removeClass('animate__infinite');
        }
    });

    function removeSelected(arr) {
        for (let i = 0; i < arr.length; i++) {

            arr[i].classList.remove('selected');
        }

    }




});