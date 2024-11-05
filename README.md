# eStudy
eStudy is an online course management platform designed to help students and lecturers manage courses, upload files, and rate course quality. Initially developed as a university project, the platform has been expanded to include additional features and services.

## Features
- Authentication, with different roles
- Course, course material management
- Lecturer and course rating
- File upload and management
- Offensive content filtering in comments
- Data migration between MYSQL and MONGODB databases

## Technologies
- Backend: Java (Spring Boot), MySQL, Docker
- Frontend: TypeScript, React, ShadCN, Docker
- Microservices: Golang, Python, C# (.NET), MongoDB, Docker, Minio

## Installation
- Clone the repository:

```
git clone https://github.com/fijizxli/estudy
cd estudy
```
- Configure environment variables in compose.yml
- Build and start the services using Docker Compose:

```
docker compose up --build
```

## Components

### estudy-backend
The backend of the course management platform.

- **Tech Stack**: Java + Spring, MySQL, Docker
- **Main Features**: Course and user management, API integration for frontend, Dockerized setup.

### estudy-frontend
The frontend of the course management platform.

- **Tech Stack**: TypeScript + React, ShadCN, Docker
- **Main Features**: User-friendly interface for course management, responsive UI components.

### estudyRatings
A platform for rating lecturers and courses.

- **Tech Stack**: C# + .NET (Blazor), MongoDB, Docker
- **Main Features**: Lecturer/course rating system, data persistence in MongoDB.

### datasyncgo
A microservice for migrating data from MySQL (used in the main estudy backend) to MongoDB (used in estudyRatings).

- **Tech Stack**: Golang + Gin, MongoDB, Docker
- **Main Features**: Lecturer/course rating system, data persistence in MongoDB.

### offensive-checker
A microservice that checks (before posting) whether a comment on estudyRatings is offensive or not using text classification models.

- **Tech Stack**: Python + FastAPI, Transformers, Docker

### fileupload-api
A microservice to handle file uploads with Minio object storage and store metadata in SQLite.

- **Tech Stack**: Golang + Gin, SQLite, Minio, Docker
