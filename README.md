# ReviewEverything

ReviewEverything is a full-stack movie discovery and review application built with **React, TypeScript, Express, MongoDB, PostgreSQL, and The Movie Database API (TMDB)**.

Users can discover movies, search for movies and actors, view detailed movie and actor information, write movie reviews, like reviews, comment on reviews, browse community reviews, and view a profile interface.

The project also contains infrastructure for user accounts, administrator functionality, PostgreSQL user storage, database seeding, and Docker-based local development.

---

# About the Project

ReviewEverything combines external movie information from:

```text
The Movie Database API
TMDB
```

with user-generated review data stored in:

```text
MongoDB
```

The application architecture is roughly:

```text
React Frontend
      ↓
 ┌────┴──────────────┐
 │                   │
 ▼                   ▼
TMDB API       Express REST API
                        ↓
                    MongoDB
                  Review Data

                        +
                  PostgreSQL
                  User Data
```

This allows movie information to come from TMDB while application-specific content such as reviews, likes, comments, and eventually user accounts can be stored independently.

---

# Current Features

ReviewEverything currently includes:

* Movie discovery
* Trending movie listings
* Genre-based movie discovery
* Movie search
* Actor search
* Movie detail pages
* Actor detail pages
* Actor biographies
* Actor filmographies
* Movie reviews
* Review creation
* Star ratings
* Review likes
* Review comments
* Review browsing
* Profile interface
* Login UI
* Registration UI
* MongoDB review persistence
* PostgreSQL user database scaffolding
* Express REST API
* TMDB API integration
* Docker Compose development environment
* MongoDB seed data
* PostgreSQL seed data
* Responsive CSS styling

---

# Technology Stack

## Frontend

```text
React 19
TypeScript
React Router
Vite
CSS
```

## Backend

```text
Node.js
Express 5
JavaScript
CORS
```

## Review Database

```text
MongoDB
Mongoose
```

## User Database

```text
PostgreSQL
Sequelize
pg
```

## External API

```text
TMDB
The Movie Database API
```

## Development / Infrastructure

```text
Docker
Docker Compose
Adminer
Jest
ESLint
```

---

# Main Application Flow

A typical user experience looks like:

```text
Open ReviewEverything
        ↓
Browse Trending Movies
        ↓
Search for Movie or Actor
        ↓
Open Movie Details
        ↓
Read Movie Information
        ↓
Read Community Reviews
        ↓
Write Review
        ↓
Review Saved to MongoDB
        ↓
Like or Comment on Reviews
```

---

# Frontend Routes

The main React router is configured in:

```text
src/App.tsx
```

Current routes are:

```text
/
├── Home
│
├── /search
│
├── /movie/:id
│
├── /actor/:id
│
├── /login
│
├── /reviews
└── /profile
```

---

# Home Page

The home page is located at:

```text
src/pages/HomePage.tsx
```

and is available at:

```text
/
```

The page retrieves movie information from TMDB.

It includes:

* Featured movie
* Trending movies
* Random movies from selected genres
* Movie cards
* Review-style cards
* Movie navigation
* Search/filter UI

---

# Featured Movie

The application retrieves the week's trending movies using:

```text
TMDB /trending/movie/week
```

One movie is randomly selected as the featured movie.

The featured movie appears in the large hero section.

Clicking it navigates to:

```text
/movie/{movieId}
```

---

# Genre Discovery

The homepage retrieves movies from genres such as:

```text
Action
Drama
Comedy
Thriller
Fantasy
```

using TMDB's movie discovery API.

The application selects a movie from each genre to populate the homepage.

---

# Search Page

Movie and actor search is available at:

```text
/search
```

The implementation is located in:

```text
src/pages/SearchPage.tsx
```

The search page communicates directly with TMDB.

Users can search using:

```text
Movie Title
Actor Name
Genre
```

---

# Movie Search

Movie searches use TMDB's:

```text
/search/movie
```

endpoint.

Results display information such as:

* Poster
* Movie title
* TMDB information
* Links to movie detail pages

---

# Actor Search

The application also searches:

```text
/search/person
```

This allows actor results to appear alongside movie searches.

Selecting an actor navigates to:

```text
/actor/{actorId}
```

---

# Genre Rows

The search page also displays randomized movie categories.

Possible genres include:

```text
Fantasy
Comedy
Action
Romance
Horror
Thriller
Science Fiction
Animation
Adventure
Mystery
```

A subset of genres is randomly selected when the page loads.

---

# Movie Details

Movie details are available at:

```text
/movie/:id
```

The page is implemented in:

```text
src/pages/MovieDetailsPage.tsx
```

Movie information comes from TMDB.

The page also integrates ReviewEverything's custom review system.

Conceptually:

```text
Movie Details
      ↓
TMDB Movie Information
      +
Write Review
      +
Other Reviews
```

---

# Writing Reviews

Review creation is handled by:

```text
src/components/reviews/WriteReviews.tsx
```

Users provide:

```text
Star Rating
Review Title
Review Text
```

The maximum review length is:

```text
3000 characters
```

---

# Review Validation

Before submitting, the frontend checks:

```text
Rating must be selected

Title cannot be empty

Review text cannot be empty

Review cannot exceed 3000 characters
```

---

# Review Submission

Reviews are submitted to:

```http
POST /api/user/reviews
```

The frontend sends data similar to:

```json
{
  "userID": "1",
  "username": "Reviewer Name",
  "movieID": "12345",
  "title": "Great movie",
  "reviewText": "I really enjoyed this movie.",
  "rating": 5
}
```

The API stores the review in MongoDB.

---

# Current Demo User

The current review interface uses a temporary hard-coded user:

```text
User ID: 1
Username: Reviewer Name
```

This means authentication has not yet been connected to review creation.

A future version should replace the demo user with the currently authenticated account.

---

# Review Model

Reviews are defined in:

```text
models/UserReview.js
```

A review contains:

```text
User ID
Movie ID
Username
Title
Review Content
Rating
Likes
Dislikes
Comments
Creation Date
Update Date
```

The Mongoose schema includes:

```js
{
    userID: String,
    movieID: String,
    username: String,
    title: String,
    content: String,
    rating: Number,
    likedBy: [String],
    dislikedBy: [String],
    comments: [...]
}
```

---

# Comments

Review comments contain:

```text
User ID
Username
Comment
Created Date
Updated Date
```

Comments are stored directly inside the review document.

---

# Viewing Other Reviews

Existing reviews are displayed by:

```text
src/components/reviews/OtherReviews.tsx
```

The component retrieves reviews using:

```http
GET /api/movies/reviews?movieID={movieId}
```

Each review can display:

* Rating
* Title
* Content
* Reviewer
* Likes
* Comments

---

# Like System

Users can like reviews.

The frontend calls:

```http
PATCH /api/reviews/:reviewID/like
```

with:

```json
{
  "userID": "1"
}
```

The backend toggles the user inside:

```text
likedBy
```

If the user has already liked the review, their like is removed.

If they have not liked it, their user ID is added.

---

# Adding Comments

Users can add comments using:

```http
POST /api/reviews/:reviewID/comments
```

Example request:

```json
{
  "userID": "1",
  "username": "Reviewer Name",
  "comment": "I agree with this review."
}
```

The comment becomes part of the MongoDB review document.

---

# Reviews Page

The application includes:

```text
/reviews
```

implemented by:

```text
src/pages/ReviewsPage.tsx
```

This page is intended to provide a broader community review experience separate from individual movie pages.

---

# Actor Details

Actor pages are available at:

```text
/actor/:id
```

and implemented in:

```text
src/pages/ActorDetailsPage.tsx
```

The application requests:

```text
TMDB person details
+
movie credits
```

using:

```text
/person/{id}
```

with:

```text
append_to_response=movie_credits
```

---

# Actor Information

The actor page displays information such as:

```text
Actor Name
Profile Image
Birthday
Place of Birth
Biography
Known Movies
Characters Played
```

Movies are sorted using TMDB popularity information such as vote count.

Selecting a movie opens its ReviewEverything movie page.

---

# Profile Page

The profile interface is available at:

```text
/profile
```

and implemented in:

```text
src/pages/ProfilePage.tsx
```

The current interface contains tabs for:

```text
Reviews
Ratings
Liked Movies
```

It also contains controls such as:

```text
Edit Profile
Delete Account
Logout
```

---

# Current Profile Status

The profile page is currently largely a frontend prototype.

Some profile values and collections are placeholders rather than live database data.

Sections such as:

```text
Reviews Go Here
Rating Go Here
Likes Go Here
```

show where future user data will be rendered.

---

# Login

A login interface is available at:

```text
/login
```

and implemented in:

```text
src/login.tsx
```

It asks for:

```text
Email
Username
Password
```

The current form performs client-side validation.

If all fields are filled in, it currently:

```text
Displays "Login successful!"
Logs the attempted credentials
```

It does **not currently authenticate against the backend**.

---

# Registration

The repository also contains:

```text
src/frontend/register.tsx
```

with a registration form.

It accepts:

```text
Email
Username
Password
```

The current registration form only logs the submitted data.

It is also **not currently registered as a route in `App.tsx`**.

---

# Authentication Status

Authentication is currently unfinished.

The project does not yet implement:

```text
Password hashing
User login sessions
JWT authentication
Protected routes
Current-user state
Backend login endpoint
Backend registration endpoint
```

The current login and registration screens should therefore be considered UI scaffolding.

---

# Navbar

The global navigation bar is located in:

```text
src/components/Navbar.tsx
```

Current navigation links include:

```text
Home
Movies
Reviews
Profile
```

There is also:

```text
Search input
Sign In button
```

The search field and Sign In button currently do not appear to be fully wired to application actions.

---

# Backend API

The Express backend is implemented in:

```text
server/index.js
```

The server runs on:

```text
Port 3100
```

and starts with:

```js
app.listen(3100, '0.0.0.0');
```

The base API URL is:

```text
http://localhost:3100/api
```

---

# API Endpoints

## API Status

```http
GET /api
```

Returns:

```json
{
  "isServingJSON": true
}
```

---

# Get All Reviews

```http
GET /api/reviews
```

Returns all reviews.

---

# Get Reviews by User

```http
GET /api/user/reviews?userID=1
```

---

# Get Reviews by Movie

```http
GET /api/movies/reviews?movieID=12345
```

---

# Filter Movie Reviews by Rating

```http
GET /api/movies/reviews/:rating?movieID=12345
```

---

# Filter User Reviews by Rating

```http
GET /api/user/reviews/:rating?userID=1
```

---

# Create Review

```http
POST /api/user/reviews
```

---

# Update Review

```http
PATCH /api/user/reviews
```

---

# Delete Review

```http
DELETE /api/user/reviews
```

---

# Rate Review

The project contains an older review-rating endpoint:

```http
PATCH /api/user/rate/:rate
```

This increments positive or negative review counts.

The newer frontend instead uses the toggle-like endpoint.

---

# Toggle Like

```http
PATCH /api/reviews/:reviewID/like
```

---

# Add Comment

```http
POST /api/reviews/:reviewID/comments
```

---

# MongoDB

MongoDB stores the application's review data.

The database is:

```text
reviewdb
```

and the collection used by Mongoose is:

```text
reviews
```

The MongoDB connection currently follows the pattern:

```text
mongodb://admin:admin@HOST:27017/reviewdb?authSource=admin
```

Docker uses:

```text
mongodb
```

as the MongoDB hostname.

Local development defaults to:

```text
localhost
```

---

# Review Data Access Layer

MongoDB operations are implemented in:

```text
server/data/review-DAL.js
```

Functions include:

```text
addReview
removeReview
updateReview
getAllReviewsByUser
getAllReviewsByMovie
getAllMovieReviewsByRating
getAllUserReviewsByRating
addReviewForUser
updateReviewForUser
rateReview
deleteReview
getAllReviews
toggleLikeReview
addCommentToReview
```

---

# PostgreSQL

The project also contains PostgreSQL support for user accounts.

The user model is located in:

```text
models/User.js
```

and uses:

```text
Sequelize
```

---

# User Model

The PostgreSQL user model currently contains:

```text
userID
username
description
movieReviews
isAdmin
```

Example structure:

```js
{
  userID: Number,
  username: String,
  description: String,
  movieReviews: [Number],
  isAdmin: Boolean
}
```

---

# User Data Access Layer

User database functions are located in:

```text
server/data/user-DAL.js
```

Functions include:

```text
addUser
updateToAdmin
updateUser
deleteUser
getTopFiftyUsers
getUser
getAllUsers
```

---

# Important User API Status

Although a user DAL exists, `server/index.js` currently does **not expose those user functions as REST endpoints**.

For example, the admin page tries to request:

```http
GET /api/users
```

but that endpoint is not currently defined.

That means user administration is not yet complete.

---

# Admin Page

The project contains:

```text
src/pages/AdminPage.tsx
```

The admin page is currently unfinished.

It contains placeholder logic such as:

```js
const [isAdmin, setIsAdmin] = useState(true);
```

and attempts to retrieve:

```text
/api/reviews
/api/users
```

However:

```text
/api/users
```

does not currently exist.

The Admin page is also **not included in the main React router**.

It should therefore be considered development scaffolding.

---

# TMDB Integration

Movie and actor information comes from:

```text
The Movie Database
```

The frontend uses:

```text
VITE_TMDB_API_KEY
```

to access the API.

The base URL is:

```text
https://api.themoviedb.org/3
```

Images use:

```text
https://image.tmdb.org
```

---

# TMDB Service

Reusable TMDB helpers are located in:

```text
src/services/tmdb.ts
```

Current helper functions include:

```text
getMoviesByGenre()
getTrendingMovies()
```

---

# Environment Variables

The project contains an `.env` configuration.

Important variables include:

```env
MONGOPASS=
MONGOUSER=
POSTGRESPASS=
VITE_TMDB_API_KEY=
```

For security, real credentials and API keys should not be committed to GitHub.

A safer repository structure would contain:

```text
.env.example
```

instead of a committed `.env`.

Example:

```env
MONGOPASS=your_mongodb_password
MONGOUSER=your_mongodb_user
POSTGRESPASS=your_postgres_password
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

# Security Warning

The current repository contains:

```text
A TMDB API key
Database passwords
Hard-coded database credentials
```

in source/configuration files.

Before publishing this repository publicly, rotate any exposed credentials if necessary and move all credentials to environment variables.

The application also contains a fallback TMDB API key inside:

```text
src/services/tmdb.ts
```

which should be removed.

Instead of:

```js
const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY ||
  "hard-coded-key";
```

prefer:

```js
const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY;
```

---

# Seeding Databases

The project includes seed scripts for both databases.

The root package contains:

```json
"seed": "node seeder.js"
```

Running:

```bash
npm run seed
```

runs:

```text
MongoDB seeder
+
PostgreSQL seeder
```

---

# MongoDB Seeder

Located at:

```text
seeders/mongoseed.js
```

It inserts sample reviews into:

```text
reviewdb.reviews
```

The sample reviews are linked to movie:

```text
1226863
```

---

# PostgreSQL Seeder

Located at:

```text
seeders/sqlseed.js
```

It creates:

```text
users
```

if necessary and inserts sample users.

Example fields include:

```text
username
description
movieReviews
isAdmin
```

---

# Docker

ReviewEverything includes a full Docker Compose configuration.

The main configuration is:

```text
compose.yml
```

Services include:

```text
webpage
mongodb
userDB
adminer
```

---

# Docker Architecture

```text
Docker Compose
      │
      ├── webpage
      │     ├── React / Vite :5173
      │     └── Express API  :3100
      │
      ├── mongodb
      │     └── MongoDB :27017
      │
      ├── userDB
      │     └── PostgreSQL :5432
      │          exposed as :5400
      │
      └── adminer
            └── :8080
```

---

# Docker Frontend and API

The custom Docker image uses:

```text
node:20-alpine
```

The Dockerfile installs both:

```text
Root frontend dependencies
Server dependencies
```

It then installs:

```text
concurrently
```

and runs:

```text
npm run dev
+
node server/index.js
```

at the same time.

---

# Docker Ports

The container exposes:

```text
5173
3100
```

The frontend is therefore available at:

```text
http://localhost:5173
```

and the API at:

```text
http://localhost:3100
```

---

# MongoDB Docker Port

MongoDB is available at:

```text
localhost:27017
```

---

# PostgreSQL Docker Port

PostgreSQL runs internally on:

```text
5432
```

and is exposed locally as:

```text
5400
```

---

# Adminer

Adminer is included for inspecting PostgreSQL.

Open:

```text
http://localhost:8080
```

The Docker configuration indicates:

```text
Server: userDB
User: postgres
Database: postgres
```

Use the password configured by your environment / Compose file.

---

# Project Structure

The repository is organized approximately like this:

```text
ReviewEverything-prod/
│
├── models/
│   ├── User.js
│   └── UserReview.js
│
├── seeders/
│   ├── mongoseed.js
│   ├── sqlseed.js
│   ├── dockermongoseed.js
│   └── dockersqlseed.js
│
├── server/
│   ├── data/
│   │   ├── review-DAL.js
│   │   └── user-DAL.js
│   │
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── reviews/
│   │       ├── OtherReviews.tsx
│   │       └── WriteReviews.tsx
│   │
│   ├── frontend/
│   │   └── register.tsx
│   │
│   ├── pages/
│   │   ├── ActorDetailsPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── MovieDetailsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ReviewsPage.tsx
│   │   └── SearchPage.tsx
│   │
│   ├── services/
│   │   └── tmdb.ts
│   │
│   ├── App.tsx
│   ├── login.tsx
│   ├── main.tsx
│   └── ...
│
├── Dockerfile
├── compose.yml
├── seeder.js
├── dockerseed.js
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env
└── README.md
```

---

# Important Files

## `src/App.tsx`

Defines the main React Router configuration.

---

## `src/services/tmdb.ts`

Contains reusable TMDB API requests.

---

## `src/pages/MovieDetailsPage.tsx`

Displays individual movie information and connects the movie to user reviews.

---

## `src/components/reviews/WriteReviews.tsx`

Creates new reviews.

---

## `src/components/reviews/OtherReviews.tsx`

Displays existing reviews and manages likes/comments.

---

## `server/index.js`

Defines the Express API.

---

## `server/data/review-DAL.js`

Handles MongoDB review operations.

---

## `server/data/user-DAL.js`

Contains PostgreSQL/Sequelize user operations.

---

## `models/UserReview.js`

Defines the MongoDB review schema.

---

## `models/User.js`

Defines the PostgreSQL user model.

---

## `compose.yml`

Defines the full Docker development environment.

---

# Running With Docker

Docker is currently the easiest way to run the full development environment.

## Prerequisites

Install:

```text
Docker Desktop
Git
```

Then clone the repository:

```bash
git clone <YOUR-REPOSITORY-URL>
```

Enter the project:

```bash
cd ReviewEverything-prod
```

---

# Configure Environment Variables

Create or update:

```text
.env
```

with the necessary values:

```env
MONGOPASS=your_password
MONGOUSER=your_user
POSTGRESPASS=your_password
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

# Start Docker

Run:

```bash
docker compose up --build
```

Docker will start:

```text
React Frontend
Express API
MongoDB
PostgreSQL
Adminer
```

---

# Open the Application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:3100/api
```

Adminer:

```text
http://localhost:8080
```

---

# Stop Docker

Run:

```bash
docker compose down
```

To also remove database volumes:

```bash
docker compose down -v
```

Be aware that:

```text
-v
```

deletes persisted Docker database data.

---

# Running Without Docker

The frontend and Express API can also be run manually.

You will need:

* Node.js
* npm
* MongoDB
* PostgreSQL
* TMDB API key

---

# Install Frontend Dependencies

From the project root:

```bash
npm install
```

---

# Install Server Dependencies

Run:

```bash
cd server
npm install
cd ..
```

---

# Start MongoDB

MongoDB must be available at:

```text
localhost:27017
```

unless the application configuration is changed.

The current DAL expects authentication matching the configured MongoDB credentials.

---

# Start PostgreSQL

The local SQL seeder expects PostgreSQL on:

```text
localhost:5400
```

when using the Docker-style mapping.

If running PostgreSQL directly on:

```text
5432
```

you may need to update the local configuration.

---

# Seed the Databases

Once both databases are available:

```bash
npm run seed
```

---

# Start the Express API

From the project root:

```bash
node server/index.js
```

The API should start at:

```text
http://localhost:3100
```

---

# Start the Frontend

In another terminal:

```bash
npm run dev
```

The frontend should normally open at:

```text
http://localhost:5173
```

---

# Common Commands

## Frontend Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Seed Databases

```bash
npm run seed
```

## Docker Seeder

```bash
npm run dockerseed
```

## Tests

```bash
npm test
```

---

# Production Build

To create a production frontend bundle:

```bash
npm run build
```

This runs:

```text
TypeScript build
+
Vite production build
```

The output is generated inside:

```text
dist/
```

---

# Current Limitations

The current production branch still contains several unfinished areas:

* Login is UI-only
* Registration is UI-only
* Registration is not routed
* No password hashing
* No backend authentication
* No session or JWT system
* Review creation uses a hard-coded demo user
* Likes use a hard-coded demo user
* Comments use a hard-coded demo user
* Profile data is mostly placeholder content
* Admin page is unfinished
* Admin route is not registered
* `/api/users` is not implemented
* User DAL is not wired into the Express server
* PostgreSQL user functionality is incomplete
* Navbar search input is not fully connected
* Sign In button is not fully connected
* Some homepage review cards use placeholder review content
* No authorization protects administrative actions
* Environment secrets are currently present in project files
* Database credentials are hard-coded in several locations
* No centralized API base URL configuration
* No production authentication/security system

---

# Recommended Next Steps

The most valuable improvements would be:

1. Implement backend registration.
2. Implement backend login.
3. Hash passwords using bcrypt.
4. Add JWT or session authentication.
5. Add email/password fields to the user model.
6. Create `/api/users` routes.
7. Connect Review creation to the authenticated user.
8. Connect likes/comments to the authenticated user.
9. Populate Profile from actual database records.
10. Protect admin routes.
11. Add `/admin` to the React router.
12. Move API URLs into environment variables.
13. Remove hard-coded credentials and TMDB keys.
14. Add validation to backend review/comment endpoints.
15. Add automated API and component tests.

---

# Recommended Environment Configuration

Instead of hard-coding:

```text
http://localhost:3100/api
```

inside React components, define:

```env
VITE_API_URL=http://localhost:3100/api
```

Then use:

```ts
const API_BASE =
  import.meta.env.VITE_API_URL;
```

This makes Docker, local development, and deployed environments easier to configure.

---

# Architecture Summary

The complete intended architecture is:

```text
                        User
                         │
                         ▼
                 React + TypeScript
                     Vite SPA
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
          TMDB API             Express API
              │                     │
              ▼          ┌──────────┴─────────┐
        Movies/Actors     │                    │
                          ▼                    ▼
                       MongoDB             PostgreSQL
                       Reviews               Users
                          │                    │
                          ▼                    ▼
                   Likes/Comments        Profiles/Admin
```

---

# Educational Concepts Demonstrated

ReviewEverything demonstrates:

```text
React
TypeScript
React Router
REST APIs
Express
MongoDB
Mongoose
PostgreSQL
Sequelize
Database Seeding
CRUD Operations
External APIs
TMDB
Docker
Docker Compose
Client/Server Architecture
Component-Based UI
Asynchronous Fetch
State Management
Nested MongoDB Documents
API Routing
Environment Variables
```

---

# Quick Start

The simplest full-stack startup is:

```bash
git clone <YOUR-REPOSITORY-URL>

cd ReviewEverything-prod

docker compose up --build
```

Then open:

```text
http://localhost:5173
```

The Express API is available at:

```text
http://localhost:3100/api
```

and Adminer is available at:

```text
http://localhost:8080
```

---

# License

Add your project's license information here if the repository is intended for public distribution.

---

# Summary

**ReviewEverything** is a full-stack movie discovery and review platform built with:

```text
React 19
TypeScript
Vite
Express 5
MongoDB
Mongoose
PostgreSQL
Sequelize
TMDB
Docker
```

The primary working flow is:

```text
Browse Movies
      ↓
Search Movies / Actors
      ↓
Open Movie Details
      ↓
Write Review
      ↓
Store Review in MongoDB
      ↓
Read Reviews
      ↓
Like Reviews
      ↓
Comment on Reviews
```

The project also contains the foundation for:

```text
User Accounts
Profiles
Admin Features
PostgreSQL User Storage
```

but those systems are not yet fully connected.

For full local development, the recommended command is:

```bash
docker compose up --build
```

and the application is available at:

```text
http://localhost:5173
```

