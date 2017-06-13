from .models import FlickrSearch
from .serializers import FlickrSearchSerializer
from rest_framework import viewsets, permissions, parsers


class FlickrSearchViewSet(viewsets.ModelViewSet):

    serializer_class = FlickrSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.FileUploadParser,]
    queryset = FlickrSearch.objects.filter(is_approved=False)
