from django.db import models
from django.utils.translation import ugettext as _
from django.db.models.signals import post_save, pre_delete
from django.dispatch.dispatcher import receiver
from sorl.thumbnail import ImageField


class FlickrImage(models.Model):

    image = ImageField(upload_to='flickr_images', blank=True, null=True)
    flickr_image_id = models.CharField(max_length=255)
    flickr_image_url = models.URLField()
    is_approved = models.BooleanField(default=False)
    is_processed = models.BooleanField(default=False)
    is_discarded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)

    class Meta:
        verbose_name = _('Flickr image')
        verbose_name_plural = _('Flickr images')
        get_latest_by = 'updated_at'
        ordering = ['-created_at', '-updated_at', ]

    def __str__(self):
        return '{}'.format(self.flickr_image_url)


@receiver(pre_delete, sender=FlickrImage)
def pre_delete_flickr_image(sender, instance, **kwargs):
    for search in instance.flickr_searches.all():
        if search.images.count() == 1 and instance in search.images.all():
            search.delete()


class FlickrSearch(models.Model):

    TAG_MODES = (
        ('all', 'AND'),
        ('any', 'OR'),
    )

    query = models.CharField(max_length=255)
    exclude = models.CharField(max_length=255, default='')
    tag_mode = models.CharField(max_length=3, choices=TAG_MODES, default=TAG_MODES[0])
    user_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    images = models.ManyToManyField(
        FlickrImage, related_name='flickr_searches')

    class Meta:
        verbose_name = _('Flickr search')
        verbose_name_plural = _('Flickr searches')
        get_latest_by = 'updated_at'
        ordering = ['-created_at', '-updated_at', ]

    def __str__(self):
        return '{}'.format(self.query)

# @receiver(pre_delete, sender=FlickrImage)
# def flickr_image_delete(sender, instance, **kwargs):
#     # Pass false so ModelField doesn't save the model.
#     instance.image.delete(False)
