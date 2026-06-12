from email.policy import default
import uuid
from django.db import models
from django.conf import settings


class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=200, default='general')
    color = models.CharField(max_length=200, default='#FFFFFF')
    content = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notes'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
