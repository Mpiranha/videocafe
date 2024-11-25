$(function () {
  $(".confirm__del_input").on("input", function () {
    if ($(this).val() == "DELETE") {
      $(".btn-del-vid").removeAttr("disabled", "false");
    } else {
      $(".btn-del-vid").attr("disabled", "disabled");
    }
  });

  $(".btn-edit-trigger").each(function (indx, elem) {
   
    elem.addEventListener("click", function () {
      var tag = elem.getAttribute("data-target");
      document.querySelector(tag).classList.add("editting");
      // console.log(tag);
      // $($(this).attr("data-target")).addClass("editting");
    });
  });

  $(".btn-done-edit").each(function (indx, elem) {
   
    elem.addEventListener("click", function () {
      var tag = elem.getAttribute("data-target");
      document.querySelector(tag).classList.remove("editting");
      // console.log(tag);
      // $($(this).attr("data-target")).addClass("editting");
    });
  });



  $(document).mouseup(function (e) {
    var container = $(".close-click-outside");

    if (container.hasClass("show-visible")) {
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass("show-visible");
      }
    }

    if (container.hasClass("show")) {
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass("show");
      }
    }
  });

  const calculateTime = (secs) => {
    const hour = Math.floor(secs / 3600);
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const returnedHour = hour < 10 ? `0${hour}` : `${hour}`;
    return `${returnedHour}:${returnedMinutes}:${returnedSeconds}`;
  };

  $('[data-toggle="tooltip"]').tooltip();

  var allAudioEls = $("audio");

  function pauseAllAudio() {
    allAudioEls.each(function () {
      var a = $(this).get(0);
      a.pause();
      $(this)
        .siblings()
        .find(".play-img")
        .attr("src", "../assets/icons/play one icon.svg");
    });
  }

  const playIconContainer = $(".play-icon");

  playIconContainer.each(function () {
    const playIcon = $(this);
    var audioFile = $(this).siblings(".audio-file");
    const currentTimeContainer = $(this).siblings().find(".current-time");
    let raf = null;
    let progress = $(this).siblings().find("#progress").get(0);
    let progressBar = $(this).siblings().find("#progress-bar").get(0);

    playIcon.on("click", function () {
      if (audioFile.get(0).paused) {
        pauseAllAudio();
        $(this).children().attr("src", "../assets/icons/time.svg");
        requestAnimationFrame(whilePlaying);
        audioFile.trigger("play");
      } else {
        $(this).children().attr("src", "../assets/icons/play one icon.svg");
        cancelAnimationFrame(raf);
        audioFile.trigger("pause");
      }
    });
    if (progress) {
      var supportsProgress =
        document.createElement("progress").max !== undefined;
      if (!supportsProgress) progress.setAttribute("data-state", "fake");
    }
    if (audioFile.get(0).readyState > 2) {
      if (progress) progress.setAttribute("max", audioFile.get(0).duration);
      // displayBufferedAmount();
    } else {
      audioFile.get(0).addEventListener("loadedmetadata", () => {
        if (progress)
          // displayBufferedAmount();
          progress.setAttribute("max", audioFile.get(0).duration);
      });
    }

    if (progress) {
      audioFile.get(0).addEventListener("timeupdate", function () {
        // For mobile browsers, ensure that the progress element's max attribute is set
        if (!progress.getAttribute("max"))
          progress.setAttribute("max", video.duration);
        progress.value = audioFile.get(0).currentTime;
        progressBar.style.width =
          Math.floor(
            (audioFile.get(0).currentTime / audioFile.get(0).duration) * 100
          ) + "%";
      });

      progress.addEventListener(
        "click",
        function (e) {
          // var pos = (e.pageX - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
          // video.currentTime = pos * video.duration;
          var pos = e.offsetX;
          audioFile.get(0).currentTime =
            (pos * audioFile.get(0).duration) / this.offsetWidth;
          currentTimeContainer.textContent = calculateTime(
            Math.floor(audioFile.get(0).currentTime)
          );
          // console.log(pos);
        },
        false
      );
    }

    // audioFile.get(0).addEventListener('loadedmetadata', function () {

    //     progress.setAttribute('max', audioFile.get(0).duration);
    // });

    const whilePlaying = () => {
      currentTimeContainer.get(0).textContent = calculateTime(
        Math.floor(audioFile.get(0).currentTime)
      );

      if (audioFile.get(0).currentTime === audioFile.get(0).duration) {
        $(this).children().attr("src", "../assets/icons/play one icon.svg");
        audioFile.get(0).currentTime = 0;
        raf = null;
        audioFile.trigger("pause");
        // console.log(raf);
        cancelAnimationFrame(raf);
        return;
      }
      // audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
      raf = requestAnimationFrame(whilePlaying);
    };
  });

  let videoContainer = $(".stock-video-wrap");

  videoContainer.each(function () {
    let container = $(this).get(0);

    let video = $(this).find(".stock-video").get(0);

    let videoControls = $(this).find(".controls");

    let playpause = $(this).find(".playpause").get(0);
    let playpauseImage = $(this).find(".playpause img").get(0);

    let progress = $(this).find("#progress").get(0);

    let progressBar = $(this).find("#progress-bar").get(0);

    let vidCurTime = $(this).find(".vid-current-time").get(0);

    let rafVid = null;

    var handleFullscreen = function () {
      // If fullscreen mode is active...
      if (isFullScreen()) {
        // ...exit fullscreen mode
        // (Note: this can only be called on document)
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen)
          document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        setFullscreenData(false);
      } else {
        // ...otherwise enter fullscreen mode
        // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
        if (container.requestFullscreen) container.requestFullscreen();
        else if (container.mozRequestFullScreen)
          container.mozRequestFullScreen();
        else if (container.webkitRequestFullScreen) {
          // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and
          // ensures that our custom controls are visible:
          // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
          // figure[data-fullscreen=true] .controls { z-index:2147483647; }
          video.webkitRequestFullScreen();
        } else if (container.msRequestFullscreen)
          container.msRequestFullscreen();
        setFullscreenData(true);
      }
    };

    var fullscreen = $(this).find(".full-screen").get(0);

    var fullScreenEnabled = !!(
      document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled ||
      document.webkitSupportsFullscreen ||
      document.webkitFullscreenEnabled ||
      document.createElement("video").webkitRequestFullScreen
    );

    if (!fullScreenEnabled) {
      fullscreen.style.display = "none";
    }

    var isFullScreen = function () {
      return !!(
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement ||
        document.fullscreenElement
      );
    };

    var setFullscreenData = function (state) {
      container.setAttribute("data-fullscreen", !!state);
      // Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
      fullscreen.setAttribute(
        "data-state",
        !!state ? "cancel-fullscreen" : "go-fullscreen"
      );
    }; // Checks if the document is currently in fullscreen mode

    videoControls.get(0).setAttribute("data-state", "visible");

    var supportsProgress = document.createElement("progress").max !== undefined;
    if (!supportsProgress) progress.setAttribute("data-state", "fake");

    var changeButtonState = function (type) {
      // Play/Pause button
      if (type == "playpause") {
        if (video.paused || video.ended) {
          playpause.setAttribute("data-state", "play");
          playpauseImage.src = "../assets/icons/play one icon.svg";
        } else {
          playpause.setAttribute("data-state", "pause");
          playpauseImage.src =
            "../assets/icons/newones/icons/ICONS fRESH/PAUSE WHITE.png";
        }
      }
      // Mute button
      else if (type == "mute") {
        mute.setAttribute("data-state", video.muted ? "unmute" : "mute");
      }
    };

    video.addEventListener("loadedmetadata", function () {
      progress.setAttribute("max", video.duration);
    });

    video.addEventListener("timeupdate", function () {
      // For mobile browsers, ensure that the progress element's max attribute is set
      if (!progress.getAttribute("max"))
        progress.setAttribute("max", video.duration);
      progress.value = video.currentTime;
      progressBar.style.width =
        Math.floor((video.currentTime / video.duration) * 100) + "%";
    });

    video.addEventListener(
      "play",
      function () {
        changeButtonState("playpause");
        videoControls.get(0).setAttribute("data-state", "hidden");
      },
      false
    );

    video.offsetParent.addEventListener("mouseover", function () {
      videoControls.get(0).setAttribute("data-state", "visible");
    });

    video.offsetParent.addEventListener("mouseout", function () {
      if (video.paused) {
        return;
      }
      videoControls.get(0).setAttribute("data-state", "hidden");
    });

    video.addEventListener(
      "pause",
      function () {
        changeButtonState("playpause");
        videoControls.get(0).setAttribute("data-state", "visible");
      },
      false
    );

    playpause.addEventListener("click", function (e) {
      if (video.paused || video.ended) {
        video.play();
        requestAnimationFrame(whilePlayingVideo);
      } else {
        video.pause();
        cancelAnimationFrame(rafVid);
      }
    });

    progress.addEventListener(
      "click",
      function (e) {
        // var pos = (e.pageX - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
        // video.currentTime = pos * video.duration;
        var pos = e.offsetX;
        video.currentTime = (pos * video.duration) / this.offsetWidth;
        vidCurTime.textContent = calculateTime(Math.floor(video.currentTime));
        // console.log(pos);
      },
      false
    );

    fullscreen.addEventListener("click", function (e) {
      handleFullscreen();
    });

    // Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
    document.addEventListener("fullscreenchange", function (e) {
      setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
    });
    document.addEventListener("webkitfullscreenchange", function () {
      setFullscreenData(!!document.webkitIsFullScreen);
    });
    document.addEventListener("mozfullscreenchange", function () {
      setFullscreenData(!!document.mozFullScreen);
    });
    document.addEventListener("msfullscreenchange", function () {
      setFullscreenData(!!document.msFullscreenElement);
    });

    const whilePlayingVideo = () => {
      vidCurTime.textContent = calculateTime(Math.floor(video.currentTime));

      // audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
      rafVid = requestAnimationFrame(whilePlayingVideo);
    };
  });

  $(".workspace-prev").on("click", function () {
    $(".workspace-drop-down").toggleClass("show");
  });

  $(".btn-fall-wrap").on("click", function () {
    if ($(".navigation-box").attr("data-state") == "wrapped") {
      $(".navigation-box").attr("data-state", "unwrapped");
      $(".table-wrap").attr("data-state", "visible");
      $(".btn-fall-wrap img").css("transform", "rotateZ(180deg)");
    } else {
      $(".navigation-box").attr("data-state", "wrapped");
      $(".table-wrap").attr("data-state", "hidden");
      $(".btn-fall-wrap img").css("transform", "rotateZ(0deg)");
    }
  });

  $(".vc-btn-add-project").on("click", function () {
    $($(this).attr("data-target")).toggleClass("show");
  });

  $("[data-toggle='toggle-content']").each(function () {
    $(this).on("change", function () {
      if ($(this).get()[0].checked) {
        $($(this).attr("data-target")).css("display", "block");
      } else {
        $($(this).attr("data-target")).css("display", "none");
      }
    });

    if ($(this).get()[0].checked) {
      $($(this).attr("data-target")).css("display", "block");
    }
  });

  $("[data-toggle='toggle-radio']").each(function () {
    $(this).on("click", function () {
      removeAllActiveRadio($("[data-toggle='toggle-radio']"));
      if ($(this).get()[0].checked) {
        $($(this).attr("data-target")).css("display", "block");
      } else {
        $($(this).attr("data-target")).css("display", "none");
      }
    });

    if ($(this).get()[0].checked) {
      removeAllActiveRadio($("[data-toggle='toggle-radio']"));
      $($(this).attr("data-target")).css("display", "block");
    }
  });

  $("[data-toggle='copy']").each(function () {
    $(this).on("click", function () {
      $($(this).attr("data-target")).select();
      //testingCodeToCopy.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        $(".alert-copy").css("display", "flex");

        setTimeout(function () {
          $(".alert-copy").css("display", "none");
        }, 2000);
      } catch (err) {}

      /* unselect the range */
      window.getSelection().removeAllRanges();
    });

    if ($(this).get()[0].checked) {
      removeAllActiveRadio($("[data-toggle='toggle-radio']"));
      $($(this).attr("data-target")).css("display", "block");
    }
  });

  $(".btn-edit-caption").on("click", function () {
    $(".edit-box").css("display", "block");
    $(".editted-text").css("display", "none");
  });

  $(".btn-save-edit").on("click", function () {
    $(".editted-text").text($(".edit-box textarea").val());
    $(".edit-box").css("display", "none");
    $(".editted-text").css("display", "block");
  });

  $(".pagination-custom .btn-left").on("click", function () {
    if ($("#cur-page").get()[0].innerText > 1) {
      $("#cur-page").get()[0].innerText =
        Number($("#cur-page").get()[0].innerText) - 1;
    }
  });

  $(".pagination-custom .btn-right").on("click", function () {
    if (
      $("#cur-page").get()[0].innerText < $("#total-page").get()[0].innerText
    ) {
      $("#cur-page").get()[0].innerText =
        Number($("#cur-page").get()[0].innerText) + 1;
    }
  });

  $("#add-image-btn").on("click", function () {
    $("#add-image-project").modal("show");
  });

  function removeAllActiveRadio(rad) {
    for (let i = 0; i < rad.length; i++) {
      $(rad[i].getAttribute("data-target")).css("display", "none");
    }
  }

  $(".vc-video-wrap").each(function () {
    $(this).on("mouseover", function () {
      $(this).find("video").get(0).play();
    });
  });

  $(".vc-video-wrap").each(function () {
    $(this).on("mouseout", function () {
      $(this).find("video").get(0).pause();
    });
  });

  $(".video-media-box").each(function () {
    let _this = $(this);
    $(this)
      .find(".btn-bg-play")
      .on("click", function () {
        stopAllMedia();
        _this.find("video").get(0).play();
      });

    _this.find(".btn-play-pause").on("click", function () {
      if (_this.find("video").get(0).paused) {
        stopAllMedia();
        _this.find("video").get(0).play();
      } else {
        _this.find("video").get(0).pause();
      }
    });

    _this.find("video").on("play", function () {
      _this
        .find(".btn-play-pause img")
        .attr("src", "assets/icons/vidcloud/pause.svg");

      _this.find(".btn-bg-play").css("display", "none");
    });

    _this.find("video").on("pause", function () {
      _this.find(".btn-bg-play").css("display", "block");

      _this
        .find(".btn-play-pause img")
        .attr("src", "assets/icons/mini_play.svg");
    });
  });

  function stopAllMedia() {
    $(".media-box").each(function () {
      // console.log( $(this).find("video").get(0));
      let elem = Boolean($(this).find("video").get(0))
        ? $(this).find("video")
        : $(this).find("audio");
      elem.get(0).pause();
    });
  }

  $(".audio-box").each(function () {
    let _this = $(this);
    let audioElement = _this.find("audio").get(0);
    let canvasElement = _this.find("#audio_visual").get(0);
    let wave = new Wave(audioElement, canvasElement);

    // Simple example: add an animation
    wave.addAnimation(new wave.animations.Wave());

    // Intermediate example: add an animation with options
    // wave.addAnimation(
    //   new wave.animations.Wave({
    //     lineWidth: 10,
    //     lineColor: "#ac19a6",
    //     count: 30,
    //   })
    // );

    // Expert example: add multiple animations with options
    wave.addAnimation(
      new wave.animations.Square({
        count: 50,
        diamater: 300,
        lineColor: "#A7F008",
      })
    );

    wave.addAnimation(
      new wave.animations.Glob({
        fillColor: { gradient: ["#ffa500", "#ff0000", "#ffff00"], rotate: 45 },
        lineWidth: 1,
        lineColor: "#A7F008",
      })
    );

    audioElement.play();
    audioElement.pause();

    // The animations will start playing when the provided audio element is played

    // 'wave.animations' is an object with all possible animations on it.

    // Each animation is a class, so you have to new-up each animation when passed to 'addAnimation'

    _this.find(".btn-play-pause").on("click", function () {
      if (_this.find("audio").get(0).paused) {
        stopAllMedia();
        _this.find("audio").get(0).play();
      } else {
        _this.find("audio").get(0).pause();
      }
    });

    _this.find("audio").on("pause", function () {
      _this
        .find(".btn-play-pause img")
        .attr("src", "assets/icons/play one icon.svg");
    });

    _this.find("audio").on("play", function () {
      _this
        .find(".btn-play-pause img")
        .attr("src", "assets/icons/vidcloud/Group 142.svg");
    });
  });

  $(".audio-upload-box").each(function () {
    let _this = $(this);
    let audioElement = _this.find("audio").get(0);
    let canvasElement = _this.find("#audio_visualiser").get(0);
    let wave = new Wave(audioElement, canvasElement);

    // Simple example: add an animation
    wave.addAnimation(new wave.animations.Wave());

    // Intermediate example: add an animation with options
    // wave.addAnimation(
    //   new wave.animations.Wave({
    //     lineWidth: 10,
    //     lineColor: "#ac19a6",
    //     count: 30,
    //   })
    // );

    // Expert example: add multiple animations with options
    wave.addAnimation(
      new wave.animations.Square({
        count: 50,
        diamater: 300,
        lineColor: "#A7F008",
      })
    );

    wave.addAnimation(
      new wave.animations.Glob({
        fillColor: { gradient: ["#ffa500", "#ff0000", "#ffff00"], rotate: 45 },
        lineWidth: 1,
        lineColor: "#A7F008",
      })
    );

    audioElement.play();
    audioElement.pause();

    // The animations will start playing when the provided audio element is played

    // 'wave.animations' is an object with all possible animations on it.

    // Each animation is a class, so you have to new-up each animation when passed to 'addAnimation'

    // _this.find(".btn-play-pause").on("click", function () {
    //   if (_this.find("audio").get(0).paused) {
    //     stopAllMedia();
    //     _this.find("audio").get(0).play();
    //   } else {
    //     _this.find("audio").get(0).pause();
    //   }
    // });

    // _this.find("audio").on("pause", function () {
    //   _this
    //     .find(".btn-play-pause img")
    //     .attr("src", "assets/icons/play one icon.svg");
    // });

    // _this.find("audio").on("play", function () {
    //   _this
    //     .find(".btn-play-pause img")
    //     .attr("src", "assets/icons/vidcloud/Group 142.svg");
    // });
  });


  
});
/** Implementation of the functionality of the audio player */
