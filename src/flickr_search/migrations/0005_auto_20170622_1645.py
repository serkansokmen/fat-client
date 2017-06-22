# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-22 16:45
from __future__ import unicode_literals

from django.db import migrations
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('flickr_search', '0004_auto_20170622_1629'),
    ]

    operations = [
        migrations.RenameField(
            model_name='flickrsearch',
            old_name='query',
            new_name='tags',
        ),
        migrations.RemoveField(
            model_name='flickrsearch',
            name='exclude',
        ),
        migrations.AlterField(
            model_name='flickrsearch',
            name='slug',
            field=django_extensions.db.fields.AutoSlugField(blank=True, editable=False, populate_from='tags'),
        ),
    ]
