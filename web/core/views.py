from django.shortcuts import render
from django.http import JsonResponse
from .models import FlickrSearch
from .forms import FlickrSearchForm


def save_flickr_search(self, request):
    if request.method == request.POST:
        instance = FlickrSearch(
            flickr_image_id=request.POST.get('flickr_image_id', None))
        form = FlickrSearchForm(request.POST, instance=instance)
        form.save()
        import pdb; pdb.set_trace()
        # data = {
        #     'is_taken': User.objects.filter(username__iexact=username).exists()
        # }
        # if data['is_taken']:
        #     data['error_message'] = 'A user with this username already exists.'
        return JsonResponse(form.json_dumps_params())
