from rest_framework import serializers
from .models import FlickrSearch


class FlickrSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrSearch
        fields = ('flickr_image_id', 'image', 'is_approved', 'is_discarded',)
