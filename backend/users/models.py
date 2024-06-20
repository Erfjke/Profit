from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = models.CharField(max_length=255,unique=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    is_blocked = models.BooleanField(default=False)  # Поле для блокировки пользователя
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    is_blocked = models.BooleanField(default=False)
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return self.username