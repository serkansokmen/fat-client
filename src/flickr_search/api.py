import requests
import json
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from rest_framework import viewsets, parsers, views
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import FlickrSearch, FlickrImage
from .serializers import FlickrSearchSerializer, FlickrImageSerializer


def make_search_query(request, page=1):
    per_page = request.GET.get('per_page', '20')
    req = requests.get('https://api.flickr.com/services/rest/?method=flickr.photos.search',
        params={
            'api_key': settings.FLICKR_API_KEY,
            'api_secret': settings.FLICKR_API_SECRET,
            'format': 'json',
            'nojsoncallback': 1,
            'license': request.GET.get('license'),
            'safe_search': 3,
            'sort' : 'relevance',
            'media': 'photos',
            'content_type': 7,
            'extras': 'license,tags',
            'per_page': per_page,
            'page': str(page),
            'tags': request.GET.get('tags', ''),
            'tag_mode': request.GET.get('tag_mode', 'all')})

    if req.json()['stat'] == 'ok':

        data = req.json()['photos']

        images = [{
            # 'id': photo_data['id'],
            'flickr_id': photo_data['id'],
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
        } for photo_data in data['photo'] if FlickrImage.objects.filter(flickr_id=photo_data['id']).count() == 0 ]

        if len(images) < int(per_page) and int(data['pages']) > int(data['page']):
            # import ipdb; ipdb.set_trace()
            return make_search_query(request, page=page+1)
        else:
            return Response({
                'page': data['page'],
                'pages': data['pages'],
                'perpage': data['perpage'],
                'total': data['total'],
                'images': images
            })
    else:
        return Response({'message': 'No results'})



@api_view(['GET'])
def search_flickr(request):
    return make_search_query(request, page=int(request.GET.get('page', 1)))


class FlickrSearchQueryView(views.APIView):

    def post(self, request, format=None):
        serializer = FlickrSearchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        req = requests.get('https://api.flickr.com/services/rest/?method=flickr.photos.search',
            params={
                'api_key': settings.FLICKR_API_KEY,
                'api_secret': settings.FLICKR_API_SECRET,
                'format': 'json',
                'nojsoncallback': 1,
                'license': request.query_params.get('license'),
                'safe_search': 3,
                'sort' : 'relevance',
                'media': 'photos',
                'content_type': 7,
                'extras': 'license,tags',
                'per_page': request.query_params.get('per_page', '20'),
                'page': request.query_params.get('page', 1),
                'tags': request.query_params.get('tags', ''),
                'tag_mode': request.query_params.get('tag_mode', 'all')})

        if req.json()['stat'] == 'ok':
            photos = [{
                'id': photo.get('id'),
                'owner': photo.get('owner'),
                'secret': photo.get('secret'),
                'server': photo.get('server'),
                'farm': photo.get('farm'),
                'title': photo.get('title'),
                'ispublic': photo.get('ispublic'),
                'isfriend': photo.get('isfriend'),
                'isfamily': photo.get('isfamily'),
                'license': photo.get('license'),
                'tags': photo.get('tags'),
            } for photo in req.json()['photos']['photo']]
            serializer = FlickrImageSerializer(data=photos, many=True)
            return Response({
                'total': req.json()['photos']['total'] * 1,
                'pages': req.json()['photos']['pages'],
                'results': serializer.initial_data
            })


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

