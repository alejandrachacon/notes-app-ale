from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.conf import settings
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from .models import User


# Conditional rate limiting - disabled during tests
def conditional_ratelimit(key='ip', rate='5/m', method='POST'):
    """Apply rate limiting only when not testing"""
    def decorator(view_class):
        if not getattr(settings, 'TESTING', False):
            return method_decorator(ratelimit(key=key, rate=rate, method=method), name='dispatch')(view_class)
        return view_class
    return decorator


@conditional_ratelimit(key='ip', rate='3/h', method='POST')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@conditional_ratelimit(key='ip', rate='5/15m', method='POST')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'user': UserSerializer(user).data,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'error': 'Token is invalid or expired'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'An error occurred during logout'}, status=status.HTTP_400_BAD_REQUEST)
