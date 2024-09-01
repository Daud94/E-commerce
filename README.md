# Basic E-commerce API
## Overview
This project is a simple e-commerce system built with NestJS for the backend API. This e-commerce system provides a 
robust API for managing users and products with role-based access control. The primary objectives include creating a 
secure, maintainable system where users can register, manage their products, and view approved products, while admins 
can oversee user activities and product approvals. Comprehensive API documentation is provided using Swagger to ensure 
clarity and ease of use for developers.

## Objectives
* Implement a secure and maintainable e-commerce API with role-based access control.
* Allow users to register, manage their products, and view approved products.
* Suspended users shouldn't be allowed to log in.
* Empower admins to manage users, approve/disapprove products, and access a dedicated user management panel.
* Provide comprehensive API documentation using Swagger.
* Query optimization through pagination and caching.

## Features
- Authentication Endpoint:
  - User Authentication
    - User registration
    - User signin
  - Admin Authentication
    - Admin signin
    

- Product Endpoint
  - User adds product
  - User fetches a product
  - User fetches all products
  - User (including unauthenticated user) fetches all approved products
  - User updates a product
  - User deletes a product


- Admin[Users Management]
  - Admin fetches all users
  - Admin fetches a user details
  - Admin suspends a user
  - Admin unsuspends/approves a user
  - Admin deletes a user


- Admin[Products Management]
    - Admin fetches all products
    - Admin fetches a product details
    - Admin suspends a product
    - Admin unsuspend/approve a product
    - Admin deletes a product

## Prerequisites
- NodeJs
- NestJS
- Postgres
## Getting Started
### Clone the Repository
```shell
git clone https://github.com/Daud94/E-commerce.git
```
### Configuration
1. Create a `.env` file in th root directory.
2. Copy content from the `.env.example` file in the root directory and paste it in the `.env` file. Content of 
`.env.example` is as well provided below:
```dotenv
JWT_SECRET=
NODE_ENV=
PREFIX=
SALT_OR_ROUNDS=
CACHE_TTL=
PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
```
- `JWT_SECRET` holds value for a long string of mixed characters for signing JWT payload. You can generate one by 
running this command in your terminal: 
    ```shell
      openssl rand -hex 32
    ```
- `NODE_ENV` holds a string value for specifying the deployment environment. It can be "development", "test" or "production".
- `PREFIX` holds a string value for global API prefix to routes e.g `/products` would be `/api/products`.
- `SALT_OR_ROUNDS` holds an integer value for to store SALT value for bcrypt hashing function.
- `CACHE_TTL` Cache expiration time
- `PORT` holds integer value for the API port the app runs on.
- `DB_USER` Postgres database username.
- `DB_PASSWORD` Postgres database password.
- `DB_NAME` Postgres database name.
- `DB_HOST` Postgres database host.
- `DB_PORT` Postgres database port.
- `SUPER_ADMIN_EMAIL` holds email for super admin to be seeded into the admins table.
- `SUPER_ADMIN_PASSWORD` holds password for super admin to be seeded alongside the password into the admins table.

### Installation
Install all dependencies from the `package.json` file:
```shell
npm install
```
Run the application:
```shell
npm run start:dev
```
### Database Migration
Apply migrations to the Postgres database:
```shell
npm run migrate
```
### Database Seeding
Seed data into the database - admins table:
```shell
npm run seed:all
```
### API Endpoints
#### User Authentication
- POST `/api/v1/auth/users/register`: 

  allows user to register

- POST `/api/v1/auth/users/login`:

  allows user to login

#### Admin Authentication
- POST `/api/v1/auth/admins/login`:

  allows user to login

#### Products
- POST `/api/v1/products`:

  allows authenticated user to add a product

- PATCH `/api/v1/products/:id`:

  allows authenticated user to update his product

- GET `/api/v1/products`:

  allows authenticated user to fetch list of his products

- GET `/api/v1/products/approved`:

  allows both authenticated and unauthenticated user view list of approved products

- GET `/api/v1/products/:id`:

  allows authenticated user to fetch a product details

- DELETE `/api/v1/products/:id`:

  allows authenticated user to delete a product

#### Admin[Users Management]
- GET `/api/v1/admin/users-management/users`:

  allows admin to fetch list of users

- GET `/api/v1/admin/users-management/users/:id`:

  allows admin to fetch a single user's details

- DELETE `/api/v1/admin/users-management/users/:id`:

  allows admin to delete a user

- PATCH `/api/v1/admin/users-management/users/:id/suspend`:

  allows admin to suspend a user

- PATCH `/api/v1/admin/users-management/users/:id/unsuspend`:

  allows admin to unsuspend or approve a user

#### Admin[Products Management]
- GET `/api/v1/admin/products-management/products`:

  allows admin to fetch list of products

- GET `/api/v1/admin/products-management/products/:id`:

  allows admin to fetch a single product's details

- DELETE `/api/v1/admin/products-management/products/:id`:

  allows admin to delete a product

- PATCH `/api/v1/admin/products-management/products/:id/suspend`:

  allows admin to suspend a product

- PATCH `/api/v1/admin/products-management/admins/:id/unsuspend`:

  allows admin to unsuspend or approve a product
- 
### Authentication
The API uses JWT (Json Web Token) for authentication. After logging in, you will receive an accessToken which must be included in the Authorization header of subsequent requests.

#### Register/Signup[User]
Endpoint: POST `/api/v1/auth/users/register`

Request body:
```json
{
  "firstName": "your_first_name",
  "lastName": "your_last_name",
  "email": "your_email",
  "password": "your_password"
}
```
Example response:
```json
{
  "success": true,
  "message": "Registration successful"
}
```
#### Login[User]
Endpoint: POST `/api/v1/auth/users/login`

Request body:
```json
{
  "email": "your_email",
  "password": "your_password"
}
```
Example response:
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "jwt_token"
}
```
#### Login[Admin]
Endpoint: POST `/api/v1/auth/admins/login`

Request body:
```json
{
  "email": "admin_email",
  "password": "admin_password"
}
```
Example response:
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "jwt_token"
}
```
#### Products
Endpoint: POST `/api/v1/products`

Request body:
```json
{
  "name": "string",
  "price": 100,
  "description": "string",
  "quantity": 1
}
```
Example response:
```json
{
  "success": true,
  "message": "Product added"
}
```
Endpoint: PATCH `/api/v1/products/:id`

Parameters:
* `:id` integer value of the product to be updated

Request body:
```json
{
  "name": "string",
  "price": 100,
  "description": "string",
  "quantity": 1
}
```
Example Request:

`GET /api/v1/products/1`

Example response:
```json
{
  "success": true,
  "message": "Product added"
}
```
Endpoint: GET `/api/v1/products`

Parameters:
* `searchTerm`: The product searched for (undefined by default). It is case-insensitive.
* `status`: The product's status, which can be undefined or any of [Pending, Approved, Suspended]
* `minPrice`: Minimum price of products to be fetched(undefined by default)
* `maxPrice`: Maximum price of products to be fetched (undefined by default)
* `page`: The current page number (starting from 1)
* `limit`: The number of items per page (default 20)

Example Request:

`GET /api/v1/products?searchTerm=Bicycle&status=Pending&page=1&limit=20`

Example response:
```json
{
  "success": true,
  "message": "Products fetched",
  "data": [
    {
      "price": 10000000,
      "id": 3,
      "name": "Electric Motor",
      "description": "White",
      "quantity": 10,
      "status": "Pending",
      "userId": 1,
      "createdAt": "2024-08-31T03:44:21.166Z",
      "updatedAt": "2024-08-31T03:44:21.166Z"
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 20,
    "itemCount": 1,
    "pageCount": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```
Endpoint: GET `/api/v1/products/approved`

Parameters:
* `searchTerm`: The product searched for (undefined by default). It is case-insensitive.
* `minPrice`: Minimum price of products to be fetched(undefined by default)
* `maxPrice`: Maximum price of products to be fetched (undefined by default)
* `page`: The current page number (starting from 1)
* `limit`: The number of items per page (default 20)

Example Request:

`GET /api/v1/products?searchTerm=Bicycle&status=Pending&page=1&limit=20`

Example response:
```json
{
  "success": true,
  "message": "Products fetched",
  "data": [
    {
      "price": 10000000,
      "id": 3,
      "name": "Electric Motor",
      "description": "White",
      "quantity": 10,
      "status": "Approved",
      "userId": 1,
      "createdAt": "2024-08-31T03:44:21.166Z",
      "updatedAt": "2024-08-31T03:44:21.166Z"
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 20,
    "itemCount": 1,
    "pageCount": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```
Endpoint: GET `/api/v1/products/:id`

Parameters:
* `:id` integer value of the product to be fetched

Example Request:

`GET /api/v1/products/1`

Example response:
```json
{
  "success": true,
  "message": "Product details fetched",
  "data": {
    "price": 10000000,
    "id": 3,
    "name": "Electric Motor",
    "description": "White",
    "quantity": 10,
    "status": "Pending",
    "userId": 1,
    "createdAt": "2024-08-31T03:44:21.166Z",
    "updatedAt": "2024-08-31T03:44:21.166Z"
  }
}
```
Endpoint: DELETE `/api/v1/products/:id`

Parameters:
* `:id` integer value of the product to be deleted

Example Request:

`DELETE /api/v1/products/1`

Example response:
```json
{
  "success": true,
  "message": "Product deleted"
}
```
Documentation for the remaining APIs can be found via swagger. It can be found via this `<HOST>:<PORT>/docs`
where `HOST` can be `http://localhost` if it is development and `PORT` is the port the app is running on, say `3000`.
### API Testing
The API can be tested on swagger

### OPTIMIZATION
All queries where there is the possibility of retrieving large datasets are paginated and cached for the time specified.
For this project's scope, 60,000 milliseconds (1 minute) is set in the `env` file.The caching is done by employing
Nest's Cache Manager, which provides in-memory caching. An alternative to this is REDIS.
  - GET `/api/v1/products`
  - GET `/api/v1/products/approved`
  - GET `/api/v1/admin/users-management/users`
  - GET `/api/v1/admin/products-management/products`