# LeafGuard Backend

This is the backend server for the LeafGuard mobile application, a plant disease detection and management system.

## Features

- User authentication and authorization
- Plant disease detection API
- User subscription management
- Scan history tracking
- Disease information database

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/leafguard
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   API_URL=http://localhost:5000/api
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm run build
npm start
```

### Seeding the Database

To seed the database with initial data:
```
npm run seed
```

This will create:
- Sample plant diseases
- Admin user (email: admin@leafguard.com, password: password123)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users

- `GET /api/users` - Get user profile
- `PUT /api/users` - Update user profile
- `GET /api/users/scans` - Get user scan history

### Plants

- `POST /api/plants/predict` - Detect plant disease from image
- `GET /api/plants/diseases` - Get list of plant diseases

### Subscriptions

- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions/subscribe` - Subscribe to a plan
- `GET /api/subscriptions/status` - Get subscription status
- `POST /api/subscriptions/cancel` - Cancel subscription

## Folder Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.ts        # Entry point
├── uploads/            # Uploaded files
├── dist/               # Compiled JavaScript
├── .env                # Environment variables
└── package.json        # Dependencies and scripts
```

## License

This project is licensed under the ISC License. 