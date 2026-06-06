"""
URL configuration for notes app project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/notes/', include('apps.notes.urls')),
    path('api/health/', include('apps.health.urls')),
]
