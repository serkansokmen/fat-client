from .models import FlickrSearch
from .serializers import FlickrSearchSerializer
from rest_framework import viewsets, parsers


class FlickrSearchViewSet(viewsets.ModelViewSet):

    serializer_class = FlickrSearchSerializer
    parser_classes = [parsers.FileUploadParser,]
    queryset = FlickrSearch.objects.all()
