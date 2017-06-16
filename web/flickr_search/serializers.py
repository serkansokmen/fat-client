from rest_framework import serializers, permissions
from .models import FlickrSearch, FlickrImage, FlickrSearchImage


class FlickrImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrImage
        fields = ('flickr_image_id', 'flickr_image_url', 'image',)
        read_only_fields = ('image',)


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
            search_image = FlickrSearchImage.objects.create(
                search=instance,
                image=image)
        return instance
