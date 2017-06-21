from rest_framework import serializers, permissions
from .models import FlickrSearch, FlickrImage, FlickrSearchImage, FlickrLicense


class FlickrLicenseSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrLicense
        fields = ('id', 'name', 'url')


class FlickrImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlickrImage
        query = FlickrImage.objects.filter(
            is_approved=False, is_discarded=False, is_processed=False)
        fields = ('flickr_image_id', 'flickr_image_url', 'is_discarded',
            'image', 'license', 'tags')
        read_only_fields = ('image', 'is_approved', 'is_processed')


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
            # search_image = FlickrSearchImage.objects.create(
            #     search=instance,
            #     image=image)
        return instance
