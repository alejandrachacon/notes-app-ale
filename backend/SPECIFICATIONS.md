# Backend API Specifications (BDD Style)

This document contains behavior-driven development specifications for the Notes App backend API.

## User Authentication

### User Registration
```gherkin
Feature: User Registration
  As a new user
  I want to register an account
  So that I can create and manage my notes

Scenario: Successful registration with valid data
  Given I am not registered
  When I submit registration with email "user@example.com" and password "SecurePass123!"
  Then a user account is created
  And I receive a JWT access token
  And I receive a JWT refresh token
  And the response status is 201

Scenario: Registration fails with existing email
  Given a user exists with email "user@example.com"
  When I submit registration with email "user@example.com"
  Then the registration fails
  And I receive an error message "Email already exists"
  And the response status is 400

Scenario: Registration fails with weak password
  Given I am not registered
  When I submit registration with password "123"
  Then the registration fails
  And I receive an error message about password requirements
  And the response status is 400
```

### User Login
```gherkin
Feature: User Login
  As a registered user
  I want to log in to my account
  So that I can access my notes

Scenario: Successful login with valid credentials
  Given I am registered with email "user@example.com" and password "SecurePass123!"
  When I submit login credentials
  Then I receive a JWT access token
  And I receive a JWT refresh token
  And the response status is 200

Scenario: Login fails with incorrect password
  Given I am registered with email "user@example.com"
  When I submit login with incorrect password
  Then the login fails
  And I receive an error message "Invalid credentials"
  And the response status is 401

Scenario: Login fails with non-existent email
  Given no user exists with email "nonexistent@example.com"
  When I submit login with that email
  Then the login fails
  And I receive an error message "Invalid credentials"
  And the response status is 401
```

### Token Refresh
```gherkin
Feature: Token Refresh
  As an authenticated user
  I want to refresh my access token
  So that I can maintain my session

Scenario: Successfully refresh token
  Given I have a valid refresh token
  When I submit the refresh token
  Then I receive a new access token
  And the response status is 200

Scenario: Refresh fails with invalid token
  Given I have an invalid refresh token
  When I submit the refresh token
  Then the refresh fails
  And I receive an error message "Token is invalid or expired"
  And the response status is 401
```

---

## Notes Management

### Create Note
```gherkin
Feature: Create Note
  As an authenticated user
  I want to create a new note
  So that I can save my thoughts

Scenario: Successfully create note with title and content
  Given I am authenticated
  When I create a note with title "My Note" and content "Note content"
  Then the note is saved to the database
  And the note has a unique ID
  And the note is associated with my user account
  And the note has a creation timestamp
  And the response status is 201

Scenario: Create note with title only
  Given I am authenticated
  When I create a note with title "My Note" and empty content
  Then the note is saved with empty content
  And the response status is 201

Scenario: Create note fails without authentication
  Given I am not authenticated
  When I attempt to create a note
  Then the request fails
  And I receive an error message "Authentication required"
  And the response status is 401

Scenario: Create note fails with empty title
  Given I am authenticated
  When I create a note with empty title
  Then the request fails
  And I receive an error message "Title is required"
  And the response status is 400
```

### List Notes
```gherkin
Feature: List Notes
  As an authenticated user
  I want to view all my notes
  So that I can see what I've written

Scenario: Successfully retrieve all notes
  Given I am authenticated
  And I have 3 notes in the database
  When I request my notes list
  Then I receive all 3 notes
  And the notes are ordered by creation date (newest first)
  And each note includes id, title, content, created_at, updated_at
  And the response status is 200

Scenario: Retrieve empty list when no notes exist
  Given I am authenticated
  And I have no notes
  When I request my notes list
  Then I receive an empty list
  And the response status is 200

Scenario: Only see my own notes
  Given I am authenticated as user A
  And user B has 5 notes
  And I have 2 notes
  When I request my notes list
  Then I receive only my 2 notes
  And I do not see user B's notes
  And the response status is 200

Scenario: List notes fails without authentication
  Given I am not authenticated
  When I request notes list
  Then the request fails
  And the response status is 401
```

### Retrieve Single Note
```gherkin
Feature: Retrieve Single Note
  As an authenticated user
  I want to view a specific note
  So that I can read its full content

Scenario: Successfully retrieve my note
  Given I am authenticated
  And I have a note with id 123
  When I request note 123
  Then I receive the complete note details
  And the response status is 200

Scenario: Cannot retrieve another user's note
  Given I am authenticated as user A
  And user B has a note with id 456
  When I request note 456
  Then the request fails
  And I receive an error message "Not found"
  And the response status is 404

Scenario: Retrieve fails for non-existent note
  Given I am authenticated
  When I request note 999 (which doesn't exist)
  Then the request fails
  And the response status is 404
```

### Update Note
```gherkin
Feature: Update Note
  As an authenticated user
  I want to edit my notes
  So that I can modify my content

Scenario: Successfully update note title and content
  Given I am authenticated
  And I have a note with id 123
  When I update note 123 with new title "Updated" and content "New content"
  Then the note is updated in the database
  And the updated_at timestamp is refreshed
  And the response status is 200

Scenario: Update only title
  Given I am authenticated
  And I have a note with id 123 and content "Original content"
  When I update note 123 with only new title "New Title"
  Then the title is updated
  And the content remains "Original content"
  And the response status is 200

Scenario: Cannot update another user's note
  Given I am authenticated as user A
  And user B has a note with id 456
  When I attempt to update note 456
  Then the request fails
  And the response status is 404

Scenario: Update fails without authentication
  Given I am not authenticated
  When I attempt to update a note
  Then the request fails
  And the response status is 401
```

### Delete Note
```gherkin
Feature: Delete Note
  As an authenticated user
  I want to delete my notes
  So that I can remove unwanted content

Scenario: Successfully delete my note
  Given I am authenticated
  And I have a note with id 123
  When I delete note 123
  Then the note is removed from the database
  And the response status is 204

Scenario: Cannot delete another user's note
  Given I am authenticated as user A
  And user B has a note with id 456
  When I attempt to delete note 456
  Then the request fails
  And the note is not deleted
  And the response status is 404

Scenario: Delete fails for non-existent note
  Given I am authenticated
  When I attempt to delete note 999 (which doesn't exist)
  Then the request fails
  And the response status is 404

Scenario: Delete fails without authentication
  Given I am not authenticated
  When I attempt to delete a note
  Then the request fails
  And the response status is 401
```

---

## API Endpoints Summary

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Refresh access token
- `POST /api/auth/logout/` - Logout (optional)

### Notes Endpoints
- `GET /api/notes/` - List all notes (authenticated)
- `POST /api/notes/` - Create new note (authenticated)
- `GET /api/notes/{id}/` - Retrieve single note (authenticated)
- `PUT /api/notes/{id}/` - Update note (authenticated)
- `PATCH /api/notes/{id}/` - Partial update note (authenticated)
- `DELETE /api/notes/{id}/` - Delete note (authenticated)

### Health Check
- `GET /api/health/` - Health check endpoint for deployment

---

## Data Models

### User Model
```python
{
    "id": "UUID",
    "email": "string (unique)",
    "password": "string (hashed)",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

### Note Model
```python
{
    "id": "UUID",
    "user": "ForeignKey(User)",
    "title": "string (max 200 chars, required)",
    "content": "text (optional)",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

---

## Testing Requirements

1. **Unit Tests**: Test each model, serializer, and view function
2. **Integration Tests**: Test complete API workflows
3. **Authentication Tests**: Verify JWT token handling
4. **Permission Tests**: Ensure users can only access their own notes
5. **Validation Tests**: Test input validation and error messages
6. **Edge Cases**: Test empty data, invalid IDs, concurrent updates

**Minimum Coverage**: 80%
