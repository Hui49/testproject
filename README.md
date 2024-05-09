# Application Management API

The Application Management API provides endpoints for managing job applications.

## Upload Application

Uploads a new application file.

### Request

- **URL:** `/application/upload`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer [Access Token]` (required for admin)
- **Request Body:**
  - `file` (file) - The application file to upload.

### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "File uploaded successfully",
    "application_content": { ... }
  }
  ```
example of application_content 
```json
{
  "message": "File uploaded successfully",
  "application_content": {
    "id": "unique-id-here",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "123-456-7890",
    "address": "123 Main Street, City, Country",
    "skills": ["JavaScript", "Node.js", "React"],
    "educations": [
      {
        "degree_name": "Bachelor of Science",
        "university_name": "University of Example",
        "graduation_year": "2022"
      },
      {
        "degree_name": "Master of Engineering",
        "university_name": "Another University",
        "graduation_year": "2024"
      }
    ],
    "profession_experiences": [
      {
        "start_time": "2020-01-01",
        "end_time": "2021-12-31",
        "job_title": "Software Engineer",
        "company": "Tech Company XYZ",
        "job_summary": "Worked on web development projects using React and Node.js."
      },
      {
        "start_time": "2022-01-01",
        "end_time": "2023-12-31",
        "job_title": "Senior Developer",
        "company": "Software Solutions Inc.",
        "job_summary": "Led a team of developers in building enterprise software applications."
      }
    ],
    "state": "New"
  }
}
```
### Error Responses
- **Status Code**: 400 Bad Request
- **Description**: Invalid file provided.
##  Get All Applications
Retrieves all applications.

### Request
- **URL:** /application/all
- **Method:** GET
- **Headers:**
- `Authorization: Bearer [Access Token] (required for admin)`
### Response
- **Status Code:** 200 OK
- **Body:** Array of application objects.
- **Description:** Retrieves all applications.

## Search Applications
Searches for applications based on various criteria.

### Request
- **URL:** /application/search
- **Method:** GET
- **Headers:**
- `Authorization: Bearer [Access Token] (required for admin)`
- `Query Parameters:`
  - **fullName (string, optional)** - Full name of the applicant.
  - **address (string, optional)** - Address of the applicant.
  - **phoneNumber (string, optional)** - Phone number of the applicant.
  - **email (string, optional)** - Email address of the applicant.
  - **skills (string, optional)** - Skills possessed by the applicant.
### Response
- **Status Code:** 200 OK
- **Body:** Array of application objects.


## Get Application by ID
Retrieves a specific application by its ID.

### Request
- **URL:** /application/:id
- **Method:** GET
- **Headers:**
- `Authorization: Bearer [Access Token] (required for admin)`
- **Path Parameters:**
  id (string) - The ID of the application to retrieve.
### Response
- **Status Code:** 200 OK
- **Body:** The application object with the specified ID.

## Update Application
Updates an existing application.

### Request
- **URL:** /application/:id
- **Method:** PUT
- **Headers:**
- `Authorization: Bearer [Access Token] (required for admin)`
- **Path Parameters:**
  id (string) - The ID of the application to update.
- **Request Body**: UpdateApplicationDto (refer to DTO definition)
### Response
- **Status Code:** 200 OK
- **Body:** The updated application object.


## Update Application State
Updates the state of an existing application.

### Request
- **URL:** /application/:id/state
- **Method:** PUT
- **Headers:**
- `Authorization: Bearer [Access Token] (required for admin)`
- **Path Parameters:**
  id (string) - The ID of the application to update.
- **Request Body**: UpdateStateDto (refer to DTO definition)
### Response
- **Status Code:** 200 OK
- **Body:** The updated application object with the new state.
