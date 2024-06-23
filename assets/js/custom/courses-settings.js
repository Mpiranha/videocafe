const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  // ['blockquote', 'code-block'],
  ["link", "image"],

  // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

  // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  // [{ 'font': [] }],
  [{ align: [] }], // remove formatting button
  [{ direction: "rtl" }], // text direction
];

const quillHead = new Quill("#editor-heading", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions,
  },
});

const quillSub = new Quill("#editor-sub", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions,
  },
});

const quillSubAfter = new Quill("#editor-sub-after", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions,
  },
});

quillHead.on("text-change", function () {
  const content = quillHead.root.innerHTML;

  $("#heading-before-video").html(content);
});

quillSub.on("text-change", function () {
  const content = quillSub.root.innerHTML;

  $("#subheading-before-video").html(content);
});

quillSubAfter.on("text-change", function () {
  const content = quillSubAfter.root.innerHTML;

  $("#subheading-after-video").html(content);
});

$("#default-logo-switch").on("change", function () {
  if ($(this).is(":checked")) {
    $(".default-logo").attr("src", "../assets/images/vclawd-Logo.png");
  } else {
    $(".default-logo").attr("src", "");
  }
});

$("#disable-comment-switch").on("change", function () {
  if ($(this).is(":checked")) {
    $(".comment-section").css("display", "none");
  } else {
    $(".comment-section").css("display", "block");
  }
});

$("#disable-related-switch").on("change", function () {
  if ($(this).is(":checked")) {
    $(".related-videos-section").css("display", "none");
  } else {
    $(".related-videos-section").css("display", "block");
  }
});

$("#page-logo-upload").change(function () {
  readURLLogo(this, ".default-logo");
});

var links = [
  {
    name: "demo 1",
    link: "http://www.facebook.com",
  },
  {
    name: "demo 2",
    link: "http://www.facebook.com",
  },
];

var buttonList = [
  // {
  //   name: "default link",
  //   link: "http://www.default.com",
  //   fontSize: "16",
  //   backgroundColor: "#000000",
  //   position: "left",
  // },
  // {
  //   name: "default link 2",
  //   link: "http://www.default.com",
  //   fontSize: "35",
  //   backgroundColor: "#eeeeee",
  //   position: "right",
  // },
  // {
  //   name: "default link 2",
  //   link: "http://www.default.com",
  //   fontSize: "25",
  //   backgroundColor: "#F20D0D",
  //   position: "center",
  // },
  // {
  //   name: "default link 3",
  //   link: "http://www.defaulter.com",
  //   fontSize: "40",
  //   backgroundColor: "#F20D0D",
  //   position: "left",
  // },
];

//populate navbar
links.forEach((link, indx) => {
  $("#navigation-custom").append(
    '<a class="nav-link nav-link-custom" href="' +
      link.link +
      '">' +
      link.name +
      "</a>"
  );

  $(".nav_link_set_wrap").append(
    '<div class="nav_link_set_item">' +
      '<input value="' +
      link.name +
      '" type="text"' +
      'oninput="storeData(event, ' +
      indx +
      ')"' +
      'class="form-control vc-form-input navbar_link_name mr-2">' +
      '<input value="' +
      link.link +
      '" type="url"' +
      'oninput="storeData(event, ' +
      indx +
      ')"' +
      'class="form-control vc-form-input navbar_link_url">' +
      "</div>"
  );
});

buttonList.forEach((butt, indx) => {
  $(".buttons-after-video-list").append(
    '<div class="button-after-video-wrap mb-3" style="display: flex; justify-content: ' +
      butt.position +
      ';">' +
      '<a class="btn" href="' +
      butt.link +
      '"' +
      'style="background-color: ' +
      butt.backgroundColor +
      ";color: #ffffff; font-size: " +
      butt.fontSize +
      'px;">' +
      butt.name +
      "</a>" +
      "</div>"
  );

  $(".buttons-after-video-list-settings").append(
    '<div class="nav_link_set_item">' +
      '<input oninput="storeButton(event, ' +
      indx +
      ')" value="' +
      butt.name +
      '" type="text"' +
      'class="form-control vc-form-input mr-2">' +
      '<input oninput="storeButton(event, ' +
      indx +
      ')" value="' +
      butt.backgroundColor +
      '" type="color"' +
      'class="form-control vc-form-input color-picker">' +
      "</div>" +
      '<div class="form-group">' +
      '<input type="url" name="" id="" class="form-control vc-form-input"' +
      'placeholder="http://" oninput="storeButton(event, ' +
      indx +
      ')" value="' +
      butt.link +
      '">' +
      "</div>" +
      '<div class="nav_link_set_item align-items-center">' +
      '<label for="" class="mr-2">Font Size</label>' +
      '<input oninput="storeButton(event, ' +
      indx +
      ')" value="' +
      butt.fontSize +
      '" type="number"' +
      'class="form-control vc-form-input man-width">' +
      "</div>" +
      '<div class="nav_link_set_item">' +
      '<div class="d-flex mr-2">' +
      '<label class="custom-check-label mr-2">' +
      '<input type="radio" name="btn-' +
      indx +
      '-pos" class="form-check-input" ' +
      'id="" oninput="storeButton(event, ' +
      indx +
      ')" value="left" ' +
      (butt.position == "left" ? "checked" : "") +
      ">" +
      '<span class="check-mark rounded"></span>' +
      "</label>" +
      '<label for="">Left</label>' +
      "</div>" +
      '<div class="d-flex mr-2">' +
      '<label class="custom-check-label mr-2">' +
      '<input type="radio" name="btn-' +
      indx +
      '-pos" class="form-check-input" ' +
      'id="" oninput="storeButton(event, ' +
      indx +
      ')" value="center" ' +
      (butt.position == "center" ? "checked" : "") +
      ">" +
      '<span class="check-mark rounded"></span>' +
      "</label>" +
      '<label for="">Center</label>' +
      "</div>" +
      '<div class="d-flex mr-2">' +
      '<label class="custom-check-label mr-2">' +
      '<input type="radio" name="btn-' +
      indx +
      '-pos" class="form-check-input" ' +
      'id="" oninput="storeButton(event, ' +
      indx +
      ')" value="right" ' +
      (butt.position == "right" ? "checked" : "") +
      ">" +
      '<span class="check-mark rounded"></span>' +
      "</label>" +
      '<label for="">Right</label>' +
      "</div>" +
      '<div class="d-flex">' +
      '<label class="custom-check-label mr-2">' +
      '<input type="radio" name="btn-' +
      indx +
      '-pos" class="form-check-input" ' +
      'id="" oninput="storeButton(event, ' +
      indx +
      ')" value="between" ' +
      (butt.position == "between" ? "checked" : "") +
      ">" +
      '<span class="check-mark rounded"></span>' +
      "</label>" +
      '<label for="">Between</label>' +
      "</div>" +
      "</div>" +
      "</div>"
  );
});

storeData = (event, index) => {
  const target = event.target;
  console.log(target.type);
  if (target.type == "text") {
    links[index].name = target.value;
  } else {
    links[index].link = target.value;
  }
};

storeButton = (event, index) => {
  const target = event.target;

  console.log(target.type);
  // position: "left",
  switch (target.type) {
    case "text":
      buttonList[index].name = target.value;
      break;
    case "color":
      buttonList[index].backgroundColor = target.value;
      break;
    case "url":
      buttonList[index].link = target.value;
      break;
    case "number":
      buttonList[index].fontSize = target.value;
      break;
    default:
      buttonList[index].position = target.value;
      break;
  }

  console.log(buttonList);
};

$(".btn-addmore-link").on("click", () => {
  links.push({
    name: "Link-" + (links.length + 1),
    link: "http://",
  });

  $(".nav_link_set_wrap").append(
    '<div class="nav_link_set_item">' +
      '<input value="Link-' +
      links.length +
      '" type="text"' +
      'oninput="storeData(event, ' +
      (links.length - 1) +
      ')"' +
      'class="form-control vc-form-input navbar_link_name mr-2">' +
      '<input value="' +
      "http://" +
      '" type="url"' +
      'oninput="storeData(event, ' +
      (links.length - 1) +
      ')"' +
      'class="form-control vc-form-input navbar_link_url">' +
      "</div>"
  );

  console.log(links);
});

$(".btn-add-more-button").on("click", () => {
  buttonList.push({
    name: "Button-" + (buttonList.length + 1),
    link: "http://",
    fontSize: "35",
    backgroundColor: "#000000",
    position: "left",
  });

  $(".buttons-after-video-list-settings").append(
    // main
    '<div class="nav_link_set_item">' +
      '<input oninput="storeButton(event, ' +
      (buttonList.length - 1) +
      ')" value="Button-' +
      buttonList.length +
      '" type="text"' +
      'class="form-control vc-form-input mr-2">' +
      '<input oninput="storeButton(event, ' +
      (buttonList.length - 1) +
      ')" value="#000000" type="color"' +
      'class="form-control vc-form-input color-picker">' +
      "</div>" +
      '<div class="form-group">' +
      '<input type="url" name="" id="" class="form-control vc-form-input"' +
      'placeholder="http://" oninput="storeButton(event, ' +
      (buttonList.length - 1) +
      ')" value="http://">' +
      "</div>" +
      '<div class="nav_link_set_item align-items-center">' +
      '<label for="" class="mr-2">Font Size</label>' +
      '<input oninput="storeButton(event, ' +
      (buttonList.length - 1) +
      ')" value="35" type="number"' +
      'class="form-control vc-form-input man-width">' +
      "</div>" +
      '<div class="nav_link_set_item">' +
      '<div class="d-flex mr-2">' +
      '<label class="custom-check-label mr-2">' +
      '<input type="radio" name="btn-' +
      (buttonList.length - 1) +
      '-pos" class="form-check-input" ' +
      'id="" oninput="storeButton(event, ' +
      (buttonList.length - 1) +
      ')" value="left" checked>' +
      '<span class="check-mark rounded"></span>' +
      "</label>" +
      '<label for="">Left</label>' +
      "</div>" +
      '<div class="d-flex mr-2">' +
      '<label class="custom-check-label mr-2">' +
      '<input type="radio" name="btn-' +
      (buttonList.length - 1) +
      '-pos" class="form-check-input" ' +
      'id="" oninput="storeButton(event, ' +
      (buttonList.length - 1) +
      ')" value="center">' +
      '<span class="check-mark rounded"></span>' +
      "</label>" +
      '<label for="">Center</label>' +
      "</div>" +
      '<div class="d-flex mr-2">' +
      '<label class="custom-check-label mr-2">' +
      '<input type="radio" name="btn-' +
      (buttonList.length - 1) +
      '-pos" class="form-check-input" ' +
      'id="" oninput="storeButton(event, ' +
      (buttonList.length - 1) +
      ')" value="right">' +
      '<span class="check-mark rounded"></span>' +
      "</label>" +
      '<label for="">Right</label>' +
      "</div>" +
      '<div class="d-flex">' +
      '<label class="custom-check-label mr-2">' +
      '<input type="radio" name="btn-' +
      (buttonList.length - 1) +
      '-pos" class="form-check-input" ' +
      'id="" oninput="storeButton(event, ' +
      (buttonList.length - 1) +
      ')" value="between">' +
      '<span class="check-mark rounded"></span>' +
      "</label>" +
      '<label for="">Between</label>' +
      "</div>" +
      "</div>" +
      "</div>"
  );
});

$(".btn-preview-nav").on("click", () => {
  populateNavbar();
});

$(".btn-preview-btns").on("click", () => {
  populateButtons();
});

$("#remove-navbar").on("change", function () {
  if ($(this).is(":checked")) {
    clearAllLink();
  } else {
  }
});

$("#bg-color-change").on("input", () => {
  $(".courses_page_outter").css("backgroundColor", $("#bg-color-change").val());
});

$("#bg-image-upload").on("change", () => {
  //console.log(readURL($("#bg-image-upload")));
  readURL($("#bg-image-upload").get(0), $(".courses_page_outter"));
  //$(".courses_page_outter").css("backgroundColor", $("#bg-image-upload").val());
});

//populate sidemenu
// links.forEach((link) => {
//   $(".nav_link_set_wrap").append(
//     '<div class="nav_link_set_item">' +
//       '<input value="' +
//       link.name +
//       '" type="text"' +
//       'class="form-control vc-form-input navbar_link_name mr-2">' +
//       '<input value="' +
//       link.link +
//       '" type="text"' +
//       'class="form-control vc-form-input navbar_link_url">' +
//       "</div>"
//   );
// });

function populateNavbar() {
  removeAllNavbar();
  //populate navbar
  links.forEach((link) => {
    $("#navigation-custom").append(
      '<a class="nav-link nav-link-custom" href="' +
        link.link +
        '">' +
        link.name +
        "</a>"
    );
  });
}

function populateButtons() {
  removeAllButtons();
  console.log(buttonList);
  //populate buttons
  buttonList.forEach((butt) => {
    $(".buttons-after-video-list").append(
      '<div class="button-after-video-wrap mb-3" style="display: flex; justify-content: ' +
        butt.position +
        ';">' +
        '<a class="btn" href="' +
        butt.link +
        '"' +
        'style="background-color: ' +
        butt.backgroundColor +
        ";color: #ffffff; font-size: " +
        butt.fontSize +
        'px;">' +
        butt.name +
        "</a>" +
        "</div>"
    );
  });
}

function removeAllNavbar() {
  $("#navigation-custom").html("");
}

function removeAllButtons() {
  $(".buttons-after-video-list").html("");
}

function clearAllLink() {
  links = [];

  removeAllNavbar();
  $(".nav_link_set_wrap").html("");
}

toggleOptions = (event) => {
  var imageWrap = $("#bg-image-upload-wrap");
  var colorWrap = $("#bg-color-change-wrap");
  var target = event.target;
  var value = target.value;

  imageWrap.addClass("d-none");
  colorWrap.addClass("d-none");

  switch (value) {
    case "image":
      imageWrap.removeClass("d-none");
      $(".courses_page_outter").css("backgroundColor", "unset");
      break;
    default:
      colorWrap.removeClass("d-none");
      $(".courses_page_outter").css("backgroundImage", "unset");
      break;
  }
};

function readURL(input, target) {
  console.log(input);
  console.log(target);
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      //$(target).attr("src", e.target.result);
      // console.log(target.css("backgroundImage"));

      target.css("backgroundImage", "url(" + e.target.result + ")");
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function readURLLogo(input, target, self) {
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
