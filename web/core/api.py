from .models import FlickrSearch
from .serializers import FlickrSearchSerializer
from rest_framework import viewsets, permissions


class FlickrSearchViewSet(viewsets.ModelViewSet):

    queryset = FlickrSearch.objects.all()
    serializer_class = FlickrSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
