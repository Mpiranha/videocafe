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
  let playpauseImage = $(this).find(".btn-vid-play-pause i").get(0);

  let progress = $(this).find("#progress").get(0);

  let progressBar = $(this).find("#progress-bar").get(0);

  let vidCurTime = $(this).find(".vid-current-time").get(0);

  let vidLength = $(this).find(".vid-length").get(0);

  let btnShare = $(this).find(".share").get(0);

  let shareWrap = $(this).find(".share-wrap");

  //let vidInnerContainer = $(this).find('.video-inner');

  let playBack = $(this).find(".btn-play-back").get(0);
  let playforward = $(this).find(".btn-play-forward").get(0);

  let btnPictureInPicture = $(this).find(".btn-picture").get(0);

  let btnVideoSettings = $(this).find(".btn-set-vid").get(0);

  let vidSettingsContainer = $(this).find(".vid-pop--over");

  let btnVolume = $(this).find(".btn-volume").get(0);

  let volumeControlContainer = $(this).find(".btn-drop-up");

  let volumeControl = $(this).find("#vid-volume-controls").get(0);

  const thumbnailImg = document.querySelector(".thumbnail-img");
  const timelineContainer = document.querySelector(".timeline-container");
  const previewImg = document.querySelector(".preview-img");

  // Timeline
  timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
  timelineContainer.addEventListener("mousedown", toggleScrubbing);
  document.addEventListener("mouseup", (e) => {
    if (isScrubbing) toggleScrubbing(e);
  });
  document.addEventListener("mousemove", (e) => {
    if (isScrubbing) handleTimelineUpdate(e);
  });

  let isScrubbing = false;
  let wasPaused;
  function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.get(0).classList.toggle("scrubbing", isScrubbing);
    if (isScrubbing) {
      wasPaused = video.paused;
      video.pause();
    } else {
      video.currentTime = percent * video.duration;
      if (!wasPaused) video.play();
    }

    handleTimelineUpdate(e);
  }

  function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    const previewImgNumber = Math.max(
      1,
      Math.floor((percent * video.duration) / 10)
    );
    const previewImgSrc = `../assets/previewImgs/preview${previewImgNumber}.jpg`;
    previewImg.src = previewImgSrc;
    timelineContainer.style.setProperty("--preview-position", percent);

    if (isScrubbing) {
      e.preventDefault();
      thumbnailImg.src = previewImgSrc;
      timelineContainer.style.setProperty("--progress-position", percent);
    }
  }

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

        playpauseImage.classList.remove("fa-circle-pause");
        playpauseImage.classList.add("fa-circle-play");
      } else {
        playpause.setAttribute("data-state", "pause");

        playpauseImage.classList.remove("fa-circle-play");
        playpauseImage.classList.add("fa-circle-pause");
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
    // progress.setAttribute("max", video.duration);
  });

  if (video.readyState >= 2) {
    vidLength.textContent = calculateTime(Math.floor(video.duration));
    // progress.setAttribute("max", video.duration);
  }

  video.addEventListener("timeupdate", function () {
    // For mobile browsers, ensure that the progress element's max attribute is set
    // if (!progress.getAttribute("max"))
    //   progress.setAttribute("max", video.duration);
    // progress.value = video.currentTime;
    // progressBar.style.width =
    //   Math.floor((video.currentTime / video.duration) * 100) + "%";
  });

  playBack.addEventListener("click", function () {
    if (video.currentTime > 10) {
      video.currentTime -= 10;
      vidCurTime.textContent = calculateTime(Math.floor(video.currentTime));
    }
  });

  playforward.addEventListener("click", function () {
    if (video.currentTime < (video.duration - 10)) {
      video.currentTime += 10;
      vidCurTime.textContent = calculateTime(Math.floor(video.currentTime));
    }
  });

  video.addEventListener(
    "play",
    function () {
      changeButtonState("playpause");
      bigPlay.style.visibility = "hidden";
      $(".vid-controls").css("visibility", "visible");
      // videoControls.get(0).setAttribute('data-state', 'hidden');
    },
    false
  );

  // video.offsetParent.addEventListener("mouseover", function () {
  //   // videoControls.get(0).setAttribute('data-state', 'visible');
  //   // if (video.paused) {
  //   //   return;
  //   // }
  //   $(".vid-controls").css("transition-delay", "2s");
  //   var x = setTimeout(function() {
  //     $(".vid-controls").css("transition-delay", "initial");
  //     clearInterval(x);
  //   }, 2000);

  // });

  // video.offsetParent.addEventListener("mouseout", function () {
  //   // if (video.paused) {
  //   //   return;
  //   // }
  //   //$(".vid-controls").css("transition-delay", "initial");
  //   // videoControls.get(0).setAttribute('data-state', 'hidden');
  // });

  // $(".vid-controls").on("mouseover", function () {
  //   // if (video.paused) {
  //   //   return;
  //   // }
  //   $(".vid-controls").css("visibility", "visible");
  // });

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
    const percent = video.currentTime / video.duration;
    timelineContainer.style.setProperty("--progress-position", percent);
  });

  volumeControl.addEventListener("input", function () {
    // console.log(video.volume);
    video.volume = this.value / 100;
  });

  // bigPlay.addEventListener("click", function (e) {
  //   if (video.paused || video.ended) {
  //     video.play();
  //     requestAnimationFrame(whilePlayingVideo);
  //   } else {
  //     video.pause();
  //     cancelAnimationFrame(rafVid);
  //   }
  // });

  $(".play-area").on("click", function (e) {
    if (video.paused || video.ended) {
      video.play();
      requestAnimationFrame(whilePlayingVideo);
    } else {
      video.pause();
      cancelAnimationFrame(rafVid);
    }
  });

  // progress.addEventListener(
  //   "click",
  //   function (e) {
  //     // var pos = (e.pageX - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
  //     // video.currentTime = pos * video.duration;
  //     var pos = e.offsetX;
  //     video.currentTime = (pos * video.duration) / this.offsetWidth;
  //     vidCurTime.textContent = calculateTime(Math.floor(video.currentTime));
  //     // console.log(pos);
  //   },
  //   false
  // );

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

  // Airplay

  // Detect if AirPlay is available
  // Mac OS Safari 9+ only
  if (window.WebKitPlaybackTargetAvailabilityEvent) {
    video.addEventListener(
      "webkitplaybacktargetavailabilitychanged",
      function (event) {
        switch (event.availability) {
          case "available":
            //  airPlay.style.display = "block";

            $(".btn-airplay-mode").css("display", "inline-block");
            break;

          default:
            // airPlay.style.display = "none";
            $(".btn-airplay-mode").css("display", "none");
        }

        $(".btn-airplay-mode").on("click", function () {
          video.webkitShowPlaybackTargetPicker();
        });
      }
    );
  } else {
    $(".btn-airplay-mode").css("display", "none");
  }

  // End Airplay

  // Chromecast

  var session = null;

  $(document).ready(function () {
    var loadCastInterval = setInterval(function () {
      if (chrome.cast.isAvailable) {
        console.log("Cast has loaded.");
        clearInterval(loadCastInterval);
        initializeCastApi();
      } else {
        console.log("Unavailable");
      }
    }, 1000);
  });

  function initializeCastApi() {
    var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    var sessionRequest = new chrome.cast.SessionRequest(applicationID);
    var apiConfig = new chrome.cast.ApiConfig(
      sessionRequest,
      sessionListener,
      receiverListener
    );
    chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
  }

  function sessionListener(e) {
    session = e;
    console.log("New session");
    if (session.media.length != 0) {
      console.log("Found " + session.media.length + " sessions.");
    }
  }

  function receiverListener(e) {
    if (e === "available") {
      console.log("Chromecast was found on the network.");
    } else {
      console.log("There are no Chromecasts available.");
    }
  }

  function onInitSuccess() {
    console.log("Initialization succeeded");
  }

  function onInitError() {
    console.log("Initialization failed");
  }

  $(".btn-chromecast-mode").click(function () {
    launchApp();
  });

  function launchApp() {
    console.log("Launching the Chromecast App...");
    chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
  }

  function onRequestSessionSuccess(e) {
    console.log("Successfully created session: " + e.sessionId);
    session = e;
  }

  function onLaunchError() {
    console.log("Error connecting to the Chromecast.");
  }

  function onRequestSessionSuccess(e) {
    console.log("Successfully created session: " + e.sessionId);
    session = e;
    loadMedia();
  }

  function loadMedia() {
    if (!session) {
      console.log("No session.");
      return;
    }

    var videoSrc = video.src;
    var mediaInfo = new chrome.cast.media.MediaInfo(videoSrc);
    mediaInfo.contentType = "video/mp4";

    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    session.loadMedia(request, onLoadSuccess, onLoadError);
  }

  function onLoadSuccess() {
    console.log("Successfully loaded video.");
  }

  function onLoadError() {
    console.log("Failed to load video.");
  }

  $("#stop").click(function () {
    stopApp();
  });

  function stopApp() {
    session.stop(onStopAppSuccess, onStopAppError);
  }

  function onStopAppSuccess() {
    console.log("Successfully stopped app.");
  }

  function onStopAppError() {
    console.log("Error stopping app.");
  }

  // End of Chromecast

  // Subttitle
  const subtitles = document.getElementById("subtitles");
  const subtitleMenuButtons = [];
  let subtitlesMenu;
  for (let i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = "hidden";
  }

  if (video.textTracks) {
    const df = document.createDocumentFragment();
    subtitlesMenu = df.appendChild(document.createElement("ul"));
    subtitlesMenu.className = "subtitles-menu close-click-outside";
    subtitlesMenu.appendChild(createMenuItem("subtitles-off", "", "Off"));
    for (let i = 0; i < video.textTracks.length; i++) {
      subtitlesMenu.appendChild(
        createMenuItem(
          `subtitles-${video.textTracks[i].language}`,
          video.textTracks[i].language,
          video.textTracks[i].label
        )
      );
    }

    $(".vid-controls").get(0).appendChild(subtitlesMenu);
  }

  function createMenuItem(id, lang, label) {
    const listItem = document.createElement("li");
    const button = listItem.appendChild(document.createElement("button"));
    button.setAttribute("id", id);
    button.className = "subtitles-button";
    if (lang.length > 0) button.setAttribute("lang", lang);
    button.value = label;
    button.setAttribute("data-state", "inactive");
    button.appendChild(document.createTextNode(label));
    button.addEventListener("click", (e) => {
      // Set all buttons to inactive
      subtitleMenuButtons.forEach((button) => {
        button.setAttribute("data-state", "inactive");
      });

      // Find the language to activate
      const lang = button.getAttribute("lang");
      for (let i = 0; i < video.textTracks.length; i++) {
        // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
        console.log(video.textTracks[i]);
        if (video.textTracks[i].language === lang) {
          video.textTracks[i].mode = "showing";
          button.setAttribute("data-state", "active");
        } else {
          video.textTracks[i].mode = "hidden";
        }
      }
      subtitlesMenu.style.display = "none";
    });
    subtitleMenuButtons.push(button);
    return listItem;
  }

  subtitles.addEventListener("click", (e) => {
    console.log(subtitlesMenu);
    if (subtitlesMenu) {
      // subtitlesMenu.style.display =
      //   subtitlesMenu.style.display === "block" ? "none" : "block";
      subtitlesMenu.classList.toggle("show-visible");
    }
  });

  // var subtitleses = [];

  const subtitleses = [
    { start: 0, end: 12, text: "Subtitle by Manuelxx!" },
    { start: 18.7, end: 21, text: "This blade has a dark past." },
    { start: 22.8, end: 26.8, text: "It has shed much innocent blood." },
    {
      start: 29,
      end: 32,
      text: "You're a fool for traveling alone, so completely unprepared.",
    },
    {
      start: 32.75,
      end: 35.8,
      text: "You're lucky your blood's still flowing.",
    },
    {
      start: 36.25,
      end: 37.3,
      text: "Thank you.",
    },
    {
      start: 38.5,
      end: 40.0,
      text: "So...",
    },
    {
      start: 40.4,
      end: 44.8,
      text: "What brings you to the land of the gatekeepers?",
    },
    {
      start: 46.0,
      end: 48.8,
      text: "I'm searching for someone.",
    },
    {
      start: 49.0,
      end: 53.2,
      text: "Someone very dear? A kindred spirit?",
    },
    {
      start: 54.4,
      end: 56.0,
      text: "A dragon.",
    },
    {
      start: 58.85,
      end: 61.75,
      text: "A dangerous quest for a lone hunter.",
    },
    {
      start: 62.95,
      end: 65.75,
      text: "I've been alone for as long as I can remember.",
    },
  ];

  // Function to fetch and parse subtitle file (SRT or VTT)
  async function loadSubtitles(url) {

    const response = await fetch(url);
    const text = await response.text();
    parseSubtitles(text);
  }

  // Function to parse SRT/VTT subtitle text into an array of subtitle objects
  function parseSubtitles(text) {
    const lines = text.split('\n');
    let subtitle = {};
    
    lines.forEach((line, index) => {
      // For VTT: Ignore WEBVTT header line
      if (index === 0 && line.includes("WEBVTT")) return;
      
      const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})[.,](\d{3}) --> (\d{2}):(\d{2}):(\d{2})[.,](\d{3})/);
      
      if (timeMatch) {
        // Calculate start and end times in seconds
        subtitle.start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
        subtitle.end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
        subtitle.text = '';
      } else if (line.trim() === '') {
        // Blank line signals end of subtitle block
        if (subtitle.text) subtitles.push({ ...subtitle });
        subtitle = {};
      } else {
        // Add line to the subtitle text
        subtitle.text = (subtitle.text ? subtitle.text + '\n' : '') + line;
      }
    });

    // Push the last subtitle if needed
    if (subtitle.text) subtitleses.push(subtitle);
  }

  const subtitleDiv = document.getElementById("subtitle");

  video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;
    const subtitle = subtitleses.find(
      ({ start, end }) => currentTime >= start && currentTime <= end
    );

    // Update the subtitle text or clear it if none matches
    subtitleDiv.textContent = subtitle ? subtitle.text : "";
  });

  loadSubtitles("https://github.com/Mpiranha/videocafe/blob/58b46fe2a1807a6093d28db11ed85e9acbf53fcf/assets/captions/vtt/sintel-es.vtt")

  // ENd of subtitle

  // VR 360

  // create a scene
  const scene = new THREE.Scene();

  // create a perspective camera
  // https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 100);

  // create a renderer
  // https://threejs.org/docs/#api/en/renderers/WebGLRenderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  // display the renderer
  // document.body.appendChild(renderer.domElement);
  // console.log(videoContainer);
  //  container.appendChild(renderer.domElement);

  // create a sphere geometry
  // https://threejs.org/docs/#api/en/geometries/SphereGeometry
  const geometry = new THREE.SphereGeometry(15, 32, 16);

  // create a VideoTexture
  // create a video element and set attributes
  const videoElement = document.createElement("video");
  videoElement.src = "https://s.bepro11.com/vr-video-sample.mp4";
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.playsInline = true;
  videoElement.crossOrigin = "anonymous";
  videoElement.play();
  const texture = new THREE.VideoTexture(videoElement);

  // create a material from the texture
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // need to use back side - surface of the sphere is facing outside but we put the camera inside of the sphere
  material.side = THREE.BackSide;

  // create a mesh and add to the scene
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.setAnimationLoop(() => renderer.render(scene, camera));

  // zoom in / out
  const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
  renderer.domElement.addEventListener("wheel", (e) => {
    camera.fov = clamp(camera.fov + e.deltaY / 10, 10, 120);
    // need to call this function after changing most of properties in PerspectiveCamera
    camera.updateProjectionMatrix();
  });

  // rotate camera
  let mouseDown = false;
  renderer.domElement.addEventListener("mousedown", (e) => {
    if (e.button === 0) mouseDown = true;
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button === 0) mouseDown = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!mouseDown) return;

    const { movementX, movementY } = e;

    // rotateX: rotate vertically since x-axis is horizontal
    const rotateX = movementY / 100;
    const rotateY = movementX / 100;

    camera.rotateX(rotateX);
    camera.rotateY(rotateY);
  });

  // End of VR 360

  $("#reset-player-color").click(function () {
    if ($(this).is(":checked")) {
      if ($(".video-settings-box").hasClass("light-mode")) {
        $("#skin-color-input").val("#ffffff4d");
        $(".clr-field").css("color", "#ffffff4d");
        $("#skin-color-input").trigger("input");
      } else {
        $("#skin-color-input").val("#2c0640");
        $(".clr-field").css("color", "#2c0640");
        $("#skin-color-input").trigger("input");
      }
    }
  });

  $("#skin-color-input").on("input", function () {
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

  $("#play-color-input").on("input", function () {
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
    $(this).on("input", function () {
      $($(this).attr("data-target")).css("background", $(this).val());
    });
  });

  $(".add-btn-color-text-input").each(function () {
    $(this).on("input", function () {
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

  // gifshot.createGIF(
  //   {
  //     video: ["example.mp4", "example.ogv"],
  //   },
  //   function (obj) {
  //     if (!obj.error) {
  //       var image = obj.image,
  //         animatedImage = document.createElement("img");
  //       animatedImage.src = image;
  //       document.body.appendChild(animatedImage);
  //     }
  //   }
  // );

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
      $(".sub-head-text").text("Enter Your Email and Name Below");
    } else {
      $("#email-name").css("display", "none");
      $(".sub-head-text").text("Enter Your Email Below");
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

  $("#email-lead--btn-color-input").on("input", function () {
    $("#email-lead-btn").css("background", $(this).val());
  });

  $("#email-lead--btn-text-color-input").on("input", function () {
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

  // AirPlay
  $("#show-hide-airplay").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-airplay-mode").css("display", "inline");
    } else {
      $(".btn-airplay-mode").css("display", "none");
    }
  });

  // Chrome cast

  $("#show-hide-chromecast").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-chromecast-mode").css("display", "inline");
    } else {
      $(".btn-chromecast-mode").css("display", "none");
    }
  });

  // Mirror View

  $("#show-hide-mirrorview").on("change", function () {
    if ($(this).is(":checked")) {
      $(".btn-mirrorview-mode").css("display", "inline");
    } else {
      $(".btn-mirrorview-mode").css("display", "none");
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

  var newChild;
  $("[name=email_optin").on("change", function () {
    var key = $(this).val();
    switch (key) {
      case "option-one":
        newChild =
          '<div class="option-one">' +
          '<div class="mail-form-wrap">' +
          '<img class="email-illustration" src="../assets/icons/enter email icon.svg" alt="email illustration">' +
          '<div class="lead-forms">' +
          '<div class="email-lead-top">' +
          '<h1 id="email-lead-header-text" class="header-text">' +
          "Continue Watching This Video" +
          "</h1>" +
          '<h2 id="email-lead-sub-header-text" class="sub-head-text">' +
          "Enter Your Email Below" +
          "</h2>" +
          "</div>" +
          '<div class="form-group" id="email-name">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Name">' +
          "</div>" +
          '<div class="form-group">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Email">' +
          "</div>" +
          '<div class="d-flex justify-content-end">' +
          '<button id="email-lead-btn" class="btn btn-submit py-1 px-3">Submit</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<button class="btn no-shadow btn-skip-popup" data-dismiss="popup" data-target=".email-lead-wrap">Skip <i class="fa fa-arrow-right" aria-hidden="true"></i></button>';

        break;
      case "option-two":
        newChild =
          '<div class="option-two">' +
          '<div class="neon-type">' +
          '<div class="mail-form-wrap">' +
          "<div class='d-flex align-items-center'>" +
          '<img class="email-illustration" src="../assets/icons/newones/icons/comments.png" alt="email illustration">' +
          "</div>" +
          '<div class="lead-forms">' +
          '<div class="email-lead-top">' +
          '<h1 id="email-lead-header-text" class="header-text">' +
          "Continue Watching This Video" +
          "</h1>" +
          '<h2 id="email-lead-sub-header-text" class="sub-head-text">' +
          "Enter Your Email Below" +
          "</h2>" +
          "</div>" +
          '<div class="form-group" id="email-name">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Name">' +
          "</div>" +
          '<div class="form-group">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Email">' +
          "</div>" +
          '<div class="d-flex">' +
          '<button id="email-lead-btn" class="btn btn-block btn-submit py-2 px-3">Submit</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<button class="btn no-shadow btn-skip-popup" data-dismiss="popup" data-target=".email-lead-wrap">Skip <i class="fa fa-arrow-right" aria-hidden="true"></i></button>';

        break;
      case "option-three":
        newChild =
          '<div class="option-three">' +
          '<div class="translucent-type">' +
          '<div class="mail-form-wrap">' +
          '<img class="email-illustration" src="../assets/icons/newones/icons/ICONS fRESH/mail and backGround.png" alt="email illustration">' +
          '<div class="lead-forms">' +
          '<div class="email-lead-top">' +
          '<h1 id="email-lead-header-text" class="header-text">' +
          "Continue Watching This Video" +
          "</h1>" +
          '<h2 id="email-lead-sub-header-text" class="sub-head-text">' +
          "Enter Your Email Below" +
          "</h2>" +
          "</div>" +
          '<div class="form-group" id="email-name">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Name">' +
          "</div>" +
          '<div class="d-flex">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input mr-1" placeholder="Enter Your Email">' +
          '<button id="email-lead-btn" class="btn btn-submit py-1 px-3">Submit</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<button class="btn no-shadow btn-skip-popup" data-dismiss="popup" data-target=".email-lead-wrap">Skip <i class="fa fa-arrow-right" aria-hidden="true"></i></button>';

        break;
      case "option-four":
        newChild =
          '<div class="option-four">' +
          '<div class="email-lead-top">' +
          '<h1 id="email-lead-header-text" class="header-text">' +
          "Continue Watching This Video" +
          "</h1>" +
          '<h2 id="email-lead-sub-header-text" class="sub-head-text">' +
          "Enter Your Email Below" +
          "</h2>" +
          "</div>" +
          '<div class="head_outside-type">' +
          '<div class="mail-form-wrap">' +
          '<div class="lead-forms">' +
          '<div class="form-group" id="email-name">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Name">' +
          "</div>" +
          '<div class="form-group">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Email">' +
          "</div>" +
          '<div class="d-flex">' +
          '<button id="email-lead-btn" class="btn btn-block btn-submit py-2 px-3">Submit</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<button class="btn no-shadow btn-skip-popup" data-dismiss="popup" data-target=".email-lead-wrap">Skip <i class="fa fa-arrow-right" aria-hidden="true"></i></button>';

        break;
      case "option-five":
        newChild =
          '<div class="option-five">' +
          '<div class="email-section">' +
          '<div class="email-lead-top">' +
          '<h1 id="email-lead-header-text" class="header-text">' +
          "Continue Watching This Video" +
          "</h1>" +
          '<h2 id="email-lead-sub-header-text" class="sub-head-text">' +
          "Enter Your Email Below" +
          "</h2>" +
          "</div>" +
          '<div class="mail-form-wrap">' +
          '<div class="lead-forms">' +
          '<div class="form-group" id="email-name">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Name">' +
          "</div>" +
          '<div class="form-group">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Email">' +
          "</div>" +
          '<div class="d-flex">' +
          '<button id="email-lead-btn" class="btn btn-block btn-submit py-2 px-3">Submit</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<button class="btn no-shadow btn-skip-popup" data-dismiss="popup" data-target=".email-lead-wrap">Skip <i class="fa fa-arrow-right" aria-hidden="true"></i></button>';

        break;
      case "option-six":
        newChild =
          '<div class="option-six">' +
          '<div class="head_outside-type">' +
          '<div class="head_outside-type-inner">' +
          '<img class="illus-image" src="../assets/icons/newones/icons/illustrator 3d1.png" alt="illustration image">' +
          '<div class="email-lead-top">' +
          '<h1 id="email-lead-header-text" class="header-text">' +
          "Continue Watching This Video" +
          "</h1>" +
          '<h2 id="email-lead-sub-header-text" class="sub-head-text">' +
          "Enter Your Email Below" +
          "</h2>" +
          "</div>" +
          '<div class="mail-form-wrap">' +
          '<div class="lead-forms">' +
          '<div class="form-group" id="email-name">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Name">' +
          "</div>" +
          '<div class="form-group">' +
          '<input type="text" name="" class="form-control no-shadow vc-form-input" placeholder="Enter Your Email">' +
          "</div>" +
          '<div class="d-flex">' +
          '<button id="email-lead-btn" class="btn btn-block btn-submit py-2 px-3">Submit</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<button class="btn no-shadow btn-skip-popup" data-dismiss="popup" data-target=".email-lead-wrap">Skip <i class="fa fa-arrow-right" aria-hidden="true"></i></button>';

        break;
      default:
        break;
    }
  });

  $(".btn-submit-design").on("click", function () {
    $("#email-name-request").prop("checked", false);
    $(".email-lead-wrap").get(0).replaceChildren();
    $(".email-lead-wrap").append(newChild);
    $("#choose-design_modal").modal("toggle");
  });

  $("#toggle-page-mode").on("change", function () {
    if ($(this).is(":checked")) {
      $(".video-settings-box").addClass("light-mode");
      $("#skin-color-input").val("#ffffff4d");
      $("#skin-color-input").trigger("input");
    } else {
      $(".video-settings-box").removeClass("light-mode");
      $("#skin-color-input").val("#2c064054");
      $("#skin-color-input").trigger("input");
    }
  });

  $(".thumbnail-type-input").on("change", function () {
    var val = $(this).val();
    switch (val) {
      case "library":
        $(".upload-thumb").css("display", "none");
        $("#choose-library-image").modal("show");
        break;
      case "upload":
        $(".upload-thumb").css("display", "block");
        break;

      default:
        $(".upload-thumb").css("display", "none");
        break;
    }
  });

  var index = 1;

  $(".btn-add-mid_rolls").on("click", function () {
    index++;

    var newChild =
      '<div class="card">' +
      '<div class="card-header" id="heading' +
      index +
      '">' +
      '<h5 class="mb-0">' +
      '<button class="btn btn-link collapsed"' +
      'data-toggle="collapse" data-target="#collapse' +
      index +
      '"' +
      'aria-expanded="false" aria-controls="collapse' +
      index +
      '">' +
      "Mid Roll #" +
      index +
      "</button>" +
      '<button class="btn no-shadow btn-delete-mid-roll">' +
      '<img src="../assets/icons/cancel icon.svg" alt="">' +
      "</button>" +
      "</h5>" +
      "</div>" +
      '<div id="collapse' +
      index +
      '" class="collapse"' +
      'aria-labelledby="heading' +
      index +
      '" data-parent="#accordion">' +
      '<div class="card-body">' +
      '<div class="col-12">' +
      '<div class="form-group">' +
      '<label for="">Title</label>' +
      '<input data-update="text" data-target=".ad_title" class="form-control vc-form-input" type="text" name="">' +
      "</div>" +
      "</div>" +
      '<div class="col-12">' +
      '<div class="mb-3">' +
      "<div" +
      ' class="d-flex align-items-center justify-content-between mb-1">' +
      '<label class="mb-0">Video Source Url</label>' +
      '<button class="btn btn-upload-play">' +
      '<input type="file" name="">' +
      "Browse" +
      "</button>" +
      "</div>" +
      '<input class="form-control vc-form-input" type="text" name=""' +
      'placeholder="enter pre-roll src">' +
      '<div class="red-desc-text mt-1">' +
      "maximum video size 20mb" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-12 mb-3">' +
      '<div class="d-flex settings-uplooad">' +
      '<img id="img-selected-mid-roll' +
      index +
      '"' +
      'src="../assets/icons/upload video illustration.png"' +
      'alt="play icon">' +
      '<div class="upload-texts">' +
      '<div class="title">' +
      "Upload An Image" +
      "</div>" +
      '<button type="button" class="btn btn-upload-play">' +
      '<input type="file" name="" id="" title="image upload"' +
      'data-update="img-upload"' +
      'data-target="#img-selected-mid-roll' +
      index +
      ' .rolls_ad_img">' +
      "Browse" +
      "</button>" +
      '<div class="note">' +
      "Note: Image Max Size 1mb" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-12">' +
      '<div class="mb-3">' +
      "<label>Button Text</label>" +
      '<input title="button text"' +
      'class="form-control vc-form-input add-btn-text"' +
      'data-target=".btn_ad_link" value="Learn more" type="text" name=""' +
      'placeholder="">' +
      "</div>" +
      "</div>" +
      '<div class="col-12">' +
      '<div class="mb-3">' +
      "<label>Button URL</label>" +
      '<input data-update="text" class="form-control vc-form-input"' +
      'data-target=".ad_link" type="url" value="http://www.dummyurl.com" name=""' +
      'placeholder="Enter valid url">' +
      "</div>" +
      "</div>" +
      '<div class="col-12">' +
      '<div class="form-group play-btn-color">' +
      '<label for="">Button Text Colour</label>' +
      '<input value="#000000" class="add-btn-color-text-input"' +
      'data-target=".btn_ad_link" type="color" name="">' +
      "</div>" +
      "</div>" +
      '<div class="col-12">' +
      '<div class="form-group play-btn-color">' +
      '<label for="">Button Colour</label>' +
      '<input title="Button Colour" value="#e9e9ed"' +
      'class="add-btn-color-input" data-target=".btn_ad_link"' +
      'type="color" name="">' +
      "</div>" +
      "</div>" +
      '<div class="col-12">' +
      '<div class="mb-3">' +
      "<label>Border radius</label>" +
      '<input title="Border radius" placeholder="1"' +
      'class="form-control number-input vc-form-input add-btn-border-radius"' +
      'data-target=".btn_ad_link" type="number" name=""' +
      'step="1" value="30">' +
      "</div>" +
      "</div>" +
      '<div class="d-flex mb-3 px-3">' +
      '<label class="custom-check">' +
      '<input class="skip-option" data-target=".rolls-ad-outter"' +
      'type="checkbox">' +
      '<span class="checkmark"></span>' +
      "</label>" +
      '<span class="label">Skip Option</span>' +
      "</div>" +
      '<div class="col-12">' +
      '<div class="mb-3">' +
      '<label class="mb-0">Time</label>' +
      '<input class="form-control time-input vc-form-input" type="time"' +
      'value="00:00:00" step="1" name="" placeholder="00:00:00">' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";
    $(".mid-roll-actions").append(newChild);
    $(".btn-delete-mid-roll").on("click", function () {
      $(this).parent().parent().parent().remove();
    });
    $('[data-update="text"]').on("input", function () {
      //alert('Yeah');
      $($(this).attr("data-target")).text($(this).val());
    });
    $(".add-btn-text").each(function () {
      $(this).on("input", function () {
        $($(this).attr("data-target")).text($(this).val());
      });
    });
    $('[data-update="url"]').on("input", function () {
      $($(this).attr("data-target")).attr("href", $(this).val());
    });
    $('[data-update="text-color"]').on("input", function () {
      $($(this).attr("data-target")).css("color", $(this).val());
    });
    $(".add-btn-color-input").each(function () {
      $(this).on("input", function () {
        $($(this).attr("data-target")).css("background", $(this).val());
      });
    });

    $(".add-btn-color-text-input").each(function () {
      $(this).on("input", function () {
        $($(this).attr("data-target")).css("color", $(this).val());
      });
    });

    $(".add-btn-border-radius").each(function () {
      $(this).on("input", function () {
        $($(this).attr("data-target")).css(
          "border-radius",
          $(this).val() + "px"
        );
      });
    });

    $('[data-update="img-upload"]').change(function () {
      var targets = $(this).attr("data-target").split(" ");

      if (targets.length > 1) {
        readURL(this, targets[0], targets[1]);
      } else {
        readURL(this, targets[0]);
      }
    });

    $(".skip-option").on("change", function () {
      if ($(this).is(":checked")) {
        $($(this).attr("data-target")).addClass("skipable");
      } else {
        $($(this).attr("data-target")).removeClass("skipable");
      }
    });
  });

  $(".skip-option").on("change", function () {
    if ($(this).is(":checked")) {
      $($(this).attr("data-target")).addClass("skipable");
    } else {
      $($(this).attr("data-target")).removeClass("skipable");
    }
  });

  function countdown(seconds) {
    let timer = seconds;

    function updateTimer() {
      $(".countdown-display").text(timer);

      if (timer === 0) {
        $(".countdown_wrap").css("display", "none");
        $($(".countdown-display").attr("data-target")).css("display", "block");

        // Replace the line above with the action you want to perform after the countdown
      } else {
        timer--;
        setTimeout(updateTimer, 1000); // Delay of 1000 milliseconds (1 second)
      }
      // console.log(timer);
    }

    updateTimer();
  }

  countdown(5);

  // Count dowwn 

  const targetDate = new Date("November 29, 2024 23:59").getTime();

  // Display the target date
  document.getElementById("target-date").innerText = new Date(targetDate).toLocaleString();

  // Update the countdown every second
  const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = targetDate - now;

      if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          // Update the DOM
          document.getElementById("days").innerText = days;
          document.getElementById("hours").innerText = hours;
          document.getElementById("minutes").innerText = minutes;
          document.getElementById("seconds").innerText = seconds;
      } else {
          // Countdown completed
          clearInterval(countdownInterval);
          document.getElementById("countdown").innerHTML = "<h2>Countdown Complete!</h2>";
      }
  }, 1000);
});
