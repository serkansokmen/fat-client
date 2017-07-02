import requests
import json
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from rest_framework import viewsets, parsers, views
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import FlickrSearch, FlickrImage
from .serializers import FlickrSearchSerializer, FlickrImageSerializer


def make_search_query(request, page=1):
    per_page = request.GET.get('per_page', 500)
    tags = request.GET.get('tags', '')
    tag_mode = request.GET.get('tag_mode', 'all')
    licenses = request.GET.get('licenses')
    req = requests.get('https://api.flickr.com/services/rest/?method=flickr.photos.search',
        params={
            'api_key': settings.FLICKR_API_KEY,
            'api_secret': settings.FLICKR_API_SECRET,
            'format': 'json',
            'nojsoncallback': 1,
            'license': licenses,
            'safe_search': 3,
            'sort' : 'relevance',
            'media': 'photos',
            'content_type': 7,
            'extras': 'license,tags',
            'per_page': per_page,
            'page': str(page),
            'tags': tags,
            'tag_mode': tag_mode})

    if req.json()['stat'] == 'ok':

        data = req.json()['photos']
        images = [{
            # 'id': photo_data['id'],
            'id': photo_data['id'],
            'title': photo_data['title'],
            'owner': photo_data['owner'],
            'secret': photo_data['secret'],
            'server': photo_data['server'],
            'farm': photo_data['farm'],
            'license': photo_data['license'],
            'tags': photo_data['tags'],
            'ispublic': photo_data['ispublic'],
            'isfriend': photo_data['isfriend'],
            'isfamily': photo_data['isfamily'],
            'state': {
                'value': FlickrImage.IMAGE_STATES[0][0],
                'label': FlickrImage.IMAGE_STATES[0][1],
            }
        } for photo_data in data['photo'] if FlickrImage.objects.filter(id=photo_data['id']).count() == 0 ]

        pages = int(data['pages'])
        page = int(data['page'])
        per_page = int(per_page)

        # loop = False
        if ((len(images) == 0 and len(images) < per_page) and pages > page):
            return make_search_query(request, page=page+1)
        else:
            # search_serializer = FlickrSearchSerializer(data=request.GET)
            try:
                search = FlickrSearch.objects.get(tags=tags)
            except FlickrSearch.DoesNotExist:
                search = None
            if search is not None:
                search_serializer = FlickrSearchSerializer(search)
            else:
                search_serializer = FlickrSearchSerializer(data=request.GET)
            # FlickrSearchSerializer(data={
            #         'tags': tags,
            #         'tag_mode': tag_mode,
            #         'licenses': licenses
            #         }).initial_data
            # search, created = FlickrSearch.objects.get_or_create(tags__iexact=tags)

            return Response({
                'total': data['total'],
                'search': search_serializer.data if search is not None else search_serializer.initial_data,
                'images': images
            })
    else:
        return Response({'message': 'No results'})


@api_view(['GET', 'POST', 'PUT'])
def search_flickr(request):

    if request.method == 'GET':
        # return make_search_query(request,
        #     page=int(request.GET.get('page', 1)))
        return make_search_query(request, page=1)

    elif request.method == 'POST':

        (search, created) = FlickrSearch.objects.get_or_create(request.data)
        images_data = request.data.get('images', None)

        if images_data is None:
            return Response({'message': 'Some images are required'})

        for image_data in images_data:
            (image, created) = FlickrImage.objects.get_or_create(**image_data)
            if image_data.get('state') != FlickrImage.IMAGE_STATES[1][0] and image not in search.images.all():
                search.images.add(image)

        search.save()
        return make_search_query(request, page=1)

    elif request.method == 'PUT':

        (search, created) = FlickrSearch.objects.get_or_create(request.data)
        images_data = request.data.get('images', None)

        if images_data is None:
            return Response({'message': 'Some images are required'})

        for image_data in images_data:
            (image, created) = FlickrImage.objects.get_or_create(**image_data)
            if image_data.get('state') != FlickrImage.IMAGE_STATES[1][0] and image not in search.images.all():
                search.images.add(image)

        search.save()
        return make_search_query(request, page=1)

    return Response({'message': 'GET or POST required'})


class FlickrSearchQueryView(views.APIView):

    def post(self, request, format=None):
        # search, created = FlickrSearch.objects.get_or_create(tags=request.data['tags'])
        # if created:
        #     pass
        # else:
        #     pass
        serializer = FlickrSearchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FlickrSearchViewSet(viewsets.ModelViewSet):

    serializer_class = FlickrSearchSerializer
    queryset = FlickrSearch.objects.all()


class FlickrImageViewSet(viewsets.ModelViewSet):

    serializer_class = FlickrImageSerializer
    queryset = FlickrImage.objects.all()
    # parser_classes = [parsers.FileUploadParser,]


class FlickrLicenseView(views.APIView):

    def get(self, request, format=None):
        return Response([{
            'id': license[0],
            'name': license[1],
        } for license in FlickrImage.LICENSES])

