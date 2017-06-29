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
        return FlickrImage.objects.create(**validated_data,
            state=state)

    # def to_presentation(self, obj):
    #     import ipdb; ipdb.set_trace()
    #     return obj

    class Meta:
        model = FlickrImage
        queryset=FlickrImage.objects.all()
        fields = ('flickr_id', 'secret', 'title',
            'owner', 'secret', 'server', 'farm',
            'license', 'tags',
            'image', 'license',
            'ispublic', 'isfriend', 'isfamily',
            'state',
            'flickr_url', 'flickr_thumbnail')
        read_only_fields = ('image', 'flickr_url', 'flickr_thumbnail')


class FlickrSearchSerializer(serializers.ModelSerializer):

    licenses = serializers.MultipleChoiceField(choices=FlickrImage.LICENSES, allow_blank=True)
    images = FlickrImageSerializer(many=True)

    class Meta:
        model = FlickrSearch
        fields = ('tags', 'tag_mode', 'user_id', 'licenses', 'images', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
        depth = 1

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        instance = FlickrSearch.objects.create(**validated_data)
        for image_data in images_data:
            image, created = FlickrImage.objects.get_or_create(**image_data)
            if image not in instance.images.all():
                if created:
                    image.flickr_url = image.get_flickr_url()
                    image.flickr_thumbnail = image.get_flickr_thumbnail()
                    image.save()
                instance.images.add(image)
        print(instance.images.all())
        return instance
        # for image in validated_data.get('images'):
        #     image, created = FlickrImage.objects.get_or_create(
        #         flickr_id=photo.get('id'),
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
        return instance
