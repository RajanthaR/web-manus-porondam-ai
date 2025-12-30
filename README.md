# Porondam.ai - Sri Lankan Horoscope Matching Platform

A sophisticated web application that leverages AI to analyze and match Sri Lankan horoscope charts (Porondam) using traditional astrological principles combined with modern technology.

## 🌟 Features

### Core Functionality
- **AI-Powered Chart Recognition**: Uses GPT-4 Vision to extract birth details and planetary positions from handwritten horoscope charts
- **20 Porondam Matching Algorithm**: Traditional Sri Lankan astrological matching system with detailed scoring
- **Nakshatra Calculation**: Accurate calculation of birth stars (Nakath) from date, time, and place of birth
- **Comprehensive Analysis**: Detailed breakdown of compatibility across all Porondam aspects

### User Experience
- **Elegant Interface**: Beautiful, responsive design with Sri Lankan cultural elements
- **Drag & Drop Upload**: Intuitive image upload for horoscope charts
- **Bilingual Support**: Content available in Sinhala and English
- **PDF Reports**: Professional compatibility reports with detailed analysis
- **User Dashboard**: Save and view matching history

### Technical Features
- **Real-time Processing**: Fast and accurate chart analysis
- **Secure Storage**: AWS S3 integration for image storage
- **User Authentication**: Secure login and session management
- **Mobile Responsive**: Optimized for all devices

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 19** with TypeScript
- **TailwindCSS** for styling with custom animations
- **Radix UI** components for accessible UI
- **Wouter** for lightweight routing
- **React Query** for state management
- **Framer Motion** for smooth animations

### Backend (Node.js + Express)
- **Express** server with TypeScript
- **tRPC** for type-safe API calls
- **Drizzle ORM** with MySQL database
- **JWT** authentication with cookies
- **AWS SDK** for S3 storage

### AI & Processing
- **OpenAI GPT-4 Vision** for chart recognition
- **Custom algorithms** for astrological calculations
- **PDF generation** with jsPDF

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- MySQL database
- AWS S3 bucket (for image storage)
- OpenAI API key (for GPT-4 Vision)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RajanthaR/web-manus-porondam-ai.git
cd web-manus-porondam-ai
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL=mysql://username:password@localhost:3306/porondam_ai

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-s3-bucket-name

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Application
NODE_ENV=development
PORT=3000
```

4. **Database Setup**
```bash
# Generate and run migrations
pnpm db:push
```

5. **Start Development Server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
web-manus-porondam-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── styles/        # Global styles
├── server/                # Node.js backend
│   ├── _core/            # Core server setup
│   ├── routers.ts        # tRPC routes
│   ├── db.ts             # Database connection
│   ├── astrology.ts      # Astrological calculations
│   └── horoscopeProcessor.ts  # Image processing
├── drizzle/              # Database schema and migrations
├── shared/               # Shared types and utilities
└── patches/              # Package patches
```

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Tests include:
- Nakshatra calculations
- Rashi calculations
- Porondam score calculations
- Overall compatibility scoring

## 📦 Build & Deployment

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secure secret for JWT tokens
- `AWS_*` - AWS S3 credentials
- `OPENAI_API_KEY` - OpenAI API key
- `NODE_ENV=production`

## 🤝 Contributing

This project is privately owned and maintained. All rights are reserved by the owner.

## 📄 License

Copyright © 2024 Rajantha R Ambegala. All rights reserved.

This project is proprietary software and may not be distributed, modified, or used for commercial purposes without explicit written permission from the owner.

## 👤 Author

**Rajantha R Ambegala**
- GitHub: [@RajanthaR](https://github.com/RajanthaR/)
- Email: rajantha.rc@gmail.com

## 🙏 Acknowledgments

- Traditional Sri Lankan astrological principles
- OpenAI for GPT-4 Vision API
- The open-source community for the amazing tools and libraries

---

⚠️ **Important**: This application uses traditional astrological methods for entertainment and cultural purposes. Results should not be considered as professional advice.
