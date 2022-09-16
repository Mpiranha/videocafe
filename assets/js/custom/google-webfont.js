var settings = {
  "url": "https://webfonts.googleapis.com/v1/webfonts?sort=POPULARITY&key=AIzaSyBfgyd2DNKcv3rcUgMC9SHbIvzw6ngD7OY",
  "method": "GET",
  "timeout": 0,
};

$.ajax(settings).done(function (response) {
  console.log(response.items);
  const MAX = 99;
  response.items.forEach(function (item, index) {
    if (index > MAX) {
      return;
    }

    $('#font-select').append($("<option />").val(item.files.regular + ',' + item.family).text(item.family));
  });
});

//https://fonts.googleapis.com/css?family=Roboto:Regular