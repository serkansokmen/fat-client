import requests
from django.conf import settings
from rest_framework import serializers, permissions, response
from .models import FlickrSearch, FlickrImage


class FlickrImageSerializer(serializers.ModelSerializer):

    state = serializers.ChoiceField(choices=FlickrImage.IMAGE_STATES, allow_null=True)

    def create(self, validated_data):
        state_val = validated_data.pop('state', '')
        if state_val is not None:
            state = FlickrImage.IMAGE_STATES[state_val]
        return FlickrImage.objects.create(**validated_data, state=state)

    class Meta:
        model = FlickrImage
        queryset = FlickrImage.objects.all()
        fields = ('id', 'secret', 'title',
            'owner', 'secret', 'server', 'farm',
            'license', 'tags',
            'image', 'license',
            'ispublic', 'isfriend', 'isfamily',
            'state')
        read_only_fields = ('image',)


class FlickrSearchSerializer(serializers.ModelSerializer):

    licenses = serializers.MultipleChoiceField(choices=FlickrImage.LICENSES, allow_blank=True)
    tag_mode = serializers.ChoiceField(choices=FlickrSearch.TAG_MODES, allow_blank=False, default=FlickrSearch.TAG_MODES[0])
    images = FlickrImageSerializer(many=True)

    class Meta:
        model = FlickrSearch
        fields = ('id', 'tags', 'tag_mode', 'user_id', 'licenses', 'images')
        read_only_fields = ('created_at', 'updated_at')
        depth = 1

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        (instance, created) = FlickrSearch.objects.get_or_create(**validated_data)
        for image_data in images_data:
            (image, created) = FlickrImage.objects.get_or_create(**image_data)
            if image_data.get('state') != FlickrImage.IMAGE_STATES[1][0] and image not in instance.images.all():
                instance.images.add(image)
        return instance

        # for image in validated_data.get('images'):
        #     image, created = FlickrImage.objects.get_or_create(
        #         id=photo.get('id'),
        #         title=photo.get('title'),
        #         owner=photo.get('owner'),
        #         secret=photo.get('secret'),
        #         server=photo.get('server'),
        #         farm=photo.get('farm'),
        #         license=photo.get('license'),
        #         tags=photo.get('tags'),
        #         ispublic=photo.get('ispublic'),
        #         isfriend=photo.get('isfriend'),
        #         isfamily=photo.get('isfamily'))
        #     if image not in instance.images.all():
        #         instance.images.add(image)
        # instance.save()

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images')
        for image_data in images_data:
            (image, created) = FlickrImage.objects.get_or_create(**image_data)
            if image_data.get('state') != FlickrImage.IMAGE_STATES[1][0] and image not in instance.images.all():
                instance.images.add(image)
        return instance
