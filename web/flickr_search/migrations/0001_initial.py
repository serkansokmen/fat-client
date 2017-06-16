# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-16 11:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FlickrImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', sorl.thumbnail.fields.ImageField(blank=True, null=True, upload_to='flickr_images')),
                ('flickr_image_id', models.CharField(max_length=255)),
                ('flickr_image_url', models.URLField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at', '-updated_at'],
                'verbose_name': 'Flickr image',
                'get_latest_by': 'updated_at',
                'verbose_name_plural': 'Flickr images',
            },
        ),
        migrations.CreateModel(
            name='FlickrSearch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(max_length=255)),
                ('exclude', models.CharField(default='', max_length=255)),
                ('tag_mode', models.CharField(choices=[('all', 'AND'), ('any', 'OR')], default=('all', 'AND'), max_length=3)),
                ('user_id', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at', '-updated_at'],
                'verbose_name': 'Flickr search',
                'get_latest_by': 'updated_at',
                'verbose_name_plural': 'Flickr searches',
            },
        ),
        migrations.CreateModel(
            name='FlickrSearchImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=False)),
                ('is_processed', models.BooleanField(default=False)),
                ('is_discarded', models.BooleanField(default=False)),
                ('image', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flickr_search.FlickrImage')),
                ('search', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flickr_search.FlickrSearch')),
            ],
        ),
        migrations.AddField(
            model_name='flickrsearch',
            name='images',
            field=models.ManyToManyField(through='flickr_search.FlickrSearchImage', to='flickr_search.FlickrImage'),
        ),
    ]