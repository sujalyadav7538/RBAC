"Student and Faculty Authentication System"

    1.Description
        This is a backend authentication system for managing Student and Faculty user roles with role-based access control (RBAC).
        The application utilizes Node.js, Express.js, MongoDB, and JWT to handle user registration, login, and access to protected routes based on user roles (e.g., admin, student, faculty).

    2.Features
        .User Registration: Students and Faculty can register using their details (e.g., first name, last name, email, password).
        .Login: Users can log in with their email and password to receive a JWT token.
        .Role-based Access Control: Protect routes and allow access based on user roles (e.g., admin, student).
        .Password Hashing: Passwords are securely hashed before being stored in the database using bcrypt.
        .JWT Authentication: Use of JWT tokens for user authentication and authorization via cookies.
        .Error Handling: Graceful error handling using try-catch blocks.

    3.Technologies Used
        .Node.js: JavaScript runtime for building the backend server.
        .Express.js: Web framework for Node.js to handle routing and middleware.
        .MongoDB: NoSQL database for storing user and role data.
        .Mongoose: ORM for MongoDB to interact with the database using models and schemas.
        .JWT: JSON Web Tokens for handling user authentication and authorization.
        .bcryptjs: For hashing passwords to enhance security.
        .dotenv: For managing environment variables.
        .Setup Instructions
    

    4.API Endpoints
        1. POST /signup (Student) [http://localhost:3000/student/signup]
            URL: /signup
            Method: POST
            Description: Registers a new student. Returns a user object (excluding password) and JWT tokens for authentication.
            Request body:
            
            
            {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john.doe@example.com",
                "password": "password123",
                "course": "Computer Science",
                "student": true,
                "rollNo": "12345",
                "role": "student"
            }


            Response:
            
            
            {
                "user": {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "john.doe@example.com",
                    "course": "Computer Science",
                    "rollNo": "12345",
                    "role": "student"
                },
                "status": true
            }


        2. POST /signup (Faculty) [http://localhost:3000/faculty/signup]
            URL: /signup
            Method: POST
            Description: Registers a new faculty member. Returns a user object (excluding password) and JWT tokens for authentication.
            Request body:
            

            {
                "firstName": "Dr. Alice",
                "lastName": "Smith",
                "email": "alice.smith@example.com",
                "password": "password123",
                "teacherId": "F123",
                "department": "Computer Science",
                "role": "faculty"
            }

            Response:
            
            {
                "user": {
                    "firstName": "Dr. Alice",
                    "lastName": "Smith",
                    "email": "alice.smith@example.com",
                    "teacherId": "F123",
                    "department": "Computer Science",
                    "role": "faculty"
                },
                "status": true
            }

        3. POST /login (Student) [http://localhost:3000/student/login]
            URL: /login
            Method: POST
            Description: Logs in a student and returns JWT tokens.
            Request body:
            
            {
                "email": "john.doe@example.com",
                "password": "password123"
            }

            Response:
            
            {
                "user": {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "john.doe@example.com",
                    "course": "Computer Science",
                    "rollNo": "12345",
                    "role": "student"
                },
                "status": true
            }

        4. POST /login (Faculty) [http://localhost:3000/faculty/login]
            URL: /login
            Method: POST
            Description: Logs in a faculty member and returns JWT tokens.
            Request body:
            
            {
                "email": "alice.smith@example.com",
                "password": "password123"
            }


            Response:
            
            {
                "user": {
                    "firstName": "Dr. Alice",
                    "lastName": "Smith",
                    "email": "alice.smith@example.com",
                    "teacherId": "F123",
                    "department": "Computer Science",
                    "role": "faculty"
                },
                "status": true
            }

        5. GET /data [http://localhost:3000/{faculty or student}/data]
            URL: /data
            Method: GET
            Description: A protected route that returns data for the user based on their role (student or faculty).
            Middleware: VerifyRole middleware is used to verify the user's role.
            Response:
            
            {
                "message": "Allowed Route or Data",
                "status": true
            }
            
         Middleware
            VerifyRole: Ensures that the user has a valid role (admin, student, faculty) before accessing protected routes.
            VerifyUserToken: Verifies the authenticity of the user_token to ensure the user is authenticated.
            Error Handling
            All errors are handled gracefully and passed to the error-handling middleware for consistent responses. If a request is unauthorized, the server will return an appropriate error message with a 401 Unauthorized status.
            Security Considerations
            Passwords are securely hashed using bcryptjs before being stored in the database.
            JWT tokens are signed with a secret key and stored in HTTP-only cookies to prevent cross-site scripting (XSS) attacks.



           
