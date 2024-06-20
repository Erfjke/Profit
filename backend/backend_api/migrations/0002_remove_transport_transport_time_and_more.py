# Generated by Django 5.0.6 on 2024-05-31 16:29

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transport',
            name='transport_time',
        ),
        migrations.AddField(
            model_name='transport',
            name='arrival_time',
            field=models.TimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='transport',
            name='departure_time',
            field=models.TimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
