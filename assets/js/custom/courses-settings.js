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
  readURL(this, ".default-logo");
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

storeData = (event, index) => {
  const target = event.target;
  console.log(target.type);
  if (target.type == "text") {
    links[index].name = target.value;
  } else {
    links[index].link = target.value;
  }
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

$(".btn-preview-nav").on("click", () => {
  populateNavbar();
});

$("#remove-navbar").on("change", function () {
  if ($(this).is(":checked")) {
    clearAllLink();
  } else {
  }
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

function removeAllNavbar() {
  $("#navigation-custom").html("");
}

function clearAllLink() {
  links = [];

  removeAllNavbar();
  $(".nav_link_set_wrap").html("");
}

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
