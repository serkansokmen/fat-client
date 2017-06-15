from rest_framework import serializers, permissions
from .models import FlickrSearch


class FlickrSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrSearch
        fields = ('query', 'exclude', 'tag_mode', 'user_id', 'images')
