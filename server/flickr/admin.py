from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.template.loader import render_to_string
from django.shortcuts import redirect
from django.utils.translation import ugettext as _
from sorl.thumbnail.admin import AdminImageMixin
from .models import Search, Image

def set_images_indeterminate(modeladmin, request, queryset):
    queryset.update(state=Image.IMAGE_STATES[0][0])
set_images_indeterminate.short_description = "Mark selected as `Indeterminate`"

def set_images_discarded(modeladmin, request, queryset):
    queryset.update(state=Image.IMAGE_STATES[1][0])
set_images_discarded.short_description = "Mark selected as `Discarded`"

def set_images_approved(modeladmin, request, queryset):
    queryset.update(state=Image.IMAGE_STATES[2][0])
set_images_approved.short_description = "Mark selected as `Approved`"

def set_images_processed(modeladmin, request, queryset):
    queryset.update(state=Image.IMAGE_STATES[3][0])
set_images_processed.short_description = "Mark selected as `Completed`"

class ImageAdmin(AdminImageMixin, admin.ModelAdmin):
    list_display = ('state', 'image_tag', 'id', 'secret', 'license', 'tags',)
    list_filter = ('search', 'state', 'license', 'owner',
        'ispublic', 'isfriend', 'isfamily')
    readonly_fields = ('image_tag', 'ispublic', 'isfriend', 'isfamily')
    actions = [
        set_images_indeterminate,
        set_images_discarded,
        set_images_approved,
        set_images_processed
    ]
admin.site.register(Image, ImageAdmin)


class SearchAdmin(admin.ModelAdmin):
    list_display = (
        'tags',
        'image_count_indeterminate',
        'image_count_discarded',
        'image_count_approved',
        'image_count_processed',)
    list_display_links = ('tags',)
    list_filter = ('tag_mode', 'user_id', 'created_at', 'updated_at',)
    filter_horizontal = ('images',)
    readonly_fields = ('licenses',)
    # exclude = ('images',)

    def image_count_indeterminate(self, obj):
        return obj.get_images_of_state(Image.IMAGE_STATES[0]).count()
    image_count_indeterminate.short_description = _('{} image count'.format(Image.IMAGE_STATES[0][1]))
    def image_count_discarded(self, obj):
        return obj.get_images_of_state(Image.IMAGE_STATES[1]).count()
    image_count_discarded.short_description = _('{} image count'.format(Image.IMAGE_STATES[1][1]))
    def image_count_approved(self, obj):
        return obj.get_images_of_state(Image.IMAGE_STATES[2]).count()
    image_count_approved.short_description = _('{} image count'.format(Image.IMAGE_STATES[2][1]))
    def image_count_processed(self, obj):
        return obj.get_images_of_state(Image.IMAGE_STATES[3]).count()
    image_count_processed.short_description = _('{} image count'.format(Image.IMAGE_STATES[3][1]))

admin.site.register(Search, SearchAdmin)
