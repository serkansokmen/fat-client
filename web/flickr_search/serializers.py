from urllib.request import urlopen
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from rest_framework import serializers, permissions
from .models import FlickrSearch, FlickrImage


class FlickrImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrImage
        fields = ('flickr_image_id', 'flickr_image_url', 'image',)
        read_only_fields = ('image',)

    def create(self, validated_data):
        img_id = validated_data.pop('flickr_image_id')
        img_url = validated_data.pop('flickr_image_url')
        img_temp = NamedTemporaryFile(delete=True)
        img_temp.write(urlopen(img_url).read())
        img_temp.flush()
        instance = FlickrImage.objects.create(
            flickr_image_id=img_id,
            flickr_image_url=img_url,
            **validated_data)
        instance.image.save(
            img_id + '.jpg',
            File(img_temp))
        return instance


class FlickrSearchSerializer(serializers.ModelSerializer):

    images = FlickrImageSerializer(many=True)

    class Meta:
        model = FlickrSearch
        fields = ('query', 'exclude', 'tag_mode', 'user_id', 'images',)

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        instance = FlickrSearch.objects.create(**validated_data)
        for img_data in images_data:
            image = FlickrImage.objects.create(**img_data)
            instance.images.add(image)
        return instance
