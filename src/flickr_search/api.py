from .models import FlickrSearch, FlickrImage, FlickrLicense
from .serializers import FlickrSearchSerializer, FlickrImageSerializer, FlickrLicenseSerializer
from rest_framework import viewsets, parsers


class FlickrLicenseViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = FlickrLicenseSerializer
    queryset = FlickrLicense.objects.all()


class FlickrSearchViewSet(viewsets.ModelViewSet):

    serializer_class = FlickrSearchSerializer
    queryset = FlickrSearch.objects.all()


class FlickrImageViewSet(viewsets.ModelViewSet):

    serializer_class = FlickrImageSerializer
    queryset = FlickrImage.objects.all()
    # parser_classes = [parsers.FileUploadParser,]


