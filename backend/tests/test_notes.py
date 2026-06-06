import pytest
import json
from django.urls import reverse
from django.test import Client
from rest_framework import status
from apps.authentication.models import User
from apps.notes.models import Note


@pytest.fixture
def api_client():
    return Client()


@pytest.fixture
def user_a(db):
    return User.objects.create_user(email='usera@example.com', password='SecurePass123!')


@pytest.fixture
def user_b(db):
    return User.objects.create_user(email='userb@example.com', password='SecurePass123!')


@pytest.fixture
def get_token(api_client, user_a):
    """Helper to get JWT token for user_a"""
    url = reverse('login')
    data = {'email': 'usera@example.com', 'password': 'SecurePass123!'}
    response = api_client.post(url, json.dumps(data), content_type='application/json')
    return json.loads(response.content)['access']


@pytest.fixture
def authenticated_client(api_client, get_token):
    # Return tuple of (client, token) for use in tests
    return api_client, get_token


@pytest.fixture
def note_data():
    return {
        'title': 'Test Note',
        'content': 'This is test content'
    }


@pytest.fixture
def create_note(user_a):
    return Note.objects.create(
        user=user_a,
        title='Existing Note',
        content='Existing content'
    )


@pytest.mark.django_db
class TestCreateNote:
    def test_create_note_successfully(self, authenticated_client, note_data):
        client, token = authenticated_client
        url = reverse('note-list')
        response = client.post(
            url, 
            json.dumps(note_data), 
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        response_data = json.loads(response.content)
        assert response_data['title'] == note_data['title']
        assert response_data['content'] == note_data['content']
        assert 'id' in response_data
        assert 'created_at' in response_data
        assert 'updated_at' in response_data
    
    def test_create_note_with_title_only(self, authenticated_client):
        client, token = authenticated_client
        url = reverse('note-list')
        data = {'title': 'Title Only Note'}
        response = client.post(
            url, 
            json.dumps(data), 
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        response_data = json.loads(response.content)
        assert response_data['title'] == data['title']
        assert response_data['content'] == ''
    
    def test_create_note_without_authentication(self, api_client, note_data):
        url = reverse('note-list')
        response = api_client.post(url, json.dumps(note_data), content_type='application/json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_note_with_empty_title(self, authenticated_client):
        client, token = authenticated_client
        url = reverse('note-list')
        data = {'title': '', 'content': 'Some content'}
        response = client.post(
            url, 
            json.dumps(data), 
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'title' in json.loads(response.content)
    
    def test_create_note_without_title(self, authenticated_client):
        client, token = authenticated_client
        url = reverse('note-list')
        data = {'content': 'Some content'}
        response = client.post(
            url, 
            json.dumps(data), 
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestListNotes:
    def test_list_all_user_notes(self, authenticated_client, user_a):
        client, token = authenticated_client
        Note.objects.create(user=user_a, title='Note 1', content='Content 1')
        Note.objects.create(user=user_a, title='Note 2', content='Content 2')
        Note.objects.create(user=user_a, title='Note 3', content='Content 3')
        
        url = reverse('note-list')
        response = client.get(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(json.loads(response.content)) == 3
    
    def test_list_empty_notes(self, authenticated_client):
        client, token = authenticated_client
        url = reverse('note-list')
        response = client.get(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(json.loads(response.content)) == 0
    
    def test_only_see_own_notes(self, authenticated_client, user_a, user_b):
        client, token = authenticated_client
        Note.objects.create(user=user_a, title='User A Note 1')
        Note.objects.create(user=user_a, title='User A Note 2')
        Note.objects.create(user=user_b, title='User B Note 1')
        Note.objects.create(user=user_b, title='User B Note 2')
        Note.objects.create(user=user_b, title='User B Note 3')
        
        url = reverse('note-list')
        response = client.get(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_200_OK
        response_data = json.loads(response.content)
        assert len(response_data) == 2
        for note in response_data:
            assert 'User A' in note['title']
    
    def test_list_notes_without_authentication(self, api_client):
        url = reverse('note-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestRetrieveNote:
    def test_retrieve_own_note(self, authenticated_client, user_a):
        client, token = authenticated_client
        note = Note.objects.create(user=user_a, title='My Note', content='My Content')
        url = reverse('note-detail', kwargs={'pk': note.id})
        response = client.get(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_200_OK
        response_data = json.loads(response.content)
        assert response_data['id'] == str(note.id)
        assert response_data['title'] == note.title
    
    def test_cannot_retrieve_other_user_note(self, authenticated_client, user_b):
        client, token = authenticated_client
        note = Note.objects.create(user=user_b, title='User B Note')
        url = reverse('note-detail', kwargs={'pk': note.id})
        response = client.get(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_retrieve_nonexistent_note(self, authenticated_client):
        client, token = authenticated_client
        url = reverse('note-detail', kwargs={'pk': '00000000-0000-0000-0000-000000000000'})
        response = client.get(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestUpdateNote:
    def test_update_note_successfully(self, authenticated_client, create_note):
        client, token = authenticated_client
        url = reverse('note-detail', kwargs={'pk': create_note.id})
        data = {'title': 'Updated Title', 'content': 'Updated Content'}
        response = client.put(
            url, 
            json.dumps(data), 
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        assert response.status_code == status.HTTP_200_OK
        response_data = json.loads(response.content)
        assert response_data['title'] == data['title']
        assert response_data['content'] == data['content']
        
        create_note.refresh_from_db()
        assert create_note.title == data['title']
        assert create_note.content == data['content']
    
    def test_partial_update_title_only(self, authenticated_client, create_note):
        client, token = authenticated_client
        original_content = create_note.content
        url = reverse('note-detail', kwargs={'pk': create_note.id})
        data = {'title': 'New Title Only'}
        response = client.patch(
            url, 
            json.dumps(data), 
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        assert response.status_code == status.HTTP_200_OK
        response_data = json.loads(response.content)
        assert response_data['title'] == data['title']
        assert response_data['content'] == original_content
    
    def test_cannot_update_other_user_note(self, authenticated_client, user_b):
        client, token = authenticated_client
        note = Note.objects.create(user=user_b, title='User B Note')
        url = reverse('note-detail', kwargs={'pk': note.id})
        data = {'title': 'Hacked Title'}
        response = client.put(
            url, 
            json.dumps(data), 
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        
        note.refresh_from_db()
        assert note.title == 'User B Note'
    
    def test_update_without_authentication(self, api_client, create_note):
        url = reverse('note-detail', kwargs={'pk': create_note.id})
        data = {'title': 'Updated Title'}
        response = api_client.put(url, json.dumps(data), content_type='application/json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestDeleteNote:
    def test_delete_own_note(self, authenticated_client, create_note):
        client, token = authenticated_client
        note_id = create_note.id
        url = reverse('note-detail', kwargs={'pk': note_id})
        response = client.delete(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Note.objects.filter(id=note_id).exists()
    
    def test_cannot_delete_other_user_note(self, authenticated_client, user_b):
        client, token = authenticated_client
        note = Note.objects.create(user=user_b, title='User B Note')
        url = reverse('note-detail', kwargs={'pk': note.id})
        response = client.delete(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Note.objects.filter(id=note.id).exists()
    
    def test_delete_nonexistent_note(self, authenticated_client):
        client, token = authenticated_client
        url = reverse('note-detail', kwargs={'pk': '00000000-0000-0000-0000-000000000000'})
        response = client.delete(url, HTTP_AUTHORIZATION=f'Bearer {token}')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_without_authentication(self, api_client, create_note):
        url = reverse('note-detail', kwargs={'pk': create_note.id})
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
