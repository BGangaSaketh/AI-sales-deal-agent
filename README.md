# Executive AI OS: AI Sales Deal Intelligence Agent

An intelligent Sales Deal CRM and Analytics system designed to monitor transaction cycles, track customer health, automate meeting synchs, analyze objections, and provide real-time AI-driven deal intelligence. Built using a modern monorepo structure with a Python FastAPI backend and a Next.js (React) frontend.

---

## 🖥️ Application Demo & Screenshots

### 🎥 Video Demonstration
Watch a full walkthrough of the CRM and AI Deal Intelligence Engine:

[**Play / Download Demo Video**](demo.mp4)

<video src="demo.mp4" width="100%" controls></video>

---



### 📊 Executive Deal Dashboard
Comprehensive analytics featuring Pipeline Value, Closed-Won revenue, Active Deals, Win Rates, and real-time activity logs.
![Executive Deal Dashboard](screenshots/overview.png)

### 🤝 Deals Pipeline
Visual kanban board for transaction cycles, contract values, and deal health tracking.
![Deals Pipeline](screenshots/deals.png)

### 👥 Accounts Directory
Manage customer profiles, contact info, and classifications (e.g., industry, company size, status).
![Accounts Directory](screenshots/customers.png)

### 📅 Client Meetings
Schedule customer briefings, sync calendars, and preview AI-compiled meeting summaries.
![Client Meetings](screenshots/meetings.png)

### 🧠 AI Intelligence Center (Memory & Objections)
Unified intelligence workspace compiling hindsight customer memory, meeting transcript synthetics, risk analysis, objections, and smart recommendations.
![AI Intelligence Center](screenshots/memory.png)


---

## 📐 System Architecture

Below is the design and data flow architecture of the Executive AI OS, from audio ingestion to real-time dashboard updates:

![System Architecture](screenshots/architecture.png)

---

## 🛠️ Technology Stack


- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Zustand (State Management)
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Uvicorn, PostgreSQL (Supabase)
- **Database**: Supabase PostgreSQL

---

## 📂 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── core/           # Config and database connection setups
│   │   ├── services/       # AI Services (LLM, Speech, Memory, Objection Services)
│   │   └── main.py         # FastAPI main router and routes definitions
│   ├── Dockerfile          # Container config for backend
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── app/                # Next.js pages and routing
│   ├── components/         # Reusable UI component libraries
│   ├── providers/          # Theme and application providers
│   ├── services/           # Backend API integration layer
│   └── package.json        # Frontend node dependencies
├── supabase/               # Supabase migrations and configurations
├── screenshots/            # App view screenshots
├── DEPLOYMENT.md           # Production deployment guide
└── vercel.json             # Vercel deployment configurations
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [Python](https://www.python.org/) (v3.10 or higher recommended)
- [Supabase Account](https://supabase.com/) (for PostgreSQL database)

---

### 1. Database Setup

Create a Supabase project and get your PostgreSQL connection URI.
Initialize database schemas (handled automatically on FastAPI startup, or you can run migrations).

---

### 2. Automated Setup (Recommended Quickstart)

The repository provides an automated, cross-platform setup script that installs frontend dependencies, creates the backend virtual environment, installs backend pip packages, and generates default `.env` files.

From the repository root, run:
```bash
npm run setup
```

To start the application:
- **Backend (FastAPI)**: Run `npm run dev:backend` from the root.
- **Frontend (Next.js)**: Run `npm run dev:frontend` from the root.

---

### 3. Manual Setup & Run (Alternative)

If you prefer to configure the components manually, follow the instructions below:

#### A. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```
3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     source .venv/bin/activate
     ```
4. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Set up environment variables. Create a `.env` file in the `backend` folder based on `.env.example`:
   ```ini
   DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
   PORT=8000
   ```
6. Run the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   The backend will be running at `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

#### B. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env.local` file in the `frontend` folder:
   ```ini
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:3000`.

---

## 🚢 Deployment

For details on deploying the application to cloud platforms (like Vercel for frontend and Render/Railway for backend), please refer to the detailed [Deployment Guide](DEPLOYMENT.md).
