# MindSpace - Social Media Application

MindSpace is a social notes application built with Node.js, Express, MongoDB, and EJS. It allows users to register, create posts, like other users' posts, and interact with a social feed.

## Features

- User registration and authentication
- Create and edit posts
- Like/unlike posts
- View personal profile with own posts
- Browse public feed of all posts
- Secure password hashing with bcrypt
- JWT-based authentication with cookies

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling (ODM) library
- **EJS** - Embedded JavaScript templating
- **Tailwind CSS** - Utility-first CSS framework
- **Bcrypt** - Password hashing
- **JSONWebToken** - Authentication tokens
- **Cookie Parser** - Parse cookies

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Start the application:
   ```bash
   node app.js
   ```
5. Visit `http://localhost:5000` in your browser

## Usage

1. **Registration**: Visit the homepage to create an account
2. **Login**: Use your email and password to log in
3. **Create Posts**: Share your thoughts by creating new posts
4. **View Profile**: See your posts and activity
5. **Browse Feed**: View all posts from all users
6. **Like Posts**: Engage with content by liking posts
7. **Edit Posts**: Modify your own posts

## Routes

- `GET /` - Home page (registration)
- `GET /login` - Login page
- `GET /profile` - User profile page
- `GET /feed` - Public feed of all posts
- `GET /like/:id` - Like/unlike a post
- `GET /edit/:id` - Edit a post
- `POST /update/:id` - Update a post
- `POST /post` - Create a new post
- `POST /register` - Register a new user
- `POST /login` - Authenticate user login
- `GET /logout` - Log out the user

## Database Models

### User Model
- Username
- Email
- Password (hashed)
- Age
- Name
- Posts (array of post references)

### Post Model
- User (reference to author)
- Date (creation timestamp)
- Content (post text)
- Likes (array of user references)

## Security Features

- Passwords are hashed using bcrypt
- Authentication handled via JWT tokens stored in cookies
- Protected routes with middleware to ensure user is logged in

## Project Structure

```
├── models/
│   ├── post.js
│   └── user.js
├── views/
│   ├── edit.ejs
│   ├── feed.ejs
│   ├── index.ejs
│   ├── login.ejs
│   └── profile.ejs
├── app.js
├── package.json
├── package-lock.json
└── .gitignore
```
