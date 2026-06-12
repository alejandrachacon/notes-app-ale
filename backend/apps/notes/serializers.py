from rest_framework import serializers
from .models import Note
import bleach


# Predefined categories with their associated colors
CATEGORY_COLORS = {
    'Random Thoughts': '#EF9C66',  # Orange/Peach
    'School': '#FFE5A3',            # Yellow
    'Personal': '#B8E0D2',          # Teal/Mint
}


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'title','category', 'color', 'content', 'created_at', 'updated_at')
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
    
    def validate_category(self, value):
        """Validate category is one of the predefined options"""
        if value and value not in CATEGORY_COLORS:
            valid_categories = ', '.join(CATEGORY_COLORS.keys())
            raise serializers.ValidationError(
                f"Invalid category. Must be one of: {valid_categories}"
            )
        return value
    
    def validate(self, data):
        """Validate that color matches the category"""
        category = data.get('category')
        color = data.get('color')
        
        # If category is provided, auto-assign the correct color
        if category and category in CATEGORY_COLORS:
            data['color'] = CATEGORY_COLORS[category]
        
        # If color is provided but doesn't match category, override with correct color
        if category and color and color != CATEGORY_COLORS.get(category):
            data['color'] = CATEGORY_COLORS[category]
        
        return data
