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
        query = FlickrImage.objects.all()
        fields = ('flickr_id', 'secret', 'title',
            'owner', 'secret', 'server', 'farm',
            'license', 'tags',
            'image', 'license',
            'ispublic', 'isfriend', 'isfamily',
            'state',
            'flickr_url',
            'flickr_thumbnail')
        read_only_fields = ('image', 'flickr_url', 'flickr_thumbnail')


class FlickrSearchSerializer(serializers.Serializer):

    tags = serializers.CharField()
    user_id = serializers.CharField(allow_blank=True, allow_null=True, default="")
    tag_mode = serializers.ChoiceField(choices=FlickrSearch.TAG_MODES,
        default=FlickrSearch.TAG_MODES[0], allow_null=True)
    licenses = serializers.MultipleChoiceField(choices=FlickrImage.LICENSES,
        allow_null=True)
    per_page = serializers.IntegerField(default=settings.REST_FRAMEWORK['PAGE_SIZE'],
        allow_null=True)
    page = serializers.IntegerField(default=1)
    images = FlickrImageSerializer(many=True)

    class Meta:
        fields = ('tags', 'user_id', 'tag_mode', 'licenses')

    def request_flickr_search(self, validated_data):
        return requests.get('https://api.flickr.com/services/rest/?method=flickr.photos.search',
            params={
                'api_key': settings.FLICKR_API_KEY,
                'api_secret': settings.FLICKR_API_SECRET,
                'format': 'json',
                'nojsoncallback': 1,
                'license': validated_data.get('license'),
                'safe_search': 3,
                'sort' : 'relevance',
                'media': 'photos',
                'content_type': 7,
                'extras': 'license,tags',
                'per_page': validated_data.get('per_page', '20'),
                'page': validated_data.get('page', 1),
                'tags': validated_data.get('tags', ''),
                'tag_mode': validated_data.get('tag_mode', 'all')})

    def create(self, validated_data):

        req = self.request_flickr_search(validated_data)

        if req.json()['stat'] == 'ok':
            instance, created = FlickrSearch.objects.create(
                tags=validated_data.get('tags'),
                tag_mode=validated_data.get('tag_mode'),
                user_id=validated_data.get('user_id'))

            for photo in req.json()['photos']['photo']:
                image, created = FlickrImage.objects.get_or_create(
                    flickr_id=photo.get('id'),
                    title=photo.get('title'),
                    owner=photo.get('owner'),
                    secret=photo.get('secret'),
                    server=photo.get('server'),
                    farm=photo.get('farm'),
                    license=photo.get('license'),
                    tags=photo.get('tags'),
                    ispublic=photo.get('ispublic'),
                    isfriend=photo.get('isfriend'),
                    isfamily=photo.get('isfamily'))
                if created:
                    instance.images.add(image)
            instance.save()
            return instance

    def update(self, instance, validated_data):

        req = self.request_flickr_search(validated_data)

        if req.json()['stat'] == 'ok':
            instance, created = FlickrSearch.objects.create(
                tags=validated_data.get('tags'),
                tag_mode=validated_data.get('tag_mode'),
                user_id=validated_data.get('user_id'))

            for photo in req.json()['photos']['photo']:
                image, created = FlickrImage.objects.get_or_create(
                    flickr_id=photo.get('id'),
                    title=photo.get('title'),
                    owner=photo.get('owner'),
                    secret=photo.get('secret'),
                    server=photo.get('server'),
                    farm=photo.get('farm'),
                    license=photo.get('license'),
                    tags=photo.get('tags'),
                    ispublic=photo.get('ispublic'),
                    isfriend=photo.get('isfriend'),
                    isfamily=photo.get('isfamily'))
                if created:
                    instance.images.add(image)
            instance.save()
            return instance
