# Blog API

Blog API is a Node.js application built with Express.js and MongoDB. It provides a backend service for managing blog posts, tags, and user authentication.

## Features

1. **Post and Tags Management:** Posts and tags are stored in separate tables with a many-to-many relationship with blog posts and users.
2. **Authentication:** User authentication is implemented for secure access to the API.
3. **Tag CRUD Operations:** Users can add, edit, and delete tags for their posts.
4. **Search and Filter:** Allows searching by tag, date range, and retrieving all posts by a specific user.
5. **Error Handling and Validation:** Includes robust error handling and data validation for API requests.

## API Endpoints

### User Routes

- `/api/register` (POST): Register a new user.
- `/api/login` (POST): User login authentication.

### Post Routes

- `/createPost` (POST): Create a new blog post.
- `/editPost/:id` (PUT): Update an existing blog post.
- `/deletePost/:id` (DELETE): Delete a blog post by ID.

### Search Routes

- `/searchAllUserPosts` (GET): Search all posts by a specific user.
- `/searchPostsByDateRange` (GET): Search posts within a specified date range.
- `/searchPostsByTags` (GET): Search posts by tags.

## How to Run || Installation

To run this project locally, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/vivekyadav5750/blog-api.git
  
2. Navigate to the project directory:
   ```bash
   cd blog-api
    ```
3. Install dependencies:
   ```bash
   npm install

4. Start the server:
   ```bash
   node start
- `check api response from postman`
