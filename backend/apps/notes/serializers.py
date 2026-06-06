from rest_framework import serializers
from .models import Note
import bleach


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'title', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def validate_title(self, value):
        """Validate and sanitize note title"""
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        
        # Limit title length
        if len(value) > 200:
            raise serializers.ValidationError("Title must be 200 characters or less")
        
        # Sanitize HTML/JavaScript
        sanitized = bleach.clean(value, tags=[], strip=True)
        return sanitized.strip()
    
    def validate_content(self, value):
        """Validate and sanitize note content"""
        # Allow empty content
        if value is None:
            return ""
        
        # Limit content length
        if len(value) > 10000:
            raise serializers.ValidationError("Content must be 10,000 characters or less")
        
        # Sanitize but allow basic formatting
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li']
        sanitized = bleach.clean(
            value,
            tags=allowed_tags,
            strip=True
        )
        return sanitized
