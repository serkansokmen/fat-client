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

  var constructUrl = function(type) {
    if (type == 'flickr') {
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
  };

  var querySearch = function(type, callback) {
    var url = constructUrl(type);
    loadJSON(url, function(data) {
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
        querySearch('flickr', function(data) {
          eval(data);
          if (callback) {
            callback(data);
          }
        });
      }
    }
  };

  var view = {
    search: {},
    getParameterByName: function(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  };
  $('#flickrsearch_form').on('submit', function(event) {
    // event.preventDefault();
    // var data = $(event.target).serialize();
    // data.image = $('#media_widget_image_hidden').val();
    // console.log(data);
    // debugger
    // $.ajax({
    //   url: '/api/v1/flickrsearch/', // the endpoint
    //   type: 'POST', // http method
    //   dataType: 'json',
    //   data: $(event.target).serialize(),
    //   // handle a successful response
    //   success: function(json) {
    //     console.log(json);
    //   },
    //   // handle a non-successful response
    //   error: function(xhr, errmsg, err) {
    //     console.log('error');
    //   }
    // });
  });
  $('#searchButton').click(function(e) {
    e.preventDefault();
    var query = $('#searchInput').val();
    images.query = query;
    images.flickr.page = 1;
    images.flickr.sync(function(data) {
      view.search.drawWrapper();
      view.drawThumbnails(images.flickr.getPhotos(), $('#flickr'));
      $('#flickr_page').text(images.flickr.page + " of " + images.flickr.pages);
    });
  });
  view.search.drawWrapper = function() {
    $('#flickr_wrapper').html('<div id="flickr" class="media_widget_thumbnails">' +
      '</div>' +
      '<div class="media_widget_row" style="text-align:center;">' +
      '<a id="flickr_prev" href="#">&lt;prev</a>' +
      ' page <span id="flickr_page"></span> ' +
      '<a id="flickr_next" href="#">next&gt;</a>' +
      '</div>');

    $('#flickr_next').click(function(e) {
      e.preventDefault();
      images.flickr.nextPage();
      images.flickr.sync(function(data) {
        view.drawThumbnails(images.flickr.getPhotos(), $('#flickr'));
        $('#flickr_page').text(images.flickr.page + " of " + images.flickr.pages);
      });
    });

    $('#flickr_prev').click(function(e) {
      e.preventDefault();
      var photos = [];
      images.flickr.prevPage();
      images.flickr.sync(function(data) {
        view.drawThumbnails(images.flickr.getPhotos(), $('#flickr'));
        $('#flickr_page').text(images.flickr.page + " of " + images.flickr.pages);
      });
    });
  };

  view.drawThumbnails = function(photos, $thumbnails) {
    $thumbnails.html('');
    var li = '<div class="thumbnail">' +
      '<img id="thumbnail_{0}" class="media_widget_thumbnail" src="{1}" style="height:240px;">' +
      '<div class="controls"><button class="btn btn-approve" type="button">Approve</button><button class="btn btn-discard" type="button">Discard</button></div>' +
      '</div>';
    var thumbnails = '';
    for (var i = 0; i < photos.length; i++) {
      thumbnails += li.format(i, photos[i].thumbnail);
    }
    if (photos.length == 0) {
      thumbnails = "There is nothing found."
    }
    $thumbnails.html(thumbnails);

    $.each($('.thumbnail'), function(index, element) {
      $(element).find('.btn-approve').click(function(event) {
        event.preventDefault();
        $('#media_widget_image_hidden').val(photos[index].url);
        $('#media_widget_is_approved').val(true);
        $('#media_widget_is_discarded').val(false);
        $(this).closest('.thumbnail').remove();
        if ($('.thumbnail').length === 1) {
          images.flickr.nextPage();
        }
        $('#flickrsearch_form').submit();
      });
      $(element).find('.btn-discard').click(function(event) {
        event.preventDefault();
        $('#media_widget_image_hidden').val(photos[index].url);
        $('#media_widget_is_approved').val(false);
        $('#media_widget_is_discarded').val(true);
        $(this).closest('.thumbnail').remove();
        if ($('.thumbnail').length === 1) {
          images.flickr.nextPage();
        }
        $('#flickrsearch_form').submit();
      });
    });
  };

  var keywords = view.getParameterByName('keywords', window.location.search);
  if (keywords && keywords.length > 0) {
    $('#searchInput').val(keywords);
  } else {
    $('#searchInput').val('nude');
  }
  images.flickr.sync(function(data) {
    view.search.drawWrapper();
    view.drawThumbnails(images.flickr.getPhotos(), $('#flickr'));
    $('#flickr_page').html(images.flickr.page + " of " + images.flickr.pages);
  });
});
