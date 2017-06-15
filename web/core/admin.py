from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.template.loader import render_to_string
from django.shortcuts import redirect
from django.utils.translation import ugettext as _
from .models import FlickrSearch, FlickrImage
from sorl.thumbnail.admin import AdminImageMixin


class FlickrImagesInline(AdminImageMixin, admin.TabularInline):
    model = FlickrSearch.images.through
    extra = 0


# class FlickrImageAdmin(admin.ModelAdmin):
#     list_display = ('thumb',)

#     def thumb(self, obj):
#         return render_to_string('admin/thumb.html', {
#             'image': obj.image
#         })
#     thumb.allow_tags = True
# admin.site.register(FlickrImage, FlickrImageAdmin)


class FlickrSearchAdmin(admin.ModelAdmin):
    list_display = ('query', 'exclude', 'tag_mode', 'user_id')
    list_display_links = ('query',)
    list_filter = ('tag_mode', 'user_id', 'created_at', 'updated_at',)
    inlines = [FlickrImagesInline,]
    exclude = ('images',)
admin.site.register(FlickrSearch, FlickrSearchAdmin)


