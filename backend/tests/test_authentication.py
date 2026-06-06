import pytest
import json
from django.urls import reverse
from django.test import Client
from rest_framework import status
from apps.authentication.models import User


@pytest.fixture
def api_client():
    return Client()


@pytest.fixture
def test_user_data():
    return {
        'email': 'test@example.com',
        'password': 'SecurePass123!'
    }


@pytest.fixture
def create_user(db, test_user_data):
    return User.objects.create_user(**test_user_data)


@pytest.mark.django_db
class TestUserRegistration:
    def test_successful_registration(self, api_client):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'password': 'SecurePass123!'
        }
        response = api_client.post(url, json.dumps(data), content_type='application/json')
        
        assert response.status_code == status.HTTP_201_CREATED
        response_data = json.loads(response.content)
        assert 'access' in response_data
        assert 'refresh' in response_data
        assert 'user' in response_data
        assert response_data['user']['email'] == data['email']
        assert User.objects.filter(email=data['email']).exists()
    
    def test_registration_with_existing_email(self, api_client, create_user):
        url = reverse('register')
        data = {
            'email': 'test@example.com',
            'password': 'SecurePass123!'
        }
        response = api_client.post(url, json.dumps(data), content_type='application/json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in json.loads(response.content)
    
    def test_registration_with_weak_password(self, api_client):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'password': '123'
        }
        response = api_client.post(url, json.dumps(data), content_type='application/json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in json.loads(response.content)
    
    def test_registration_with_missing_email(self, api_client):
        url = reverse('register')
        data = {
            'password': 'SecurePass123!'
        }
        response = api_client.post(url, json.dumps(data), content_type='application/json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in json.loads(response.content)


@pytest.mark.django_db
class TestUserLogin:
    def test_successful_login(self, api_client, create_user, test_user_data):
        url = reverse('login')
        response = api_client.post(url, json.dumps(test_user_data), content_type='application/json')
        
        assert response.status_code == status.HTTP_200_OK
        response_data = json.loads(response.content)
        assert 'access' in response_data
        assert 'refresh' in response_data
        assert 'user' in response_data
        assert response_data['user']['email'] == test_user_data['email']
    
    def test_login_with_incorrect_password(self, api_client, create_user):
        url = reverse('login')
        data = {
            'email': 'test@example.com',
            'password': 'WrongPassword123!'
        }
        response = api_client.post(url, json.dumps(data), content_type='application/json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in json.loads(response.content)
    
    def test_login_with_nonexistent_email(self, api_client):
        url = reverse('login')
        data = {
            'email': 'nonexistent@example.com',
            'password': 'SecurePass123!'
        }
        response = api_client.post(url, json.dumps(data), content_type='application/json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in json.loads(response.content)
    
    def test_login_with_missing_credentials(self, api_client):
        url = reverse('login')
        data = {'email': 'test@example.com'}
        response = api_client.post(url, json.dumps(data), content_type='application/json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestTokenRefresh:
    def test_successful_token_refresh(self, api_client, create_user, test_user_data):
        login_url = reverse('login')
        login_response = api_client.post(login_url, json.dumps(test_user_data), content_type='application/json')
        refresh_token = json.loads(login_response.content)['refresh']
        
        refresh_url = reverse('token_refresh')
        response = api_client.post(refresh_url, json.dumps({'refresh': refresh_token}), content_type='application/json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in json.loads(response.content)
    
    def test_refresh_with_invalid_token(self, api_client):
        url = reverse('token_refresh')
        response = api_client.post(url, json.dumps({'refresh': 'invalid_token'}), content_type='application/json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
