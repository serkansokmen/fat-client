# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-22 13:51
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FlickrImage',
            fields=[
                ('state', models.IntegerField(blank=True, choices=[(0, 'Discarded'), (1, 'Approved'), (2, 'Processed')], null=True)),
                ('flickr_id', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('image', sorl.thumbnail.fields.ImageField(blank=True, null=True, upload_to='flickr_images')),
                ('owner', models.CharField(max_length=255)),
                ('secret', models.CharField(max_length=255, unique=True)),
                ('server', models.CharField(max_length=255)),
                ('farm', models.IntegerField()),
                ('license', models.IntegerField(blank=True, choices=[(0, 'All Rights Reserved'), (1, 'Attribution-NonCommercial-ShareAlike'), (2, 'Attribution-NonCommercial'), (3, 'Attribution-NonCommercial-NoDerivs'), (4, 'Attribution'), (5, 'Attribution-ShareAlike'), (6, 'Attribution-NoDerivs'), (7, 'No known copyright restrictions'), (8, 'United States Government Work')], null=True)),
                ('tags', models.CharField(blank=True, max_length=255, null=True)),
                ('ispublic', models.NullBooleanField()),
                ('isfriend', models.NullBooleanField()),
                ('isfamily', models.NullBooleanField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Flickr image',
                'verbose_name_plural': 'Flickr images',
                'ordering': ['-created_at', '-updated_at'],
                'get_latest_by': 'updated_at',
            },
        ),
        migrations.CreateModel(
            name='FlickrSearch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(max_length=255)),
                ('slug', django_extensions.db.fields.AutoSlugField(blank=True, editable=False, populate_from='query')),
                ('exclude', models.CharField(blank=True, max_length=255, null=True)),
                ('tag_mode', models.CharField(choices=[('all', 'AND'), ('any', 'OR')], default=('all', 'AND'), max_length=3)),
                ('user_id', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('images', models.ManyToManyField(related_name='search', to='flickr_search.FlickrImage')),
            ],
            options={
                'verbose_name': 'Flickr search',
                'verbose_name_plural': 'Flickr searches',
                'ordering': ['-created_at', '-updated_at'],
                'get_latest_by': 'updated_at',
            },
        ),
        migrations.CreateModel(
            name='FlickrSearchImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flickr_search.FlickrImage')),
                ('search', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flickr_search.FlickrSearch')),
            ],
        ),
    ]
