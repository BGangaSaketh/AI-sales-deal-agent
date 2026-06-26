# Deployment Guide

This guide outlines how to deploy the **AI Sales Deal Intelligence Agent** application to production. 

The application is structured into:
1. **Database**: Supabase (PostgreSQL)
2. **Backend**: Python FastAPI (deployed using Docker)
3. **Frontend**: Next.js (deployed to Vercel)

---

## 1. Database Setup (Supabase)

The backend expects a PostgreSQL database connection. You can use **Supabase Cloud** for a free managed PostgreSQL database.

1. Sign up/log in at [Supabase](https://supabase.com/).
2. Create a new project.
3. Once the database is ready, go to **Project Settings** -> **Database**.
4. Find the **Connection string** (URI format) and copy it. It will look like this:
   `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres`
5. Keep this connection string handy as you will need it for the backend environment variables (`DATABASE_URL`).

---

## 2. Backend Deployment (Render / Railway / Fly.io)

Because the backend is a persistent Python FastAPI app, it should be deployed using the containerized config (`backend/Dockerfile`).

### Option A: Deploying on Render (Recommended)
1. Sign up/log in at [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `ai-sales-deal-backend`
   - **Root Directory**: `backend` (Important: must be set to `backend`)
   - **Language**: `Docker` (Render will automatically detect the `Dockerfile` inside the root directory you specified)
   - **Instance Type**: Free (or any tier)
5. Add the following **Environment Variables** under the "Environment" tab:
   - `PORT`: `8000` (Render overrides this automatically, but good to have)
   - `DATABASE_URL`: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres` (from Supabase)
   - `SUPABASE_URL`: `<your-supabase-project-url>` (optional, if you use Supabase auth/storage integrations)
   - `SUPABASE_KEY`: `<your-supabase-anon-key>` (optional)
6. Click **Deploy Web Service**. Render will build the Docker container and provide a public URL (e.g. `https://ai-sales-deal-backend.onrender.com`).
7. Note down your backend URL. Your API URL is `https://ai-sales-deal-backend.onrender.com/api/v1`.

### Option B: Deploying on Railway
1. Sign up/log in at [Railway](https://railway.app/).
2. Create a new project and select **Deploy from GitHub repo**.
3. Choose your repository.
4. In the service settings:
   - Go to **Settings** -> **General** -> **Root Directory** and set it to `/backend`.
   - Railway will automatically detect the `Dockerfile` and build it.
5. In the **Variables** tab, add your environment variables:
   - `DATABASE_URL` (your Supabase URL)
   - `PORT` (Railway automatically handles port binding, but you can set it)
6. Generate a domain under **Settings** -> **Public Networking**.

---

## 3. Frontend Deployment (Vercel)

1. Sign up/log in at [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project** and import your GitHub repository.
3. In the configure screen:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click "Edit" and choose the `frontend` folder (Important: select the nested `frontend` folder).
4. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: `https://<your-deployed-backend-domain>/api/v1` (e.g. `https://ai-sales-deal-backend.onrender.com/api/v1`)
5. Click **Deploy**. Vercel will build and deploy the Next.js frontend and provide your production URL.

---

## Environment Variables Reference

### Backend
| Variable Name | Description | Example / Recommended Value |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL Connection URI | `postgresql://postgres:password@db.supabase.co:5432/postgres` |
| `PORT` | Port for FastAPI server to bind | `8000` (or injected by host platform) |
| `SUPABASE_URL` | Supabase API URL | `https://your-project.supabase.co` (optional) |
| `SUPABASE_KEY` | Supabase Service/Anon Key | `your-supabase-key` (optional) |

### Frontend
| Variable Name | Description | Example / Recommended Value |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | The public base URL of your deployed backend | `https://ai-sales-deal-backend.onrender.com/api/v1` |
