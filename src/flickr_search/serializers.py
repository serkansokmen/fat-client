import requests
from django.conf import settings
from rest_framework import serializers, permissions, response
from .models import FlickrSearch, FlickrImage


class FlickrImageSerializer(serializers.ModelSerializer):

    state = serializers.ChoiceField(choices=FlickrImage.IMAGE_STATES, allow_null=True)
    flickr_url = serializers.URLField(source='get_flickr_url', allow_null=True)
    flickr_thumbnail = serializers.URLField(source='get_flickr_thumbnail', allow_null=True)

    def create(self, validated_data):
        image = FlickrImage.objects.create(**validated_data)

        # image.tags = parse_tags(validated_data.pop('tags'))
        state_val = validated_data.pop('state', '')
        if state_val is not None:
            state = FlickrImage.IMAGE_STATES[state_val]
        return image

    class Meta:
        model = FlickrImage
        fields = ('flickr_id', 'secret', 'title',
            'owner', 'secret', 'server', 'farm',
            'license', 'tags',
            'image', 'license',
            'ispublic', 'isfriend', 'isfamily',
            'state',
            'flickr_url',
            'flickr_thumbnail')
        read_only_fields = ('image', 'flickr_url', 'flickr_thumbnail')


class FlickrSearchSerializer(serializers.ModelSerializer):

    # tags = serializers.CharField()
    # user_id = serializers.CharField(allow_blank=True, allow_null=True, default="")
    # tag_mode = serializers.ChoiceField(choices=FlickrSearch.TAG_MODES,
    #     default=FlickrSearch.TAG_MODES[0], allow_null=True)
    licenses = serializers.MultipleChoiceField(choices=FlickrImage.LICENSES, allow_blank=True)
    images = FlickrImageSerializer(many=True)

    class Meta:
        model = FlickrSearch
        fields = ('tags', 'tag_mode', 'user_id', 'licenses', 'images', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

    def create(self, validated_data):
        # import ipdb; ipdb.set_trace()
        instance = FlickrSearch.objects.create(
            tags=validated_data.get('tags'),
            tag_mode=validated_data.get('tag_mode'),
            user_id=validated_data.get('user_id'),
            licenses=validated_data.get('licenses'),)

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
        return instance

    # def update(self, instance, validated_data):

    #     req = self.request_flickr_search(validated_data)

    #     if req.json()['stat'] == 'ok':
    #         for photo in req.json()['photos']['photo']:
    #             image, created = FlickrImage.objects.get_or_create(
    #                 flickr_id=photo.get('id'),
    #                 title=photo.get('title'),
    #                 owner=photo.get('owner'),
    #                 secret=photo.get('secret'),
    #                 server=photo.get('server'),
    #                 farm=photo.get('farm'),
    #                 license=photo.get('license'),
    #                 tags=photo.get('tags'),
    #                 ispublic=photo.get('ispublic'),
    #                 isfriend=photo.get('isfriend'),
    #                 isfamily=photo.get('isfamily'))
    #             if image not in instance.images.all():
    #                 instance.images.add(image)
    #         instance.save()
    #         return instance
