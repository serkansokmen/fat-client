from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class FlickrSearchConfig(AppConfig):
    name = 'flickr_search'
    verbose_name = _('Search')
