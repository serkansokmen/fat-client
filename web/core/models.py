from django.db import models
from django_extensions.db.fields import AutoSlugField
# from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils.translation import ugettext as _
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver
from sorl.thumbnail import ImageField
from media_field.db import MediaField


class FlickrSearch(models.Model):
    image = MediaField(blank=True, max_length=255)
    url = models.URLField(max_length=255)
    is_approved = models.BooleanField(default=False)
    is_processed = models.BooleanField(default=False)
    is_discarded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)

    class Meta:
        verbose_name = _('Flickr search')
        verbose_name_plural = _('Flickr searches')
        get_latest_by = 'updated_at'
        ordering = ['-created_at', '-updated_at',]

    def __str__(self):
        return '{}'.format(self.url)

    def save(self, *args, **kwargs):
        self.url = self.image.name
        super(FlickrSearch, self).save(*args, **kwargs)


@receiver(pre_delete, sender=FlickrSearch)
def flickr_search_delete(sender, instance, **kwargs):
    # Pass false so ModelField doesn't save the model.
    instance.image.delete(False)


# class UserManager(BaseUserManager):

#     def create_user(self, email, date_of_birth, password=None):
#         """
#         Creates and saves a User with the given email, date of
#         birth and password.
#         """
#         if not email:
#             raise ValueError('Users must have an email address')

#         user = self.model(
#             email=self.normalize_email(email),
#             date_of_birth=date_of_birth,
#         )

#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, date_of_birth, password):
#         """
#         Creates and saves a superuser with the given email, date of
#         birth and password.
#         """
#         user = self.create_user(
#             email,
#             password=password,
#             date_of_birth=date_of_birth,
#         )
#         user.is_admin = True
#         user.save(using=self._db)
#         return user


# class User(AbstractBaseUser):
#     email = models.EmailField(verbose_name=_(
#         'email address'), max_length=255, unique=True)
#     date_of_birth = models.DateField()
#     is_active = models.BooleanField(default=True)
#     is_admin = models.BooleanField(default=False)

#     objects = UserManager()

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['date_of_birth', ]

#     class Meta:
#         permissions = (
#             ('can_upload_video', _('Can upload video')),
#             # ('can_create_team', _('Can create team')),
#             ('can_create_shop', _('Can create shop')),
#             ('can_create_portfolio', _('Can create portfolio')),
#             ('can_hire_artist', _('Can hire artist')),
#             ('can_invite_users', _('Can invite users')),
#         )

#     def get_full_name(self):
#         # The user is identified by their email address
#         return self.email

#     def get_short_name(self):
#         # The user is identified by their email address
#         return self.email

#     def __str__(self):
#         return self.email

#     def has_perm(self, perm, obj=None):
#         "Does the user have a specific permission?"
#         # Simplest possible answer: Yes, always
#         return True

#     def has_module_perms(self, app_label):
#         "Does the user have permissions to view the app `app_label`?"
#         # Simplest possible answer: Yes, always
#         return True

#     @property
#     def is_staff(self):
#         "Is the user a member of staff?"
#         # Simplest possible answer: All admins are staff
#         return self.is_admin

#     @property
#     def is_superuser(self):
#         "Is the user a superuser?"
#         # Simplest possible answer: All admins are superusers
#         return self.is_admin
