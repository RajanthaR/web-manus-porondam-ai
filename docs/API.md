# API Documentation

## Overview

Porondam.ai uses tRPC for type-safe API communication between the frontend and backend. All API calls are made through tRPC procedures.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

## Authentication

Authentication is handled via JWT tokens stored in HTTP-only cookies.

### Login
```typescript
// No direct API call - uses redirect-based authentication
```

### Logout
```typescript
await authRouter.logout()
```

## API Endpoints

### Authentication Router (`authRouter`)

#### `logout`
- **Method**: POST
- **Description**: Logs out the user and clears authentication cookies
- **Returns**: `{ success: boolean }`

### Horoscope Router (`horoscopeRouter`)

#### `uploadAndProcess`
- **Description**: Uploads and processes horoscope chart images
- **Input**: 
  ```typescript
  {
    maleChart: File,
    femaleChart: File
  }
  ```
- **Returns**: Processed horoscope data with extracted details

#### `calculatePorondam`
- **Description**: Calculates Porondam compatibility between two horoscopes
- **Input**:
  ```typescript
  {
    male: HoroscopeDetails,
    female: HoroscopeDetails
  }
  ```
- **Returns**: 
  ```typescript
  {
    overallScore: number,
    porondamScores: PorondamScore[],
    recommendations: string[]
  }
  ```

#### `saveMatchingResult`
- **Description**: Saves a matching result to the user's history
- **Input**:
  ```typescript
  {
    maleDetails: HoroscopeDetails,
    femaleDetails: HoroscopeDetails,
    result: MatchingResult
  }
  ```
- **Returns**: Saved matching record ID

#### `getMatchingHistory`
- **Description**: Retrieves user's matching history
- **Returns**: Array of saved matching results

#### `deleteMatchingRecord`
- **Description**: Deletes a specific matching record
- **Input**: `{ id: string }`
- **Returns**: `{ success: boolean }`

#### `generatePDF`
- **Description**: Generates a PDF report for matching results
- **Input**:
  ```typescript
  {
    maleDetails: HoroscopeDetails,
    femaleDetails: HoroscopeDetails,
    result: MatchingResult
  }
  ```
- **Returns**: PDF file buffer

## Data Types

### HoroscopeDetails
```typescript
interface HoroscopeDetails {
  name: string;
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
  nakshatra: string;
  rashi: string;
  planetaryPositions: PlanetaryPosition[];
}
```

### PorondamScore
```typescript
interface PorondamScore {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  importance: 'high' | 'medium' | 'low';
}
```

### MatchingResult
```typescript
interface MatchingResult {
  overallScore: number;
  porondamScores: PorondamScore[];
  recommendations: string[];
  compatibility: 'excellent' | 'good' | 'average' | 'poor';
}
```

## Error Handling

All API errors are thrown as tRPC errors with the following format:

```typescript
{
  code: 'INTERNAL_SERVER_ERROR' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'NOT_FOUND',
  message: string,
  data?: any
}
```

## Rate Limiting

- Image upload: 5 requests per minute
- PDF generation: 10 requests per hour
- Other endpoints: 100 requests per minute

## File Upload Limits

- Supported formats: JPEG, PNG, PDF
- Maximum file size: 10MB per image
- Maximum dimensions: 4000x4000 pixels

## WebSocket Events

The application uses WebSocket connections for real-time updates:

### Connection
```typescript
const ws = new WebSocket('ws://localhost:3000/ws')
```

### Events
- `processing:start` - Image processing started
- `processing:progress` - Processing progress update
- `processing:complete` - Processing completed
- `error` - Processing error

## SDK Usage

### Frontend (React)
```typescript
import { trpc } from './utils/trpc'

const { data, mutate, isLoading } = trpc.horoscope.calculatePorondam.useMutation()

// Calculate Porondam
mutate({
  male: maleDetails,
  female: femaleDetails
})
```

### Direct API Call (External)
```typescript
// Note: Direct API calls require authentication cookie
const response = await fetch('/api/horoscope/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    male: maleDetails,
    female: femaleDetails
  })
})
```

## Testing the API

Use the tRPC playground during development:
- Navigate to `http://localhost:3000/api/trpc-playground`
- Explore and test all available procedures

## Security Considerations

1. All sensitive operations require authentication
2. File uploads are scanned for malware
3. Rate limiting prevents abuse
4. CORS is properly configured
5. All data is encrypted in transit (HTTPS)
