from urllib.request import urlopen

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from rest_framework import serializers, permissions
from .models import FlickrSearch, FlickrImage


class FlickrSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrSearch
        fields = ('query', 'exclude', 'tag_mode', 'user_id', 'images')


class FlickrImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrImage
        fields = ('flickr_image_id', 'flickr_image_url', 'image',)
        read_only_fields = ('image',)

    def create(self, validated_data):
        instance = FlickrImage(
            flickr_image_id=validated_data['flickr_image_id'],
            flickr_image_url=validated_data['flickr_image_url']
        )
        img_url = instance.flickr_image_url
        img_temp = NamedTemporaryFile(delete=True)
        img_temp.write(urlopen(img_url).read())
        img_temp.flush()
        instance.image.save(instance.flickr_image_id, File(img_temp))
        return instance
