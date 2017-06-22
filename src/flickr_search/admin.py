from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.template.loader import render_to_string
from django.shortcuts import redirect
from django.utils.translation import ugettext as _
from sorl.thumbnail.admin import AdminImageMixin
from .models import FlickrSearch, FlickrImage


class FlickrImageAdmin(AdminImageMixin, admin.ModelAdmin):
    list_display = ('thumb', 'flickr_id', 'secret', 'license', 'tags', 'search')
    list_filter = ('state', 'license', 'server', 'farm', 'owner',
        'ispublic', 'isfriend', 'isfamily')

    def thumb(self, obj):
        return render_to_string('admin/thumb.html', {
            'image_url': obj.get_flickr_thumbnail()
        })
    thumb.allow_tags = True
admin.site.register(FlickrImage, FlickrImageAdmin)


class FlickrSearchAdmin(admin.ModelAdmin):
    list_display = ('image_count', 'tags', 'tag_mode', 'user_id')
    list_display_links = ('tags',)
    list_filter = ('tag_mode', 'user_id', 'created_at', 'updated_at',)
    filter_horizontal = ('images',)
    # exclude = ('images',)

    def image_count(self, obj):
        return obj.images.count()
    image_count.short_description = _('Image count')
admin.site.register(FlickrSearch, FlickrSearchAdmin)
