const calculateTime = (secs) => {
  const hour = Math.floor(secs / 3600);
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const returnedHour = hour < 10 ? `0${hour}` : `${hour}`;
  return `${returnedHour}:${returnedMinutes}:${returnedSeconds}`;
};

let videoContainer = $(".video-outter");

videoContainer.each(function () {
  //let container = $(this).get(0);
  let container = $(this).find(".video-inner").get(0);

  let video = $(this).find("video").get(0);

  // let videoControls = $(this).find('.controls');

  let playpause = $(this).find(".btn-vid-play-pause").get(0);
  let bigPlay = $(this).find(".btn-play-settings").get(0);
  // let bigPlayImg = $(this).find('.btn-play-settings img').get(0);
  let playpauseImage = $(this).find(".btn-vid-play-pause img").get(0);

  let progress = $(this).find("#progress").get(0);

  let progressBar = $(this).find("#progress-bar").get(0);

  let vidCurTime = $(this).find(".vid-current-time").get(0);

  let vidLength = $(this).find(".vid-length").get(0);

  let btnShare = $(this).find(".share").get(0);

  let shareWrap = $(this).find(".share-wrap");

  //let vidInnerContainer = $(this).find('.video-inner');

  let playBack = $(this).find(".btn-play-back").get(0);

  let btnPictureInPicture = $(this).find(".btn-picture").get(0);

  let btnVideoSettings = $(this).find(".btn-set-vid").get(0);

  let vidSettingsContainer = $(this).find(".vid-pop--over");

  let btnVolume = $(this).find(".btn-volume").get(0);

  let volumeControlContainer = $(this).find(".btn-drop-up");

  let volumeControl = $(this).find("#vid-volume-controls").get(0);

  console.log(document.pictureInPictureEnabled);

  if (document.pictureInPictureEnabled) {
    btnPictureInPicture.classList.remove("hidden");
    btnPictureInPicture.disabled = false;

    btnPictureInPicture.addEventListener("click", () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch((error) => {
          // Error handling
        });
      } else {
        video.requestPictureInPicture().catch((error) => {
          // Error handling
        });
      }
    });
    // picture in picture implementation
    video.addEventListener("enterpictureinpicture", () => {
      pipButton.textContent = "Exit Picture-in-Picture mode";
    });

    video.addEventListener("leavepictureinpicture", () => {
      pipButton.textContent = "Enter Picture-in-Picture mode";
    });
  }

  let rafVid = null;

  var handleFullscreen = function () {
    // If fullscreen mode is active...
    if (isFullScreen()) {
      //vidInnerContainer.css('height', '350px');
      // ...exit fullscreen mode
      // (Note: this can only be called on document)
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen)
        document.webkitCancelFullScreen();
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
  };

  var fullscreen = $(this).find(".btn-fs").get(0);

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

  // videoControls.get(0).setAttribute('data-state', 'visible');

  var supportsProgress = document.createElement("progress").max !== undefined;
  if (!supportsProgress) progress.setAttribute("data-state", "fake");

  var changeButtonState = function (type) {
    // Play/Pause button
    if (type == "playpause") {
      if (video.paused || video.ended) {
        playpause.setAttribute("data-state", "play");
        playpauseImage.src = "../assets/icons/play one icon.svg";
        // bigPlayImg.src = "../assets/icons/play frame.svg";
      } else {
        playpause.setAttribute("data-state", "pause");
        playpauseImage.src = "../assets/icons/time.svg";
        // bigPlayImg.src = "../assets/icons/time.svg";
      }
    }
    // Mute button
    else if (type == "mute") {
      mute.setAttribute("data-state", video.muted ? "unmute" : "mute");
    }
  };

  btnShare.addEventListener("click", function () {
    shareWrap.css("display", "flex");
  });

  $(".close-share").on("click", function () {
    $(this).parent().css("display", "none");
  });

  video.addEventListener("loadedmetadata", function () {
    vidLength.textContent = calculateTime(Math.floor(video.duration));
    progress.setAttribute("max", video.duration);
  });

  if (video.readyState >= 2) {
    vidLength.textContent = calculateTime(Math.floor(video.duration));
    progress.setAttribute("max", video.duration);
  }

  video.addEventListener("timeupdate", function () {
    // For mobile browsers, ensure that the progress element's max attribute is set

    if (!progress.getAttribute("max"))
      progress.setAttribute("max", video.duration);
    progress.value = video.currentTime;
    progressBar.style.width =
      Math.floor((video.currentTime / video.duration) * 100) + "%";
  });

  playBack.addEventListener("click", function () {
    if (video.currentTime > 10) {
      video.currentTime -= 10;
      vidCurTime.textContent = calculateTime(Math.floor(video.currentTime));
    }
  });

  video.addEventListener(
    "play",
    function () {
      changeButtonState("playpause");
      bigPlay.style.visibility = "hidden";
      // videoControls.get(0).setAttribute('data-state', 'hidden');
    },
    false
  );

  video.offsetParent.addEventListener("mouseover", function () {
    // videoControls.get(0).setAttribute('data-state', 'visible');
  });

  video.offsetParent.addEventListener("mouseout", function () {
    if (video.paused) {
      return;
    }
    // videoControls.get(0).setAttribute('data-state', 'hidden');
  });

  video.addEventListener(
    "pause",
    function () {
      changeButtonState("playpause");
      bigPlay.style.visibility = "visible";
      // videoControls.get(0).setAttribute('data-state', 'visible');
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

  btnVolume.addEventListener("click", function () {
    volumeControlContainer.toggleClass("show-visible");
  });

  btnVideoSettings.addEventListener("click", function () {
    vidSettingsContainer.toggleClass("show-visible");
  });

  $("#speed-cont").on("val-change", function () {
    console.log($(this).attr("value"));
    video.playbackRate = $(this).attr("value");
  });

  $("#zoom-input").on("input", function () {
    console.log($(this).attr("value"));
    video.style.transform = "scale(" + $(this).val() + ")";
  });

  video.addEventListener("timeupdate", function () {
    //currentTime use second, if you want min *60
    // if (video.currentTime >= 5) {
    //     video.pause();
    // }
  });

  volumeControl.addEventListener("input", function () {
    // console.log(video.volume);
    video.volume = this.value / 100;
  });

  $(document).on("click", function (event) {
    // event.stopPropagation();
    // if (event.target == volumeControlContainer.get(0)) {
    //     return
    // }
    // $('.close-click-outside').removeClass('show')
    // $('#vid-volume-controls')
    // console.log(event.currentTarget)
    // console.log("event");
    // console.log(event.target)
    // console.log("target");
    // console.log(volumeControlContainer.get(0));
  });

  // Close the dropdown menu if the user clicks outside of it
  window.addEventListener("click", function (event) {
    // if (!event.target.matches('.close-click-outside')) {
    //     var dropdowns = document.getElementsByClassName("close-click-outside");
    //     var i;
    //     for (i = 0; i < dropdowns.length; i++) {
    //         var openDropdown = dropdowns[i];
    //         if (openDropdown.classList.contains('show')) {
    //             openDropdown.classList.remove('show');
    //         }
    //     }
    // }
  });

  bigPlay.addEventListener("click", function (e) {
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

  $("#reset-player-color").click(function () {
    if ($(this).is(":checked")) {
      $("#skin-color-input").val("#2c0640");
      $(".clr-field").css("color", "#2c0640");
      $("#skin-color-input").trigger("change");
    }
  });

  $("#skin-color-input").on("change", function () {
    $(".vid-controls").css("background-color", $(this).val());
  });

  $(".logo-width").on("input", function () {
    $(".logo-height").val(Math.ceil($(this).val() / 1.5));
    // $('.logo-height').trigger('input');

    $(".vid-logo").css("width", $(this).val() + "px");
    $(".vid-logo").css("height", $(".logo-height").val() + "px");
  });

  $(".logo-height").on("input", function () {
    $(".logo-width").val(1.5 * $(this).val());
    // $('.logo-width').trigger('input');

    $(".vid-logo").css("height", $(this).val() + "px");
    $(".vid-logo").css("width", $(".logo-width").val() + "px");
  });

  $(".img-width").on("input", function () {
    $(".img-height").val(Math.ceil($(this).val() / 1.5));
    // $('.logo-height').trigger('input');

    $(".overlay-img").css("width", $(this).val() + "px");
    $(".overlay-img").css("height", $(".img-height").val() + "px");
  });

  $(".img-height").on("input", function () {
    $(".img-width").val(1.5 * $(this).val());
    // $('.logo-width').trigger('input');

    $(".overlay-img").css("height", $(this).val() + "px");
    $(".overlay-img").css("width", $(".img-width").val() + "px");
  });

  $("#img-opacity").on("input", function () {
    $(".overlay-img").css("opacity", $(this).val());
    $(".opaque-value").text($(this).val());
  });

  const REGEXP = /[0-9]/;
  $(".number-input").each(function () {
    $(this).on("keypress", function (event) {
      console.log(event.key);
      if (!REGEXP.test(event.key)) {
        event.preventDefault();
      }
    });
  });

  //const timeREGEXP = /(((0[1-9])|[^0]\d):)?[0-5]\d:[0-5]\d$/;
  const timeREGEXP = /[0-9|:]/;
  $(".time-input").each(function () {
    $(this).on("keypress", function (event) {
      console.log(event.key);
      if (!timeREGEXP.test(event.key)) {
        event.preventDefault();
      }
    });
  });

  $("#vid-logo-pos-input").on("change", function () {
    $(".vid-logo-display").css("display", "none");

    if ($(this).val() == "top-left") {
      $(".video-inner > .vid-logo-display").css({
        display: "block",
        position: "absolute",
        left: "16px",
        right: "initial",
      });
      $(".logo-size-wrap").css("display", "block");
    } else if ($(this).val() == "top-right") {
      $(".video-inner > .vid-logo-display").css({
        display: "block",
        position: "absolute",
        right: "16px",
        left: "initial",
      });
      $(".logo-size-wrap").css("display", "block");
    } else if ($(this).val() == "play-bar") {
      $(".vid-logo-display").css("display", "none");
      $(".vid-controls .vid-logo-display").css({
        display: "table",
        position: "static",
      });

      $(".vid-controls .vid-logo-display img").css("width", "auto");

      $(".logo-size-wrap").css("display", "none");
    }
  });

  $('[data-target=".show-logo-trigger"]').on("click", function () {
    if ($(this).is(":checked")) {
      $(".video-inner > .vid-logo-display").css("display", "block");
    } else {
      $(".vid-logo-display").css("display", "none");
    }
  });

  function readURL(input, target, self) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        if (self) {
          $(self).attr("src", e.target.result);
        }
        $(target).attr("src", e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#vid-img-upload").change(function () {
    readURL(this, ".vid-logo", "#selected-logo");
  });

  $("#call-to-action-image-input").change(function () {
    readURL(this, ".cta--image", "#call-action-img-selected");
  });

  $('[data-update="img-upload"]').change(function () {
    var targets = $(this).attr("data-target").split(" ");

    if (targets.length > 1) {
      readURL(this, targets[0], targets[1]);
    } else {
      readURL(this, targets[0]);
    }
  });

  $("#play-color-input").on("change", function () {
    $(".btn-play-select").css("color", $(this).val());
    $(".btn-play-settings").css("color", $(this).val());
  });

  $(".btn-play-select").each(function () {
    $(this).on("click", function () {
      removeSelected($(".btn-play-select"));

      $(this).addClass("selected");

      $(".btn-play-settings i").attr(
        "class",
        $(this).children("i").attr("class")
      );
    });
  });

  $(".anim-select").each(function () {
    $(this).on("change", function () {
      $($(this).attr("data-target")).attr(
        "class",
        "btn no-shadow btn-play-settings " + $(this).val()
      );
      if ($("#set-infinite").is(":checked")) {
        $(".btn-play-settings").addClass("animate__infinite");
      }
    });
  });

  $("#set-infinite").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-play-settings").addClass("animate__infinite");
    } else {
      $(".btn-play-settings").removeClass("animate__infinite");
    }
  });

  $("#text-on-vid-input").on("input", function () {
    //alert('Yeah');
    $(".text-on-vid-display .text").text($(this).val());
  });

  $(".add-btn-text").each(function () {
    $(this).on("input", function () {
      $($(this).attr("data-target")).text($(this).val());
    });
  });

  $(".add-btn-color-input").each(function () {
    $(this).on("change", function () {
      $($(this).attr("data-target")).css("background-color", $(this).val());
    });
  });

  $(".add-btn-color-text-input").each(function () {
    $(this).on("change", function () {
      $($(this).attr("data-target")).css("color", $(this).val());
    });
  });

  $(".add-btn-border-radius").each(function () {
    $(this).on("input", function () {
      $($(this).attr("data-target")).css("border-radius", $(this).val() + "px");
    });
  });

  $("#add-btn-to-vid-check").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-with-text").css("display", "block");
    } else {
      $(".btn-with-text").css("display", "none");
    }
  });

  $("#add-btn-2-to-vid-check").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-with-text-2").css("display", "block");
    } else {
      $(".btn-with-text-2").css("display", "none");
    }
  });

  $("#add-btn-3-to-vid-check").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-with-text-3").css("display", "block");
    } else {
      $(".btn-with-text-3").css("display", "none");
    }
  });

  // Visibility and privacy

  $("#visibility-select").on("change", function () {
    $(".selectable").each(function () {
      $(this).css("display", "none");
    });

    $(".video-passworded").css("display", "none");

    if ($(this).val() == "private-link") {
      $(".private-link-selected").css("display", "block");
      // $(".html-on-vid-display").css("display", "flex");
    } else if ($(this).val() == "password") {
      $(".password-selected").css("display", "block");
      $(".video-passworded").css("display", "flex");
    }
  });

  // if ($("#cia-type-select").val() == "html") {
  //     $(".html-selected").css("display", "block");
  // } else if ($("#cia-type-select").val() == "image") {
  //     $(".image-selected").css("display", "block");
  // } else if ($("#cia-type-select").val() == "text") {
  //     $(".text-selected").css("display", "block");
  // }

  $("#text-password-input").on("input", function () {
    $("#pwd-label").text($(this).val());
  });

  // Call to action

  $("#cta-html-input").on("change", function () {
    $(".html-on-vid-display").html($($(this).val()));
  });

  $("#cia-type-select").on("change", function () {
    $(".selectable").each(function () {
      $(this).css("display", "none");
    });

    $(".cta-type").each(function () {
      $(this).css("display", "none");
    });

    if ($(this).val() == "html") {
      $(".html-selected").css("display", "block");
      $(".html-on-vid-display").css("display", "flex");
    } else if ($(this).val() == "image") {
      $(".image-selected").css("display", "block");
      $(".image-on-vid-display").css("display", "flex");
    } else if ($(this).val() == "text") {
      $(".text-selected").css("display", "block");
      $(".text-on-vid-display").css("display", "flex");
    }
  });

  if ($("#cia-type-select").val() == "html") {
    $(".html-selected").css("display", "block");
  } else if ($("#cia-type-select").val() == "image") {
    $(".image-selected").css("display", "block");
  } else if ($("#cia-type-select").val() == "text") {
    $(".text-selected").css("display", "block");
  }

  // Call to action end

  // Thumnail select
  $("#thumbnail-type-select").on("change", function () {
    $(".thumbnail-type").each(function () {
      $(this).css("display", "none");
    });

    $(".cta-type").each(function () {
      $(this).css("display", "none");
    });

    if ($(this).val() == "image") {
      $(".thumb-image-selected").css("display", "block");
      // $(".html-on-vid-display").css("display", "flex");
    } else if ($(this).val() == "video") {
      $(".thumb-video-selected").css("display", "flex");
      // $(".image-on-vid-display").css("display", "flex");
    }
  });

  gifshot.createGIF(
    {
      video: ["example.mp4", "example.ogv"],
    },
    function (obj) {
      if (!obj.error) {
        var image = obj.image,
          animatedImage = document.createElement("img");
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
      }
    }
  );

  if ($("#thumbnail-type-select").val() == "image") {
    $(".thumb-image-selected").css("display", "block");
  } else if ($("#thumbnail-type-select").val() == "video") {
    $(".thumb-video-selected").css("display", "flex");
  }

  // Thumbnail End

  // Overlay

  // Watch Time Limit
  $("#wtl-type-select").on("change", function () {
    $(".wtl-selectable").each(function () {
      $(this).css("display", "none");
    });

    //console.log($(".wtl-selectable").children());
    if ($(this).val() == "text") {
      $(".wtl-selectable.text-selected").css("display", "block");

      $(".watch-ad-text").css("display", "block");
      $(".watch-ad-img").css("display", "none");
    } else if ($(this).val() == "image") {
      $(".wtl-selectable.image-selected").css("display", "block");
      $(".watch-ad-text").css("display", "none");
      $(".watch-ad-img").css("display", "inline");
    }
  });

  if ($("#wtl-type-select").val() == "text") {
    $(".wtl-selectable.text-selected").css("display", "block");
    $(".watch-ad-text").css("display", "block");
  } else if ($("#wtl-type-select").val() == "image") {
    $(".wtl-selectable.image-selected").css("display", "block");
    $(".watch-ad-img").css("display", "inline");
  }

  // info overlay

  // Overlay Ads

  $("#overlay-ad-type-select").on("change", function () {
    $(".overlay-ads-selectable").each(function () {
      $(this).css("display", "none");
    });

    //console.log($(".overlay-ads-selectable").children());
    if ($(this).val() == "text") {
      $(".overlay-ads-selectable.text-selected").css("display", "block");
      $(".overlay-ads .overlay-text").css("display", "block");
      $(".overlay-ads .overlay-img").css("display", "none");
      //$(".html-on-vid-display").css("display", "flex");
    } else if ($(this).val() == "image") {
      $(".overlay-ads-selectable.image-selected").css("display", "block");
      //$(".image-on-vid-display").css("display", "flex");
      $(".overlay-ads .overlay-img").css("display", "block");
      $(".overlay-ads .overlay-text").css("display", "none");
    }
  });

  if ($("#overlay-ad-type-select").val() == "text") {
    $(".overlay-ads-selectable.text-selected").css("display", "block");
    $(".overlay-ads .overlay-text").css("display", "block");
  } else if ($("#overlay-ad-type-select").val() == "image") {
    $(".overlay-ads-selectable.image-selected").css("display", "block");
    $(".overlay-ads .overlay-img").css("display", "block");
  }

  // Overlay Text
  // var overlay_text_count = 1;
  // $(".btn-add-more").on("click", function () {
  //   if (overlay_text_count < 4) {
  //     overlay_text_count++;
  //   }

  //   for (var i = 1; i <= overlay_text_count; i++) {
  //     $(".overlay-text-inner-" + i).css("display", "block");
  //     $(".overlay-text-" + i).css("display", "block");
  //   }
  // });

  $("#toggle__text-1").on("change", function () {
    if ($(this).is(":checked")) {
      $(".overlay-text-1").css("display", "block");
    } else {
      $(".overlay-text-1").css("display", "none");
    }
  });

  $("#toggle__text-2").on("change", function () {
    if ($(this).is(":checked")) {
      $(".overlay-text-2").css("display", "block");
    } else {
      $(".overlay-text-2").css("display", "none");
    }
  });

  $("#toggle__text-3").on("change", function () {
    if ($(this).is(":checked")) {
      $(".overlay-text-3").css("display", "block");
    } else {
      $(".overlay-text-3").css("display", "none");
    }
  });

  $("#font-select").on("change", function () {
    // console.log($(this).val().split(','));
    //var junction_font = new FontFace($(this).val().split(',')[1], $(this).val().split(',')[0]);

    //console.log(url);
    var name = $(this).val().split(",")[1];
    var junction_font = new FontFace(
      $(this).val().split(",")[1],
      "url(" + $(this).val().split(",")[0] + ")"
    );
    // https://fonts.googleapis.com/css?family=Roboto:Regular
    // console.log(junction_font);
    junction_font
      .load()
      .then(function (loaded_face) {
        console.log(loaded_face);
        console.log(name);
        //console.log('Loaded');
        document.fonts.add(loaded_face);
        $("body").css("font-family", name);
        //document.body.style.fontFamily = $(this).val().split(',')[1];
      })
      .catch(function (error) {
        // error occurred
      });
  });

  // Overlay End

  // Email Lead

  $("#activate-lead-input").on("change", function () {
    if ($(this).is(":checked")) {
      $(".email-lead-wrap").css("display", "block");
    } else {
      $(".email-lead-wrap").css("display", "none");
    }
  });

  $("#email-name-request").on("change", function () {
    if ($(this).is(":checked")) {
      $("#email-name").css("display", "block");
    } else {
      $("#email-name").css("display", "none");
    }
  });

  $("#skip-option-input").on("change", function () {
    if ($(this).is(":checked")) {
      $(".email-lead-wrap").addClass("skipable");
    } else {
      $(".email-lead-wrap").removeClass("skipable");
    }
  });

  $("#skip-option-input").on("change", function () {
    if ($(this).is(":checked")) {
      $(".email-lead-wrap").addClass("skipable");
    } else {
      $(".email-lead-wrap").removeClass("skipable");
    }
  });

  $(".skip-option-cta").each(function () {
    $(this).on("change", function () {
      if ($(this).is(":checked")) {
        $(".skip-option-cta").each(function () {
          $(this).prop("checked", true);
        });
        $("" + $(this).attr("data-target") + "").each((indx, elem) =>
          elem.classList.add("skipable")
        );
      } else {
        $(".skip-option-cta").each(function () {
          $(this).prop("checked", false);
        });
        $("" + $(this).attr("data-target") + "").each((indx, elem) =>
          elem.classList.remove("skipable")
        );
      }
    });
  });

  $("[data-dismiss='popup']").on("click", function () {
    video.play();
    $("" + $(this).attr("data-target") + "").css("display", "none");
  });

  $("#email-header-input").on("input", function () {
    //alert('Yeah');
    $("#email-lead-header-text").text($(this).val());
  });

  $("#email-sub-head-input").on("input", function () {
    //alert('Yeah');
    $("#email-lead-sub-header-text").text($(this).val());
  });

  $("#email-lead-btn-text-input").on("input", function () {
    $("#email-lead-btn").text($(this).val());
  });

  $("#email-lead--btn-color-input").on("change", function () {
    $("#email-lead-btn").css("background", $(this).val());
  });

  $("#email-lead--btn-text-color-input").on("change", function () {
    $("#email-lead-btn").css("color", $(this).val());
  });

  const customEvent = new Event("val-change");
  $(".custom-selector").each(function () {
    let parent = $(this);
    let selectable = $(this).find(".select-item");
    selectable.each(function () {
      $(this).on("click", function () {
        unSelectAll(selectable);
        parent.attr("value", $(this).attr("val"));
        parent.get()[0].dispatchEvent(customEvent);
        //parent.get()[0].trigger(customEvent);
        $(this).attr("selected", "true");
      });
    });
  });

  $("#main-vid-settings .more-option").each(function () {
    $(this).on("click", function (e) {
      e.preventDefault();
      $("#main-vid-settings").css("display", "none");
      $($(this).attr("href")).addClass("active");
    });
  });

  $(".back-to").each(function () {
    $(this).on("click", function (e) {
      e.preventDefault();
      $($(this).attr("href")).css("display", "flex");

      $(".custom-selector").each(function () {
        $(this).removeClass("active");
      });
    });
  });

  // Toggle Controls
  $("#play-button-display").on("change", function () {
    if ($(this).val() == "display-on-hover") {
      $(".video-inner").addClass("play-show-hover");
    } else {
      $(".video-inner").removeClass("play-show-hover");
    }
  });
  // Playbar
  $("#show-hide-playbar").on("change", function () {
    if ($(this).is(":checked")) {
      $(".vid-controls").css("display", "flex");
    } else {
      $(".vid-controls").css("display", "none");
    }
  });

  // Volume
  $("#show-hide-volume").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-volume").css("display", "flex");
    } else {
      $(".btn-volume").css("display", "none");
    }
  });

  // Share
  $("#show-hide-share").on("change", function () {
    if ($(this).is(":checked")) {
      $(".share").css("display", "flex");
    } else {
      $(".share").css("display", "none");
    }
  });

  // Play speed
  $("#show-hide-play--speed").on("change", function () {
    if ($(this).is(":checked")) {
      $(".play-speed").css("display", "flex");
    } else {
      $(".play-speed").css("display", "none");
    }
  });

  // Zoom

  $("#show-hide-zoom").on("change", function () {
    if ($(this).is(":checked")) {
      $(".zoom-btn").css("display", "flex");
    } else {
      $(".zoom-btn").css("display", "none");
    }
  });

  // Theater Mode

  $("#show-hide-theater").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-theater-mode").css("display", "inline-block");
    } else {
      $(".btn-theater-mode").css("display", "none");
    }
  });

  // Subtitle

  $("#subtitle-toggler").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-subtitle").css("display", "inline-block");
    } else {
      $(".btn-subtitle").css("display", "none");
    }
  });

  // Fullscreen
  $("#show-hide-fullscreen").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-fs").css("display", "flex");
    } else {
      $(".btn-fs").css("display", "none");
    }
  });

  // Rewind Button
  $("#show-hide-rewind").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-play-back").css("display", "flex");
    } else {
      $(".btn-play-back").css("display", "none");
    }
  });

  // Picture in Picture
  $("#show-hide-picture--in--picture").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-picture").css("display", "flex");
    } else {
      $(".btn-picture").css("display", "none");
    }
  });

  $(document).mouseup(function (e) {
    var container = $(".close-click-outside");

    if (container.hasClass("show-visible")) {
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass("show-visible");
      }
    }
  });

  function unSelectAll(arr) {
    arr.each(function () {
      $(this).removeAttr("selected");
    });
  }

  function removeSelected(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].classList.remove("selected");
    }
  }

  // Font

  function toSecond(hms) {
    // your input string
    var a = hms.split(":"); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

    return seconds;
  }

  $("#save-cta").on("click", function () {
    callToAction();
  });

  function callToAction() {
    let seconds;
    if ($("#cia-type-select").val() == "text") {
      $(".text-on-vid-display").css("display", "none");
      seconds = toSecond($(".time-text").val());

      console.log(seconds);

      video.addEventListener("timeupdate", function () {
        //currentTime use second, if you want min *60
        console.log(video.currentTime);
        console.log(seconds);
        if (Math.trunc(video.currentTime) == seconds) {
          video.pause();
          $(".text-on-vid-display").css("display", "flex");
        }
      });
    }
  }

  // Watch Time Limit

  $("#wtl-type").on("change", function () {
    if ($(this).is(":checked")) {
      $(".watch-ad-overlay").css("display", "flex");
    } else {
      $(".watch-ad-overlay").css("display", "none");
    }
  });

  $('[data-update="text"]').on("input", function () {
    //alert('Yeah');
    $($(this).attr("data-target")).text($(this).val());
  });

  $('[data-update="font"]').on("change", function () {
    var _this = $(this);
    //alert('Yeah');
    var name = $(this).val().split(",")[1];
    var junction_font = new FontFace(
      $(this).val().split(",")[1],
      "url(" + $(this).val().split(",")[0] + ")"
    );
    // https://fonts.googleapis.com/css?family=Roboto:Regular
    // console.log(junction_font);
    junction_font
      .load()
      .then(function (loaded_face) {
        // console.log(loaded_face);
        // console.log(name);
        //console.log('Loaded');
        document.fonts.add(loaded_face);
        //  console.log(_this.attr("data-target"));
        $(_this.attr("data-target")).css("font-family", name);
        //document.body.style.fontFamily = $(this).val().split(',')[1];
      })
      .catch(function (error) {
        // error occurred
      });
    // $($(this).attr("data-target")).css("font-family", $(this).val());
  });

  $('[data-update="text-position"]').on("change", function () {
    //$(".vid-logo-display").css("display", "none");

    var possible_positions = [
      "top-left",
      "top-center",
      "top-right",
      "center-left",
      "center",
      "center-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];

    for (let i = 0; i < possible_positions.length; i++) {
      // console.log($($(this).attr("data-target")).attr("class"));
      console.log(possible_positions[i]);
      console.log(
        String($($(this).attr("data-target")).attr("class")).includes(
          possible_positions[i]
        )
      );

      if (
        String($($(this).attr("data-target")).attr("class")).includes(
          possible_positions[i]
        )
      ) {
        $($(this).attr("data-target")).attr(
          "class",
          String($($(this).attr("data-target")).attr("class")).replace(
            possible_positions[i],
            ""
          )
        );
      }
    }

    // $($(this).attr("data-target")).attr(
    //   "class",
    //   String($(this).attr("data-target")).substring(1)
    // );

    if ($(this).val() == "top-left") {
      $($(this).attr("data-target")).addClass("top-left");
    } else if ($(this).val() == "top-center") {
      $($(this).attr("data-target")).addClass("top-center");
    } else if ($(this).val() == "top-right") {
      $($(this).attr("data-target")).addClass("top-right");
    } else if ($(this).val() == "center-left") {
      $($(this).attr("data-target")).addClass("center-left");
    } else if ($(this).val() == "center") {
      $($(this).attr("data-target")).addClass("center");
    } else if ($(this).val() == "center-right") {
      $($(this).attr("data-target")).addClass("center-right");
    } else if ($(this).val() == "bottom-left") {
      $($(this).attr("data-target")).addClass("bottom-left");
    } else if ($(this).val() == "bottom-center") {
      $($(this).attr("data-target")).addClass("bottom-center");
    } else if ($(this).val() == "bottom-right") {
      $($(this).attr("data-target")).addClass("bottom-right");
    }
  });

  $('[data-update="text-color"]').on("input", function () {
    $($(this).attr("data-target")).css("color", $(this).val());
  });

  $('[data-update="url"]').on("input", function () {
    $($(this).attr("data-target")).attr("href", $(this).val());
  });

  $('[data-update="animation"]').on("change", function () {
    // $($(this).attr("data-target")).attr(
    //   "class",
    //   String($(this).attr("data-target")).substring(1)
    // );

    var possible_animation = [
      "animate__animated animate__bounce",
      "animate__animated animate__flash",
      "animate__animated animate__pulse",
      "animate__animated animate__rubberBand",
      "animate__animated animate__shakeX",
      "animate__animated animate__shakeY",
      "animate__animated animate__headShake",
      "animate__animated animate__swing",
      "animate__animated animate__tada",
      "animate__animated animate__wobble",
      "animate__animated animate__jello",
      "animate__animated animate__heartBeat",
      "animate__animated animate__rotateIn",
      "animate__animated animate__flip",
      "animate__animated animate__fadeIn",
      "animate__animated animate__fadeOut",
      "animate__animated animate__zoomIn",
      "animate__animated animate__backInDown",
      "animate__animated animate__slideInDown",
      "animate__animated animate__slideInUp",
    ];

    for (let i = 0; i < possible_animation.length; i++) {
      if (
        String($($(this).attr("data-target")).attr("class")).includes(
          possible_animation[i]
        )
      ) {
        $($(this).attr("data-target")).attr(
          "class",
          String($($(this).attr("data-target")).attr("class")).replace(
            possible_animation[i],
            ""
          )
        );
      }
    }

    $($(this).attr("data-target")).addClass($(this).val());
  });

  // Info Overlay

  $("#info-overlay-toggle").on("change", function () {
    if ($(this).is(":checked")) {
      $(".info-overlay--wrap").css("display", "flex");
    } else {
      $(".info-overlay--wrap").css("display", "none");
    }
  });

  // Overlay Ads

  $("#overlay-ad--toggle").on("change", function () {
    if ($(this).is(":checked")) {
      $(".overlay-ads").css("display", "flex");
    } else {
      $(".overlay-ads").css("display", "none");
    }
  });

  // Overlay text

  $("#overlay-ad--cus-text").on("change", function () {
    if ($(this).is(":checked")) {
      $(".overlay-text-wrap").css("display", "flex");
    } else {
      $(".overlay-text-wrap").css("display", "none");
    }
  });

  function makeVideo(src, parent) {}
});
