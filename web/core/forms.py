from django import forms
from .models import FlickrSearch


class FlickrSearchForm(forms.ModelForm):

    class Meta:
        model = FlickrSearch
        fields = '__all__'
