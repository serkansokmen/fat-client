from rest_framework import serializers, permissions
from .models import FlickrSearch


class FlickrSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrSearch
        # permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
        fields = ('flickr_image_id', 'image', 'is_approved', 'is_discarded',)
