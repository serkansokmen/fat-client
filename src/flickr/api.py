import requests
import json
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from rest_framework import viewsets, parsers, views
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django_filters import rest_framework as filters
from .models import Search, Image
from .serializers import SearchSerializer, ImageSerializer


def make_search_query(request, page=1):


    req_data = request.GET if request.method == 'GET' else request.data
    tags = req_data.get('tags', None)
    tag_mode = req_data.get('tag_mode')
    licenses = req_data.get('licenses')
    user_id = req_data.get('user_id')
    per_page = int(req_data.get('per_page', '10'))
    flickr_per_page =  req_data.get('perpage', 500)

    if tags is None:
        return Response({
            'message': '`tags` field is required to make a query.'
        })
    else:
        tags = tags.replace(' ', '')

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
            'per_page': flickr_per_page,
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
                'value': Image.IMAGE_STATES[0][0],
                'label': Image.IMAGE_STATES[0][1],
            }
        } for photo_data in data['photo'] if Image.objects.filter(id=photo_data['id']).count() == 0 ]

        flickr_pages = int(data['pages'])
        flickr_page = int(data['page'])
        flickr_total = int(data['total'])

        if len(images) < per_page and flickr_total > per_page * page:
            if flickr_page < flickr_pages and flickr_total > flickr_per_page * flickr_page:
                import ipdb; ipdb.set_trace()
                return make_search_query(request, page=flickr_page + 1)
            else:
                import ipdb; ipdb.set_trace()
                flickr_page = 1
                return make_search_query(request, page=flickr_page)

        else:
            try:
                search = Search.objects.get(tags=tags)
            except Search.DoesNotExist:
                search = Search.objects.create(
                    tags=tags,
                    tag_mode=tag_mode,
                    licenses=licenses,
                    user_id=user_id)
            search_serializer = SearchSerializer(search)
            return Response({
                'total': flickr_total - search.images.count(),
                'search': search_serializer.data,
                'images': images
            })
    else:
        return Response({'message': 'No results'})


@api_view(['GET', 'POST', 'PUT'])
def flickr(request):

    if request.method == 'GET':
        # return make_search_query(request,
        #     page=int(request.GET.get('page', 1)))
        return make_search_query(request)

    elif request.method == 'POST' or request.method == 'PUT':

        images_data = request.data.get('images', None)

        if images_data is None:
            return Response({'message': 'Some images are required'})

        response = make_search_query(request)
        search = Search.objects.get(id=response.data.get('search')['id'])

        for image_data in images_data:
            (image, created) = Image.objects.get_or_create(**image_data)
            if image_data.get('state') != Image.IMAGE_STATES[1][0] and search.images.filter(id=image.id).count() == 0:
                search.images.add(image)
        search.save()

        return Response({
            'search': response.data.get('search'),
            'images': response.data.get('images'),
            'total': response.data.get('total'),
        })

    return Response({'message': 'GET or POST required'})


class SearchQueryView(views.APIView):

    def post(self, request, format=None):
        # search, created = Search.objects.get_or_create(tags=request.data['tags'])
        # if created:
        #     pass
        # else:
        #     pass
        serializer = SearchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SearchViewSet(viewsets.ModelViewSet):

    serializer_class = SearchSerializer
    queryset = Search.objects.all()



class ImageViewSet(viewsets.ModelViewSet):

    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('state', 'license')

    # def get_queryset(self):
    #     queryset = Image.objects.all()
    #     state = self.request.query_params.get('state', None)
    #     if state is not None:
    #         queryset = queryset.filter(state=Image.IMAGE_STATES[2][0])
    #     return queryset


class LicenseView(views.APIView):

    def get(self, request, format=None):
        return Response([{
            'id': license[0],
            'name': license[1],
        } for license in Image.LICENSES])

