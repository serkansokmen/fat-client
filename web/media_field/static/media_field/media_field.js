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

  var jsonFlickrApi = function(response) {
    if (response.stat != 'ok') {
      alert('Unable to get photos from Flickr:' + response.message);
      return;
    }
    var data = _.filter(response.photos.photo, function(photo, index) {
      for (var i = 0; i < Math.min(images.existingPhotos.length); i++) {
        if (images.existingPhotos[i].flickr_image_id === photo.id || index > 7) {
          return false;
        }
      }
      return true;
    });
    images.flickr.pages = Math.ceil(Number(data.total) / 8);
    images.flickr.photos = _.map(data, function(p) {
      return {
        id: p.id,
        url: 'https://farm{0}.staticflickr.com/{1}/{2}_{3}.jpg'.format(p.farm, p.server, p.id, p.secret),
        thumbnail: 'https://farm{0}.staticflickr.com/{1}/{2}_{3}_{4}.jpg'.format(p.farm, p.server, p.id, p.secret, 'q')
      };
    });
  };

  var constructUrl = function(type) {
    if (type == 'flickr') {
      return 'https://api.flickr.com/services/rest/?' +
        'method=flickr.photos.search' +
        '&api_key=' + FLICKR_API_KEY +
        '&format=json' +
        '&license=4,5,6,7' +
        '&safe_search=3' +
        '&sort=relevance' +
        '&media=photos' +
        '&per_page=100' +
        '&page=' + images.flickr.page +
        '&text=' + images.query;
    };
  };

  var querySearch = function(type, callback) {
    var url = constructUrl(type);
    $.get(url, function(data) {
      if (callback) {
        callback(data);
      }
    });
  };

  var images = {
    query: '',
    existingPhotos: [],
    flickr: {
      page: 1,
      pages: 0,
      nextPage: nextPage,
      prevPage: prevPage,
      getPhotos: getPhotos,
      photos: [],
      photo: null,
      markPhoto: function(decision, photo) {
        this.photo = photo;
        if (decision === 'approve') {
          $('#media_widget_image_hidden').val(photo.url);
          $('#media_widget_is_approved').val(true);
          $('#media_widget_is_discarded').val(false);
          $(this).closest('.thumbnail').remove();
          if ($('.thumbnail').length === 1) {
            images.flickr.nextPage();
          }
        } else if (decision === 'discard') {
          $('#media_widget_image_hidden').val(photo.url);
          $('#media_widget_is_approved').val(false);
          $('#media_widget_is_discarded').val(true);
          $(this).closest('.thumbnail').remove();
          if ($('.thumbnail').length === 1) {
            images.flickr.nextPage();
          }
        }
        $('#media_widget_flickr_image_id').val(photo.id);
        setTimeout(function() {
          $('#flickrsearch_form').submit();
        });
      },
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

  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        var csrftoken = $('[name=csrfmiddlewaretoken]').val();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    }
  });

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
    event.preventDefault();
    var data = $(this).serialize();
    var action = $(this).attr('action');
    var options = {
      // url: '/api/v1/flickrsearch/',
      url: action,
      type: 'post',
      data: data,
      // dataType: 'json',
      beforeSubmit: function(arr, $form, options) {
        // The array of form data takes the following form:
        // [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
        console.log(arr);
        // return false to cancel submit
      },
      success: function(json) {
        window.location = action + '?query=' + encodeURIComponent(images.query) + '&page=' + images.flickr.page;
      },
      // handle a non-successful response
      error: function(xhr, errmsg, err) {
        console.log('error', errmsg, err);
      }
    };
    $.ajax(options);
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
      window.history.pushState('', '', $('#flickrsearch_form').attr('action') + '?query=' + encodeURIComponent(query));
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
        window.history.pushState('', '', $('#flickrsearch_form').attr('action') + '?query=' + encodeURIComponent(query) + '&page=' + images.flickr.page);
      });
    });

    $('#flickr_prev').click(function(e) {
      e.preventDefault();
      var photos = [];
      images.flickr.prevPage();
      images.flickr.sync(function(data) {
        view.drawThumbnails(images.flickr.getPhotos(), $('#flickr'));
        $('#flickr_page').text(images.flickr.page + " of " + images.flickr.pages);
        window.history.pushState('', '', $('#flickrsearch_form').attr('action') + '?query=' + encodeURIComponent(query) + '&page=' + images.flickr.page);
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
        images.flickr.markPhoto('approve', photos[index]);
      });
      $(element).find('.btn-discard').click(function(event) {
        event.preventDefault();
        images.flickr.markPhoto('discard', photos[index]);
      });
    });
  };
  $.get('/api/v1/flickrsearch', function(data) {
    images.existingPhotos = data;
    var query = view.getParameterByName('query', window.location.search);
    if (query && query.length > 0) {
      $('#searchInput').val(query);
    } else {
      query = 'nude';
      $('#searchInput').val(query);
    }
    images.query = query;
    images.flickr.page = parseInt(view.getParameterByName('page', window.location.search), 10) || 1;
    images.flickr.sync(function(data) {
      view.search.drawWrapper();
      view.drawThumbnails(images.flickr.getPhotos(), $('#flickr'));
      $('#flickr_page').html(images.flickr.page + " of " + images.flickr.pages);
    });
  });
});
