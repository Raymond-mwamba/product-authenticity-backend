# Product Authenticity Management System - Backend API

## Overview

RESTful API backend for the multichannel product authenticity verification system. Uses Node.js/Express with MySQL database and integrates with USSD gateway for feature phone support.

## Quick Start

### Prerequisites
- Node.js >= 16
- MySQL 5.7+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`

## Architecture

```
Three-Tier Architecture (Client-Server Model)
├── Presentation Layer (React Native Frontend)
├── Application Layer (Node.js/Express API)
└── Data Layer (MySQL Database)
```

## API Endpoints

### Verifications

**POST** `/api/verifications/verify`
- Verify product authenticity
- Request body: `{ unique_code, channel, location }`
- Response: Verification result with authenticity status

**GET** `/api/verifications`
- Get all verifications
- Query: `limit`, `offset`

**GET** `/api/verifications/:id`
- Get specific verification

**GET** `/api/verifications/stats/overview`
- Get verification statistics

### Products

**GET** `/api/products`
- Get all products
- Query: `limit`, `offset`

**GET** `/api/products/:id`
- Get product details

**GET** `/api/products/search?q=query`
- Search products

**POST** `/api/products`
- Create new product
- Request body: `{ name, manufacturer_id, unique_code, description }`

### Manufacturers

**GET** `/api/manufacturers`
- Get all manufacturers

**GET** `/api/manufacturers/:id`
- Get manufacturer details

**POST** `/api/manufacturers`
- Create manufacturer
- Request body: `{ name, contact_info }`

**PUT** `/api/manufacturers/:id`
- Update manufacturer

## Database Schema

### Manufacturers
```sql
- id (PK)
- name (VARCHAR 255)
- contact_info (VARCHAR 255)
- created_at (TIMESTAMP)
```

### Products
```sql
- id (PK)
- name (VARCHAR 255)
- manufacturer_id (FK)
- unique_code (VARCHAR 100, UNIQUE)
- description (TEXT)
- date_added (DATETIME)
```

### Verifications
```sql
- id (PK)
- product_id (FK)
- channel (VARCHAR 20) - 'app' or 'ussd'
- verification_time (DATETIME)
- verification_result (VARCHAR 20) - 'authentic' or 'counterfeit'
- location (VARCHAR 255)
```

## USSD Integration

USSD webhook endpoint: `POST /api/ussd/callback`

For Africa's Talking integration:
1. Configure USSD short code in `.env`
2. Set callback URL in Africa's Talking dashboard
3. Handle incoming USSD requests through the service

## Testing

```bash
npm test
```

## Deployment

### Environment Setup
Set environment variables on production server:
- `NODE_ENV=production`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `USSD_API_KEY`, `USSD_USERNAME`

### Build & Run
```bash
npm install
npm start
```

## Technologies Used

- **Framework**: Express.js
- **Database**: MySQL 5.7+
- **HTTP Client**: Axios
- **Validation**: express-validator, Joi
- **Environment**: dotenv

## Project Structure

```
src/
├── config/          - Database and configuration
├── controllers/     - Route handlers
├── models/         - Database models
├── routes/         - API routes
├── services/       - Business logic (Verification, USSD)
├── middleware/     - Express middleware
├── utils/          - Helper functions
├── seeds/          - Sample data
└── server.js       - Main application file
```

## Error Handling

All API responses follow consistent format:
```json
{
  "status": "success|error",
  "data": {},
  "message": "Response message",
  "code": "ERROR_CODE"
}
```

## Logging

Request logging is configured. Check console output for request details and errors.

## Contributing

1. Follow existing code structure
2. Use consistent naming conventions
3. Add validation for all inputs
4. Test endpoints before committing

## License

Proprietary - Product Authenticity Management System
