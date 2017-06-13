from rest_framework import serializers
from .models import FlickrSearch


class FlickrSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrSearch
        fields = ('image', 'is_approved', 'is_discarded',)
        read_only_fields = ('url', 'image',)
