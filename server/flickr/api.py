import requests
import json
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _
from django.http import JsonResponse
from django_filters import rest_framework as filters
from rest_framework import viewsets, parsers, views
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .models import Search, Image
from .serializers import SearchSerializer, ImageSerializer


def make_search_query(request, flickr_page=0):

    req_data = request.GET if request.method == 'GET' else request.data
    req_page = int(req_data.get('page', '1'))
    req_perpage = int(req_data.get('perpage', '10'))

    tags = req_data.get('tags', None)
    tag_mode = req_data.get('tag_mode')
    licenses = req_data.get('licenses')
    user_id = req_data.get('user_id')

    flickr_perpage =  req_data.get('flickr_perpage', 100)

    if tags is None:
        return Response({
            'message': _('`tags` field is required to make a query.')
        }, status=status.HTTP_400_BAD_REQUEST)

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
            'per_page': flickr_perpage,
            'page': str(flickr_page),
            'tags': tags,
            'tag_mode': tag_mode})
    if req.json()['stat'] == 'ok':
        return req.json()
    return None


@api_view(['GET', 'POST', 'PUT'])
def flickr(request):

    req_data = request.GET if request.method == 'GET' else request.data

    req_page = int(req_data.get('page', '1'))
    req_perpage = int(req_data.get('perpage', '10'))
    req_cursor = req_perpage * (req_page - 1)

    tags = req_data.get('tags', None)
    tag_mode = req_data.get('tag_mode')
    licenses = req_data.get('licenses')
    user_id = req_data.get('user_id')

    json = make_search_query(request)

    if json is None:
        return Response({'message': _('An error occured parsing response data.')}, status=status.HTTP_400_BAD_REQUEST)

    results = json['photos']
    flickr_pages = int(results['pages'])
    flickr_page = int(results['page'])
    flickr_total = int(results['total'])
    photos_results = results['photo']

    (search, created) = Search.objects.get_or_create(
        tags=tags,
        defaults={
            'tag_mode': tag_mode,
            'licenses': licenses,
            'user_id': user_id,
        }
    )
    search_serializer = SearchSerializer(search)

    if request.method == 'GET':
        # return if all added already
        if flickr_total == search.images.all() or flickr_total == 0:
            return Response({
                'total': 0,
                'search': search_serializer.data,
                'images': [],
                'page': req_page,
                'perpage': req_perpage,
            }, status=status.HTTP_404_NOT_FOUND)
        # we have new images
        else:
            response_images = [{
                'id': image['id'],
                'title': image['title'],
                'owner': image['owner'],
                'secret': image['secret'],
                'server': image['server'],
                'farm': image['farm'],
                'license': image['license'],
                'tags': image['tags'],
                'ispublic': image['ispublic'],
                'isfriend': image['isfriend'],
                'isfamily': image['isfamily'],
                'state': {
                    'value': Image.IMAGE_STATES[0][0],
                    'label': Image.IMAGE_STATES[0][1],
                }
            } for image in photos_results
                if not search.images.filter(
                    ~Q(state=Image.IMAGE_STATES[0][0]),
                    id=image.get('id')).exists()][req_cursor:req_cursor + req_perpage]

            response_image_ids = [img.get('id') for img in response_images]

            if len(response_images) > 0:

                already_added_count = search.images.filter(id__in=response_image_ids).count()

                return Response({
                    'total': flickr_total,
                    'left': max(flickr_total - already_added_count - search.images.count(), 0),
                    'search': search_serializer.data,
                    'images': response_images,
                    'page': req_page,
                    'perpage': req_perpage,
                    'cursor': (req_page - 1) * req_perpage,
                })
            else:
                import ipdb; ipdb.set_trace()
                if flickr_page < flickr_pages:
                    return make_search_query(request, flickr_page=flickr_page + 1)
                else:
                    return Response({
                        'total': flickr_total,
                        'left': 0,
                        'search': search_serializer.data,
                        'images': [],
                        'page': req_page,
                        'perpage': req_perpage,
                    }, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST' or request.method == 'PUT':

        if json is not None:
            results = json['photos']
            flickr_pages = int(results['pages'])
            flickr_page = int(results['page'])
            flickr_total = int(results['total'])
            photos_results = results['photo']

        images_data = request.data.get('images', None)
        if images_data is None:
            return Response({'message': _('Some images are required')}, status=status.HTTP_400_BAD_REQUEST)

        (search, created) = Search.objects.get_or_create(
            tags=request.data.get('tags'), defaults=request.data)
        search_serializer = SearchSerializer(search)

        for image_data in images_data:
            (image, created) = Image.objects.get_or_create(**image_data)
            # import ipdb; ipdb.set_trace()
            if image not in search.images.all():
                search.images.add(image)
        search.save()

        # query = make_search_query(request)
        # import ipdb; ipdb.set_trace()
        return Response({
            'total': flickr_total,
            'left': max(flickr_total - search.images.count(), 0),
            'search': search_serializer.data,
            'images': [],
            'page': req_page,
            'perpage': req_perpage,
            'cursor': (req_page - 1) * req_perpage,
        })

    return Response({'message': _('GET, POST or PUT required.')}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


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
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('tags',)
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        queryset = Search.objects.all()
        query = self.request.query_params.get('q', None)
        if query is not None:
            queryset = queryset.filter(tags__icontains=query)
        return queryset



class ImageViewSet(viewsets.ModelViewSet):

    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('state', 'license')
    pagination_class = LargeResultsSetPagination

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

