# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-13 15:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_flickrsearch_flickr_image_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flickrsearch',
            name='flickr_image_id',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
