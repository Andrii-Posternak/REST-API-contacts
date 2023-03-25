# REST-API-phonebook

This REST API can be used to manage the phone book.

## Created with

:white_check_mark: Node.js  
:white_check_mark: Mongo DB  
:white_check_mark: Express

## Usage

This REST API uses these endpoints:

- **POST** `/api/auth/register` - create a new user
- **POST** `/api/auth/login` - log in in the application
- **GET** `/api/auth/logout` - log out from the application
- **GET** `/api/auth/current` - get information about the current user

- **GET** `/api/contacts` - get all user contacts
- **POST** `/api/contacts` - create a new contact
- **DELETE** `/api/contacts:contactId` - delete contact
- **PUT** `/api/contacts:contactId` - update an existing contact

### Create a new user

**Request:**  
Content-Type: application/json  
Request body:

```
{
    "name": "example name",
    "email": "example@example.com",
    "password": "example password"
}
```

**Response:**  
Status: 201 Created  
Response body:

```
{
    "user": {
        "name": "example name",
        "email": "example@example.com"
    }
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "error message"
}`

Status: 409 Conflict  
Response body:
`{
    "message": "Email in use"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Log in in the application

**Request:**  
Content-Type: application/json  
Request body:

```
{
    "email": "example@example.com",
    "password": "example password"
}
```

**Response:**  
Status: 200 OK  
Response body:

```
{
    "token": "example token",
    "user": {
        "name": "example name",
        "email": "example@example.com"
    }
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "error message"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Email or password is wrong"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Log out from the application

**Request:**  
Headers - Authorization: "Bearer {Token}"

**Response:**  
Status: 204 No Content

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Get information about the current user

**Request:**  
Headers - Authorization: "Bearer {Token}"

**Response:**  
Status: 200 OK  
Response body:

```
{
    "name": "example name",
    "email": "example@example.com"
}
```

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Get all user contacts

**Request:**  
Headers - Authorization: "Bearer {Token}"

**Response:**  
Status: 200 OK  
Response body:

```
[
    {
        "_id": "example contact id"
        "name": "example name",
        "number": "example number"
        "owner": {
            "_id": "641c6b08090d5d316b23594a",
            "name": "Annie Copeland",
            "email": "example@example.com"
        }
    }
]
```

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Create a new contact

**Request:**  
Content-Type: application/json  
Headers - Authorization: "Bearer {Token}"  
Request body:

```
{
    "name": "example name",
    "number": "example number"
}
```

**Response:**  
Status: 201 Created  
Response body:

```
{
    "_id": "example contact id",
    "name": "example name",
    "number": "example number",
    "owner": {
        "_id": "641c6b08090d5d316b23594a",
        "name": "Annie Copeland",
        "email": "example@example.com"
    }
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "Missing required name field"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Delete contact

**Request:**  
Headers - Authorization: "Bearer {Token}"  
Path params - contactId

**Response:**  
Status: 200 OK  
Response body:
`{
    "message": "Contact deleted"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 404 Not found  
Response body:
`{
    "message": "Not found"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Update an existing contact

**Request:**  
Content-Type: application/json  
Headers - Authorization: "Bearer {Token}"  
Path params - contactId  
Request body:

```
{
    "name": "example name",
    "number": "example number"
}
```

**Response:**  
Status: 200 OK  
Response body:

```
{
    "_id": "example contact id",
    "name": "example name",
    "number": "example number",
    "owner": {
        "_id": "641c6b08090d5d316b23594a",
        "name": "Annie Copeland",
        "email": "example@example.com"
    }
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "Missing required name field"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 404 Not found  
Response body:
`{
    "message": "Not found"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`
