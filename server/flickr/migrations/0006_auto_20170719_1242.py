# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-19 12:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flickr', '0005_auto_20170717_2220'),
    ]

    operations = [
        migrations.AlterField(
            model_name='search',
            name='tags',
            field=models.TextField(max_length=2048, unique=True),
        ),
    ]
