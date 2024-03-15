const popover = document.querySelector(".motion_popover");
const path = "http://localhost/adilo/public/";
const path2 = "https://adilo.bigcommand.com/";
const mainPath = "https://adilo.bigcommand.io/";
// const playIcon = '<svg class="popover_svg_icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="103" viewBox="0 0 54 53.991"><defs><filter id="Path_9280" x="0" y="0" width="54" height="53.991" filterUnits="userSpaceOnUse"><feOffset dy="3" input="SourceAlpha"/><feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-opacity="0.161"/><feComposite operator="in" in2="blur"/><feComposite in="SourceGraphic"/></filter></defs><g id="Group_12300" data-name="Group 12300" transform="translate(9 5.944)" opacity="0.9"><circle id="Ellipse_4324" data-name="Ellipse 4324" cx="17.995" cy="17.995" r="17.995" transform="translate(0 0)" fill="#fff"/><g id="play-rounded-button" transform="translate(0 0.056)"><g id="play-circle-fill"><g transform="matrix(1, 0, 0, 1, -9, -6)" filter="url(#Path_9280)"><path id="Path_9280-2" data-name="Path 9280" d="M18,0A18,18,0,1,0,36,18,18.051,18.051,0,0,0,18,0ZM14.4,26.093V9.9L25.2,18Z" transform="translate(9 6)" fill="#00acdc"/></g></g></g></g></svg>';
const playIcon =
  '<svg class="popover_svg_icon" xmlns="http://www.w3.org/2000/svg" width="100" height="103" style="position: absolute; inset: 0px; margin: auto;" viewBox="0 0 26.723 26.723"><path id="play_frame" data-name="play frame" d="M15.362,2A13.362,13.362,0,1,0,28.723,15.362,13.367,13.367,0,0,0,15.362,2ZM12.689,21.374V9.349l8.017,6.013Z" transform="translate(-2 -2)" fill="#f7fafc" /></svg>';

if (!popover) {
  alert('Please make sure html contains div with class "motion_popover".');
} else {
  var width = popover.getAttribute("data-width"),
    height = popover.getAttribute("data-height"),
    videoId = popover.getAttribute("data-id"),
    text = popover.getAttribute("data-text"),
    experiment = popover.getAttribute("data-experiment"),
    expQuery = experiment == "true" ? "&ex=true" : "",
    // url         = `${path2}watch/${videoId}?autoplay=true${expQuery}`,
    url = "../views/video-fs.html",
    type = popover.getAttribute("data-type");
  videoFrame = `<iframe class='popover_iframe' width="${width}" height="${height}" allowtransparency="true" src="${url}" frameborder="0" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen scrolling="no" "></iframe>`;

  function fetchVideoData() {
    return fetch(`${path2}thumbnail/popover/${videoId}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        return json;
      });
  }

  function stylePopover(result, textOnly = false) {
    height = height.indexOf("%") < 0 ? `${height}px` : height;
    width = width.indexOf("%") < 0 ? `${width}px` : width;
    popover.style.width = width;
    popover.style.height = height;
    popover.style.position = "relative";
    if (!textOnly) {
      popover.style.backgroundImage = `url(${result.thumbnail})`;
      popover.style.backgroundRepeat = "no-repeat";
      popover.style.backgroundSize = `${width} ${height}`;
      popover.innerHTML = playIcon;
      let svg = document.querySelector(".popover_svg_icon");
      centerDiv(svg, "absolute");
    } else {
      popover.style.cursor = "pointer";
      popover.innerHTML = text;
    }
  }

  function centerDiv(div, position, size = false) {
    if (div) {
      div.style.position = position;
      div.style.top = "0";
      div.style.bottom = "0";
      div.style.left = "0";
      div.style.right = "0";
      div.style.margin = "auto";
      if (size) {
        div.style.width = width;
        div.style.height = height;
      }
    }
  }

  function closeModal() {
    popover.innerHTML = '<div class="stop_popover_modal"></div>';
    setTimeout(() => {
      if (type == "thumbnail") {
        popover.innerHTML = playIcon;
        let svg = document.querySelector(".popover_svg_icon");
        centerDiv(svg, "absolute");
      } else {
        popover.innerHTML = text;
      }
    }, 100);
  }

  function playVideo(video) {
    var frame = document.querySelector(".popover_iframe"),
      stopped = document.querySelector(".stop_popover_modal");
    if (frame || stopped) return false;
    if (video.id) {
      popover.innerHTML = `
                <div class='popover_modal'>${videoFrame}
                <div style='border-radius: 50%; width:20px !important; height: 20px !important; text-align:center; line-height: 1.4; color: white; font-family: arial; cursor: pointer; width: max-content; height: max-content; position: absolute; right: 10px; top: -18px; z-index=4001 !important' class='popover_modal_close'><svg xmlns="http://www.w3.org/2000/svg" width="16.409" height="16.398" viewBox="0 0 16.409 16.398">
                <g id="close" transform="translate(0 -0.168)">
                  <ellipse id="Ellipse_21" data-name="Ellipse 21" cx="8.205" cy="8.199" rx="8.205" ry="8.199" transform="translate(0 0.168)" fill="#e04f5f"/>
                  <g id="Group_751" data-name="Group 751" transform="translate(14.569 8.367) rotate(135)">
                    <rect id="Rectangle_162" data-name="Rectangle 162" width="1.907" height="8.553" transform="translate(3.593 0)" fill="#fff"/>
                    <rect id="Rectangle_163" data-name="Rectangle 163" width="8.561" height="1.907" transform="translate(0 3.594)" fill="#fff"/>
                  </g>
                </g>
              </svg>
              </div></div>`;
      var popoverModal = document.querySelector(".popover_modal");
      if (popoverModal) {
        centerDiv(popoverModal, "fixed", true);
        popoverModal.style.width = width;
        popoverModal.style.height =
          Number(height.slice(0, height.length - 2, height)) + 18 + "px";
        popoverModal.zIndex = "4000";
        popoverModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        popoverModal.style.borderTop = "18px solid rgb(255, 255, 255)";
        popoverModal.style.outline = "2px solid #fff";
        popoverModal.style.borderRadius = "0.4rem";
        var frame = document.querySelector(".popover_iframe");
        var closeButton = document.querySelector(".popover_modal_close");
        centerDiv(frame);
        closeButton.onclick = () => closeModal();
      }
    }
  }

  if (type == "thumbnail" && expQuery == "")
    fetchVideoData().then(function (result) {
      if (!result.id) alert("Failed to get video data for popover embed.");
      else {
        stylePopover(result);
        popover.onclick = () => playVideo(result);
      }
    });
  else {
    stylePopover([], true);
    popover.onclick = () => playVideo({ id: true });
  }
}
