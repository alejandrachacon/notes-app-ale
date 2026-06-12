from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'color', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at','category')
    search_fields = ('title','category', 'content', 'user__email')
    readonly_fields = ('id', 'created_at', 'updated_at')
    ordering = ('-created_at',)
