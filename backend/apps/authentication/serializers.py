from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def validate_email(self, value):
        # Normalize email (lowercase and strip whitespace)
        normalized_email = value.lower().strip()
        
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("Email already exists")
        
        # Basic email format validation (additional to EmailField)
        if len(normalized_email) > 254:
            raise serializers.ValidationError("Email address is too long")
        
        return normalized_email
    
    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
