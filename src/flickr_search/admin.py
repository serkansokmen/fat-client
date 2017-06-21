from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.template.loader import render_to_string
from django.shortcuts import redirect
from django.utils.translation import ugettext as _
from .models import FlickrSearch, FlickrImage, FlickrSearchImage, FlickrLicense
from sorl.thumbnail.admin import AdminImageMixin


class FlickrLicenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'url')
admin.site.register(FlickrLicense, FlickrLicenseAdmin)


class FlickrImageAdmin(admin.ModelAdmin):
    list_display = ('flickr_image_id', 'thumb', 'license', 'tags',)
    list_filter = ('is_approved', 'is_processed', 'is_discarded')

    def thumb(self, obj):
        return render_to_string('admin/thumb.html', {
            'image_url': obj.flickr_image_url
        })
    thumb.allow_tags = True
admin.site.register(FlickrImage, FlickrImageAdmin)


class FlickrSearchAdmin(admin.ModelAdmin):
    list_display = ('query', 'exclude', 'tag_mode', 'user_id')
    list_display_links = ('query',)
    list_filter = ('tag_mode', 'user_id', 'created_at', 'updated_at',)
    filter_horizontal = ('images',)
    # exclude = ('images',)
admin.site.register(FlickrSearch, FlickrSearchAdmin)


class FlickrSearchImageAdmin(AdminImageMixin, admin.ModelAdmin):
    list_display = ('search', 'thumb', 'is_discarded',)

    def thumb(self, obj):
        return render_to_string('admin/thumb.html', {
            'image': obj.image.image
        })
    thumb.allow_tags = True

    def is_discarded(self, obj):
        return obj.image.is_discarded
    is_discarded.allow_tags = True
# admin.site.register(FlickrSearchImage, FlickrSearchImageAdmin)
