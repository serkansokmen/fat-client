$(function() {
  /* Creating an ability to format a String */
  if (!String.prototype.format) {
    var format = function() {
      var args = arguments;
      var result = this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
      })

      return result;
    }
    String.prototype.format = format;
  };

  var nextPage = function(callback) {
    if (this.page < this.pages) {
      this.page += 1;
    }
  };
  var prevPage = function() {
    if (this.page > 1) {
      this.page -= 1;
    }
  };
  var getPhotos = function() {
    return this.photos;
  };



  var loadJSON = function(url, success, error) {
    var ajax = new XMLHttpRequest();
    var processResponse = function() {
      if (success && ajax.status == 200 && ajax.readyState == 4) {
        return success(ajax.responseText);
      };
      if (error || ajax.status == 404 && ajax.readyState == 4) {
        return error(ajax.responseText);
      }
    };
    ajax.onreadystatechange = processResponse;
    ajax.open("GET", url, true);
    ajax.send();
  };

  var jsonFlickrApi = function(response) {
    if (response.stat != "ok") {
      alert('Unable to get photos from Flickr:' + response.message);
      return;
    }
    var data = response.photos;
    images.flickr.pages = Math.ceil(Number(data.total) / 8);
    images.flickr.photos = [];
    for (var i = 0; i < data.photo.length; i++) {
      var p = data.photo[i];
      var photo = {};
      photo.url = "https://farm{0}.staticflickr.com/{1}/{2}_{3}.jpg".format(p.farm, p.server, p.id, p.secret);
      // t for thumbnail, 100 on longest side
      photo.thumbnail = "https://farm{0}.staticflickr.com/{1}/{2}_{3}_{4}.jpg".format(p.farm, p.server, p.id, p.secret, "q");
      images.flickr.photos.push(photo);
    };
  };

  var constructUrl = function() {
    return "https://api.flickr.com/services/rest/?" +
      "method=flickr.photos.search" +
      "&api_key=" + FLICKR_API_KEY +
      "&format=json" +
      "&license=4,5,6,7" +
      "&safe_search=3" +
      "&sort=relevance" +
      "&media=photos" +
      "&per_page=8" +
      "&page=" + images.flickr.page +
      "&text=" + images.query;
  };

  var querySearch = function(callback) {
    loadJSON(constructUrl(), function(data) {
      if (callback) {
        callback(data);
      }
    });
  };

  var images = {
    query: '',
    flickr: {
      page: 1,
      pages: 0,
      nextPage: nextPage,
      prevPage: prevPage,
      getPhotos: getPhotos,
      photos: [],
      sync: function(callback) {
        querySearch(function(data) {
          eval(data);
          if (callback) {
            callback(data);
          }
        });
      }
    }
  };

  var view = {};
  view.search = {};
  view.image = document.getElementById('media_widget_image');
  view.image_hidden = document.getElementById('media_widget_image_hidden');
  view.search.button = document.getElementById('searchButton');
  view.search.input = document.getElementById('searchInput');
  view.search.wrapper = document.getElementById('flickr_wrapper');
  view.getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };
  view.search.button.onclick = function(e) {
    e.preventDefault();
    var query = view.search.input.value;
    images.query = query;
    images.flickr.page = 1;
    images.flickr.sync(function(data) {
      view.search.drawWrapper();
      view.drawThumbnails(images.flickr.getPhotos(), view.search.ul);
      view.search.page.innerHTML = images.flickr.page + " of " + images.flickr.pages;
    });
  };
  var keywords = view.getParameterByName('keywords', window.location.search);
  if (keywords.length > 0) {
    view.search.input.value = keywords;
    console.log(keywords);
    images.flickr.sync(function(data) {
      view.search.drawWrapper();
      view.drawThumbnails(images.flickr.getPhotos(), view.search.ul);
      view.search.page.innerHTML = images.flickr.page + " of " + images.flickr.pages;
    });
  }
  view.search.drawWrapper = function() {
    view.search.wrapper.innerHTML = '<ul id="flickr" class="media_widget_thumbnails" style="margin-left:0px;margin-bottom:0px;padding-left:0px;">' +
      '</ul>' +
      '<div class="media_widget_row" style="text-align:center;">' +
      '<a id="flickr_prev" href="#">&lt;prev</a>' +
      ' page <span id="flickr_page"></span> ' +
      '<a id="flickr_next" href="#">next&gt;</a>' +
      '</div>';
    view.search.ul = document.getElementById('flickr');
    view.search.next = document.getElementById('flickr_next');
    view.search.prev = document.getElementById('flickr_prev');
    view.search.page = document.getElementById('flickr_page');

    view.search.next.onclick = function(e) {
      e.preventDefault();

      images.flickr.nextPage();
      images.flickr.sync(function(data) {
        view.drawThumbnails(images.flickr.getPhotos(), view.search.ul);
        view.search.page.innerHTML = images.flickr.page + " of " + images.flickr.pages;
      });
    };
    view.search.prev.onclick = function(e) {
      e.preventDefault();
      var photos = [];
      images.flickr.prevPage();
      images.flickr.sync(function(data) {
        view.drawThumbnails(images.flickr.getPhotos(), view.search.ul);
        view.search.page.innerHTML = images.flickr.page + " of " + images.flickr.pages;
      });
    };
  };

  view.drawThumbnails = function(photos, ul) {
    ul.innerHTML = '';
    var li = ' <li style="list-style-type:none; display:inline;">' +
      '<a href="#"><img id="thumbnail_{0}" class="media_widget_thumbnail" src="{1}" style="height:240px;"></a>' +
      '</li>';
    var thumbnails = '';
    for (var i = 0; i < photos.length; i++) {
      thumbnails += li.format(i, photos[i].thumbnail);
    }
    if (photos.length == 0) {
      thumbnails = "There is nothing found."
    }
    ul.innerHTML = thumbnails;
    var onThumbnailClick = function(photo) {
      return function(e) {
        e.preventDefault();

        view.image.src = photo.url;
        view.image_hidden.value = photo.url;
      };
    };

    var thumbnails = ul.getElementsByClassName('media_widget_thumbnail');
    for (var i = 0; i < thumbnails.length; i++) {
      thumbnails[i].onclick = onThumbnailClick(photos[i]);
    }
  };
});
