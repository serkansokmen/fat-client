from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework import routers
import core.api as core_api


router = routers.DefaultRouter()
router.register(r'flickrsearch', core_api.FlickrSearchViewSet)


urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
]

urlpatterns += [
    url(r'^admin/', admin.site.urls),
    url(r'^core/', include('core.urls')),
]

urlpatterns += staticfiles_urlpatterns()
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL,
#         document_root=settings.STATIC_ROOT)
