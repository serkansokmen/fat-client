from django.conf.urls import url, include
# from django.views.generic import TemplateView
from rest_framework import routers

import core.views as views


urlpatterns = (
    # url for Home
    # url(r'^add/$', TemplateView.as_view(template_name='core/add.html')),
    url(r'^add/$', views.save_flickr_search, name='save_flickr_search'),
)

urlpatterns += (
    # urls for Catalog
    # url(r'^catalog/$', views.CatalogListView.as_view(), name='shop_catalog_list'),
    # url(r'^catalog/create/$', views.CatalogCreateView.as_view(),
        # name='shop_catalog_create'),
    # url(r'^catalog/detail/(?P<slug>\S+)/$',
    #     views.CatalogDetailView.as_view(), name='shop_catalog_detail'),
    # url(r'^catalog/update/(?P<slug>\S+)/$',
    #     views.CatalogUpdateView.as_view(), name='shop_catalog_update'),
)
