# SwiftApply.ai

A powerful AI-powered job application platform that automates job searching, resume optimization, and application tracking to help you land your dream job faster.

## Features

- **Job Search**: Search and filter jobs scraped from Greenhouse job board
- **Resume Generator**: Create professional resumes with user input
- **Application Tracking**: Track job applications and their status
- **Dashboard**: View statistics and application overview
- **Clean UI**: Modern, responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Python Flask with BeautifulSoup for web scraping
- **Job Source**: Greenhouse job board (https://my.greenhouse.io/jobs)
- **Storage**: In-memory storage for MVP (easily replaceable with database)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Internet connection for job scraping

### 1. Clone and Setup

```bash
git clone <repository-url>
cd job-apply-mvp
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The backend will be available at `https://localhost:5000`

## Project Structure

```
job-apply-mvp/
├── app/                    # Next.js frontend
│   ├── components/        # React components
│   │   ├── Dashboard.tsx      # Dashboard with statistics
│   │   ├── JobSearch.tsx      # Job search and filtering
│   │   ├── ResumeGenerator.tsx # Resume creation tool
│   │   └── JobApply.tsx       # Application tracking
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page with tab navigation
├── backend/               # Python Flask backend
│   ├── app.py            # Main Flask application with job scraper
│   └── requirements.txt  # Python dependencies
├── package.json           # Node.js dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if the backend is running

### Job Management
- `GET /api/jobs` - Get all scraped jobs
- `POST /api/jobs/search` - Search jobs with filters
- `POST /api/jobs/scrape` - Force new job scrape

### Resume Generation
- `POST /api/resume/generate` - Generate resume (template-based for MVP)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## How It Works

### Job Scraping
1. **Target**: Scrapes jobs from https://my.greenhouse.io/jobs
2. **Method**: Uses BeautifulSoup to parse HTML and extract job information
3. **Data**: Captures job title, company, location, salary, URL, and posted date
4. **Respectful**: Includes proper User-Agent headers and reasonable request intervals

### Job Search
- Real-time filtering by job title, company, and location
- Automatic refresh with configurable intervals
- Clean, card-based job display

### Resume Generation
- Simple form-based resume creation
- Template-based generation for MVP
- Download and copy functionality

### Application Tracking
- Manual application entry and status tracking
- Status updates (pending, submitted, interviewing, rejected, accepted)
- Notes and application history

## Development Roadmap

### ✅ Completed (MVP)
- [x] Clean, focused project structure
- [x] Job scraping from Greenhouse
- [x] Job search and filtering interface
- [x] Basic resume generation
- [x] Application tracking system
- [x] Dashboard with statistics
- [x] Responsive UI with Tailwind CSS

### 🔄 Future Enhancements
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] OpenAI GPT integration for resume generation
- [ ] Automated job application submission
- [ ] Email notifications
- [ ] Google Sheets integration
- [ ] User authentication
- [ ] Advanced job matching algorithms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
