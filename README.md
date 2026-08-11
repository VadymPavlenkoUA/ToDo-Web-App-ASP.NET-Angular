# ToDo Web Application
### C#/.NET, ASP.NET Core, Entity Framework, MS SQL Server, REST API, Angular, TypeScript, Bootstrap, HTML/CSS
*(4-layer architecture, Dependency Injection, JWT Authentication, Repository Pattern, DTOs)*

This is a full-stack task management application which allows users to manage personal tasks, organize them into categories, search and filter tasks, and securely authenticate using JWT.

## Key Features
* User Authentication
  * User registration and login
  * JWT-based authentication
  * Protected API endpoints
  * Password hashing with ASP.NET Core Identity
* Task Management
  * Create, view, edit and delete tasks
  * Mark tasks as completed
  * Set task descriptions and due dates
  * Assign tasks to categories
  * Visual indication of completed and overdue tasks
* Categories
  * Create, edit and delete categories
  * Assign tasks to categories
  * Filter tasks by category
* Task Search & Filtering
  * Search tasks by title
  * Filter tasks by category
  * Debounced search requests
* Pagination
  * Configurable number of tasks per page
  * Previous/next navigation
  * First/last page navigation
  * Dynamic page number display
* Responsive Interface
  * Clean and user-friendly UI
  * Responsive design using Bootstrap
  * Loading indicators
  * Validation messages
  * Error handling
  * Toast notifications
  * Confirmation modals
* Database Integration
  * SQL Server database
  * Entity Framework Core migrations
  * Relational data model for users, tasks, and categories

## Technologies
### Backend
* C#
* ASP.NET Core Web API
* Entity Framework Core
* Microsoft SQL Server
* JWT Authentication
* REST API
* Dependency Injection

## Frontend
* Angular
* TypeScript
* HTML/CSS
* Bootstrap


## Screenshots

### Login

<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/854ae05c-fe06-44de-a44f-b50b04bca700" />

### Registration

<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/c27b2cda-324a-4df1-98f4-16366df343c0" />

### Tasks

<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/6cea0b00-7147-42c2-9578-203bd90d884d" />

<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/ec93fdf7-4a30-4ac4-ba25-a75422e4303f" />

### Categories

<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/6fe177a3-3652-457a-91c2-e61587d917c3" />

<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/656caf52-177b-4d11-9bf7-4a9a7f054dc4" />

*Screenshots demonstrate the main application pages and user interface*

---

## Getting Started
### Prerequisites
Make sure you have the following installed:
* [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
* [Node.js](https://nodejs.org/)
* [Angular CLI](https://angular.dev/tools/cli)
* [Microsoft SQL Server (used by the application)](https://www.microsoft.com/en-us/sql-server)

> **Note:** SQL Server Express is sufficient for running this project locally.

### 1. Clone the repository

```bash
git clone https://github.com/VadymPavlenkoUA/ToDo-Web-App-ASP.NET-Angular.git
cd <repository-root>/ToDoApp
```

### 2. Configure the database

Update the connection string in the backend configuration ***appsettings.json***:

```json
"ConnectionStrings": {
  "DefaultConnection": "your-connection-string"
}
```

Make sure your SQL Server instance is running.

### 3. Apply database migrations

Navigate to the backend project directory and run:

```bash
cd <repository-root>/ToDoApp
dotnet tool install --global dotnet-ef
dotnet ef database update --project TodoApp.DataAccess --startup-project TodoApp.API
```

This will create the required database and apply all Entity Framework Core migrations.

### 4. Run the backend

From the backend project directory, run:

```bash
cd <repository-root>/ToDoApp/ToDoApp.API
dotnet run
```

The API will start on the configured local URL.

### 5. Run the frontend

Open a new terminal and navigate to the Angular project:

```bash
cd <repository-root>/ToDoApp/TodoApp.Client
npm install
ng serve
```

The application will be available at:

```text
http://localhost:4200
```

### 6. Create an account

Open the application in your browser and register a new account.

After logging in, you can create and manage tasks and categories.

---

## API
The backend provides RESTful endpoints for authentication, tasks and categories

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks
- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

### Categories
- `GET /api/categories`
- `GET /api/categories/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
