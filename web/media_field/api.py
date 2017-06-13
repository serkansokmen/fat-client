from django.conf.urls import url
from . import views

urlpatterns = (
    url(r'^media-field/images/$', views.url_image_list, name='media_field_api'),
)
