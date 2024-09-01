# Basic E-commerce API
## Overview
This project is a simple e-commerce system built with NestJS for the backend API. It provides functionalities for 
user management, product management, and an admin panel for managing both users and products.
## Features
- Authentication Endpoint:
  - User Authentication
    - User registration
    - User signin
  - Admin Authentication
    - Admin signin
    

- Product Endpoint
  - User adds product
  - User fetch a product
  - User fetches all products
  - User (including unauthenticated user) fetches all approved products
  - User updates a product
  - User deletes a product


- Admin[Users Management]
  - Admin fetches all users
  - Admin fetches a user details
  - Admin suspends a user
  - Admin unsuspend/approve a user
  - Admin deletes a user


- Admin[Products Management]
    - Admin fetches all products
    - Admin fetches a product details
    - Admin suspends a product
    - Admin unsuspend/approve a product
    - Admin deletes a product

## Prerequisites
- NodeJs
- ExpressJS
- Sqlite
- Postman for API testing
## Getting Started
### Clone the Repository
```angular2html
git clone https://github.com/Daud94/pataverse-assessment.git
cd petaverse-assessment
```
### Configuration
Create a `.env` file in the root directory with the following content:
```angular2html
NODE_ENV=
SALT=
JWT_SECRET=
```
`NODE_ENV` can either be `development` or `production`. For this app, it should be set to development.
`SALT` should be a numeric value (e.g 10)
`JWT_SECRET` could be any string of your choice but should be secured enough.

### Installation
Install all dependencies from the `package.json` file:
```angular2html
npm install
```
Run the application:
```angular2html
npm run dev
```
### Database Migration
Apply migrations to the SQLite database:
```angular2html
npm run migrate
```

### API Endpoints
**Authentication Endpoint**
POST `/api/auth/signup`
- Allows user to signup
  POST `/api/auth/signin`
- Allows user to signin
  PUT `/api/auth/verify-otp`
- After user signup, a six-digit OTP is sent to the user. This endpoint allows verification of the otp.
  POST `/api/auth/resend-otp`
- Allows user to regenerate a new otp if previous one expires.

### Authentication
The API uses JWT (JSON Web Token) for authentication. After logging in, you will receive a token which must be included in the Authorization header of subsequent requests.

### Signup
Endpoint: POST `/api/auth/signup`

Request body:
```json
{
  "firstName": "your_first_name",
  "lastName": "your_last_name",
  "email": "your_email",
  "password": "your_password"
}
```
### Signin
Endpoint: POST `/api/auth/signin`

Request body:
```json
{
  "email": "your_email",
  "password": "your_password"
}
```
### Verify OTP
Endpoint: PUT `/api/auth/verify-otp`

Request body:
```json
{
  "email": "your_email",
  "emailToken": "your_OTP"
}
```
### Resend OTP
Endpoint: POST `/api/auth/resend-otp`

Request body:
```json
{
  "email": "your_email"
}
```
### API Testing
In the project root directory is a postman collection - `Petaverse.postman_collection.json` for the APIs. Import it as
a collection in your postman. The app is set to run local host; port 3000. You can then start testing the API.
_NOTE:_ Otp sent to the user as a response instead of an email. This is to ease testing as email integration may
take some time to set up. However, to allow sending of otp an email using one's gmail account, simply follow the setup
below:

### Mail Setup
Follow the steps with the heading in [Google Cloud Platform Configurations](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/)
and generate the values for the keys below and add them to your  `.env` file:
```angular2html
MAIL_USERNAME=
MAIL_PASSWORD=
OAUTH_CLIENTID=
OAUTH_CLIENT_SECRET=
OAUTH_REFRESH_TOKEN=
```
Uncomment line 28 in `auth.controller.js` and line 168 in controllers directory