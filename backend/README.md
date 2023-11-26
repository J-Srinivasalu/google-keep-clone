# Google Keep Clone - Backend

This component is responsible for handling server-side logic and data storage.

## Technologies Used

- **Node.js:** A JavaScript runtime for building scalable network applications.
- **Express:** A fast, unopinionated web framework for Node.js.
- **MongoDB:** A NoSQL database for storing note data.
- **Zod Validation:** A TypeScript-first schema declaration and validation library.

## Getting Started

1. Create a .env file in root

   ```.env
   MONGO_DB_USER=<your-username>
   MONGO_DB_PASSWORD=<your-password>
   MONGO_DB_NAME=<db-name>
   PORT=3000
   SECRET_KEY=secretkey
   NODE_ENV=online
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Run the development server.

   ```bash
   npm run dev
   ```

4. The backend server will be accessible at `http://localhost:3000`.

## Features Implemented

1. **Signup:** User registration with Zod validation for input data.
2. **Signin:** Authentication for existing users.
3. **Add Note:** Endpoint for creating and saving notes.
4. **Update Note:** Endpoint for modifying existing notes.
5. **Delete Note:** Endpoint for removing unwanted notes.

## Postman Collection Setup

To test the API endpoints using Postman, import the following collection configuration:

### Set the following variables in Postman for easy testing:

```text
   DEV_URL: <DEV_URL>
```

Feel free to reach out if you have any questions or feedback. Happy coding!
