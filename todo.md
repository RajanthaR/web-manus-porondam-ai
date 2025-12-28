# Porondam.ai - Project TODO

## Core Features
- [x] Database schema for horoscope charts, matching results, and history
- [x] Nakshatra calculation algorithm from birth date/time
- [x] 20 Porondam matching algorithm with detailed scoring
- [x] GPT-4 Vision integration for handwritten chart recognition
- [x] Extract birth details (date, time, place) from chart images
- [x] Extract planetary positions from chart images

## Frontend Features
- [x] Elegant landing page with app introduction
- [x] Drag-and-drop image upload for two horoscope charts
- [x] Image preview and validation
- [x] Compatibility results display with percentage match
- [x] Detailed breakdown by each Porondam aspect
- [x] Recommendations based on matching results
- [x] Educational content for each Porondam aspect (Sinhala/English)
- [x] Mobile-responsive design

## User Features
- [x] User authentication integration
- [x] Save matching history to database
- [x] View past matching results
- [x] User dashboard

## Backend API
- [x] tRPC procedure for image upload and processing
- [x] tRPC procedure for Porondam calculation
- [x] tRPC procedure for matching history CRUD
- [x] S3 storage for uploaded chart images

## Design
- [x] Elegant, refined color palette (purple & gold theme)
- [x] Professional typography (Inter + Noto Sans Sinhala)
- [x] Smooth animations and transitions
- [x] Sri Lankan cultural design elements

## Tests
- [x] Unit tests for Nakshatra calculations
- [x] Unit tests for Rashi calculations
- [x] Unit tests for 20 Porondam score calculations
- [x] Unit tests for overall score and recommendations

## PDF Export Feature
- [x] Create PDF generation service on backend
- [x] Design PDF report template with Porondam.ai branding
- [x] Include match percentage, detailed breakdown, and recommendations in PDF
- [x] Add "Download PDF" button to results page
- [x] Test PDF generation and download functionality
