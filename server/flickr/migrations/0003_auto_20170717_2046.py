# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-17 20:46
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('flickr', '0002_auto_20170717_2045'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='annotation',
            new_name='annotated_image',
        ),
    ]