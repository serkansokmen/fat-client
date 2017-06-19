from .models import FlickrSearch, FlickrImage
from .serializers import FlickrSearchSerializer, FlickrImageSerializer
from rest_framework import viewsets, parsers


class FlickrSearchViewSet(viewsets.ModelViewSet):

    serializer_class = FlickrSearchSerializer
    queryset = FlickrSearch.objects.all()


class FlickrImageViewSet(viewsets.ModelViewSet):

    serializer_class = FlickrImageSerializer
    queryset = FlickrImage.objects.all()
    # parser_classes = [parsers.FileUploadParser,]


