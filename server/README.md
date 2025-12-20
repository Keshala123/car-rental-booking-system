# Car Rental Server

Backend API for the Car Rental Booking System built with Node.js, Express, and MongoDB.

## Features

- RESTful API architecture
- MongoDB database with Mongoose ODM
- Complete CRUD operations for cars, bookings, and contact forms
- Request validation
- Error handling middleware
- Database seeding with sample data
- CORS enabled

## API Endpoints

### Cars
- `GET /api/cars` - Get all cars (with optional filters)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create new car (admin)
- `PUT /api/cars/:id` - Update car (admin)
- `DELETE /api/cars/:id` - Delete car (admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Contact
- `GET /api/contact` - Get all contact submissions (admin)
- `POST /api/contact` - Submit contact form
- `PATCH /api/contact/:id` - Update contact status (admin)

### Utility
- `POST /api/seed` - Seed database with sample cars

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car_rental_db
CLIENT_URL=http://localhost:5173
```

3. Start the server:
```bash
npm run dev
```

4. Seed the database:
```bash
# Using curl
curl -X POST http://localhost:5000/api/seed

# Or visit in browser
http://localhost:5000/api/seed
```

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Joi (validation)
- CORS
- dotenv
