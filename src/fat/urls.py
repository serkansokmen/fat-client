from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework import routers
import flickr_search.api as flickr_search_api


router = routers.DefaultRouter()
router.register(r'search', flickr_search_api.FlickrSearchViewSet)
router.register(r'images', flickr_search_api.FlickrImageViewSet)
# router.register(r'licenses', flickr_search_api.FlickrLicenseViewSet)


urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
]

urlpatterns += [
    url(r'^admin/', admin.site.urls),
    url(r'^auth/', include('rest_auth.urls')),
    url(r'^api/v1/flickr-licenses/', flickr_search_api.FlickrLicenseView.as_view()),
    url(r'^$', TemplateView.as_view(template_name='flickr_search/app.html')),
    url(r'^flickr_search/', include('flickr_search.urls')),
]

urlpatterns += staticfiles_urlpatterns()
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL,
#         document_root=settings.STATIC_ROOT)
