# New Features: Dynamic Diagnosis, Frequency, Instructions, and Days Management

## Overview

This update introduces a comprehensive system for managing diagnosis, frequency, instructions, and days dynamically through the backend API. The system follows SOLID principles and implements a layered architecture pattern.

## Features Implemented

### 1. Database Models
- **Diagnosis Model**: Stores medical diagnoses with name, description, and category
- **Frequency Model**: Stores medication frequencies with name, description, and code
- **Instruction Model**: Stores medication instructions with name, description, and category
- **Days Model**: Stores duration periods with name, description, value, and unit

### 2. Backend Architecture

#### Models (`server/src/models/`)
- `diagnosis.model.ts` - Diagnosis schema and interface
- `frequency.model.ts` - Frequency schema and interface
- `instruction.model.ts` - Instruction schema and interface
- `days.model.ts` - Days schema and interface

#### Services (`server/src/services/`)
- `diagnosis.service.ts` - Business logic for diagnosis operations
- `frequency.service.ts` - Business logic for frequency operations
- `instruction.service.ts` - Business logic for instruction operations
- `days.service.ts` - Business logic for days operations

#### Controllers (`server/src/controllers/`)
- `diagnosis.controller.ts` - HTTP request handling for diagnosis
- `frequency.controller.ts` - HTTP request handling for frequency
- `instruction.controller.ts` - HTTP request handling for instruction
- `days.controller.ts` - HTTP request handling for days

#### Routes (`server/src/routes/`)
- `diagnosis.routes.ts` - REST API endpoints for diagnosis
- `frequency.routes.ts` - REST API endpoints for frequency
- `instruction.routes.ts` - REST API endpoints for instruction
- `days.routes.ts` - REST API endpoints for days

### 3. Frontend Components

#### Modal Component (`client/src/Components/doctor/models/AddItemModal.jsx`)
- Reusable modal for adding/editing diagnosis, frequency, instruction, and days
- Form validation and error handling
- CRUD operations with backend integration

#### Updated Prescription Page (`client/src/Pages/doctor/prescription.jsx`)
- Dynamic dropdowns populated from backend
- "Add New" buttons for each field type
- Edit and delete functionality for existing items
- Real-time updates when items are added/modified

## API Endpoints

### Diagnosis
- `GET /api/diagnosis` - Get all diagnoses
- `GET /api/diagnosis/search?q=query` - Search diagnoses
- `GET /api/diagnosis/:id` - Get diagnosis by ID
- `POST /api/diagnosis` - Create new diagnosis
- `PUT /api/diagnosis/:id` - Update diagnosis
- `DELETE /api/diagnosis/:id` - Delete diagnosis

### Frequency
- `GET /api/frequency` - Get all frequencies
- `GET /api/frequency/search?q=query` - Search frequencies
- `GET /api/frequency/:id` - Get frequency by ID
- `POST /api/frequency` - Create new frequency
- `PUT /api/frequency/:id` - Update frequency
- `DELETE /api/frequency/:id` - Delete frequency

### Instructions
- `GET /api/instruction` - Get all instructions
- `GET /api/instruction/search?q=query` - Search instructions
- `GET /api/instruction/category/:category` - Get instructions by category
- `GET /api/instruction/:id` - Get instruction by ID
- `POST /api/instruction` - Create new instruction
- `PUT /api/instruction/:id` - Update instruction
- `DELETE /api/instruction/:id` - Delete instruction

### Days
- `GET /api/days` - Get all days
- `GET /api/days/search?q=query` - Search days
- `GET /api/days/unit/:unit` - Get days by unit
- `GET /api/days/:id` - Get days by ID
- `POST /api/days` - Create new days
- `PUT /api/days/:id` - Update days
- `DELETE /api/days/:id` - Delete days

## Database Schema

### Diagnosis
```typescript
{
  name: string (required, unique),
  description?: string,
  category?: string,
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Frequency
```typescript
{
  name: string (required, unique),
  description: string (required),
  code: string (required, unique),
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Instruction
```typescript
{
  name: string (required, unique),
  description: string (required),
  category?: string,
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Days
```typescript
{
  name: string (required, unique),
  description: string (required),
  value: number (required, min: 1),
  unit: string (required, enum: ['days', 'weeks', 'months']),
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### Adding New Items
1. Click the "Add New" button next to any field (Diagnosis, Frequency, Duration, Instructions)
2. Fill in the required information in the modal
3. Click "Save" to add the item to the database
4. The item will immediately appear in the dropdown

### Editing Items
1. Click the "Add New" button to open the modal
2. The modal will show existing items with edit/delete options
3. Click the edit icon to modify an item
4. Click the delete icon to remove an item

### Using Dynamic Data
- All dropdowns now show items from the database first
- Legacy hardcoded options are still available as fallback
- Custom input mode is still available for one-off entries

## Initial Data

The system comes with pre-seeded data including:

### Diagnoses
- Abdominal Pain, Acute Bronchitis, Hypertension, Diabetes Mellitus, etc.

### Frequencies
- Once daily (Morning), Twice daily, Three times daily, SOS, STAT, etc.

### Instructions
- Before food, After food, With food, Empty stomach, etc.

### Days
- 1 Day, 3 Days, 7 Days, 14 Days, 30 Days, etc.

## Technical Implementation

### SOLID Principles
- **Single Responsibility**: Each service handles one entity type
- **Open/Closed**: Easy to extend with new fields without modifying existing code
- **Liskov Substitution**: All models follow consistent interfaces
- **Interface Segregation**: Clean separation between models, services, and controllers
- **Dependency Inversion**: Controllers depend on service abstractions

### Layered Architecture
1. **Routes Layer**: HTTP request routing
2. **Controller Layer**: Request/response handling
3. **Service Layer**: Business logic and data operations
4. **Model Layer**: Database schema and data access

### Error Handling
- Comprehensive error handling at all layers
- User-friendly error messages
- Proper HTTP status codes
- Validation at both frontend and backend

### Security
- Authentication middleware applied to all routes
- Input validation and sanitization
- SQL injection prevention through Mongoose
- XSS protection through proper escaping

## Installation and Setup

1. **Backend Setup**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Database**: The system will automatically seed initial data on first run

## Future Enhancements

- Bulk import/export functionality
- Advanced search and filtering
- Category management for better organization
- Audit logging for data changes
- API rate limiting
- Caching for improved performance 