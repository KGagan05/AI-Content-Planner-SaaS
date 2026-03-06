# AI Content Projects Setup

A production-ready setup guide for AI Content planning projects, utilizing React, Vite, TailwindCSS, and InsForge.

## 🚀 Overview
This guide provides the complete setup steps needed to initialize, configure, and run your AI Content project locally.

## 🛠️ Prerequisites
- **Node.js** (v18 or higher recommended)
- **InsForge Account**: Sign up at [InsForge Dashboard](https://insforge.dev) to configure your backend database, AI generation tools, and API keys.

---

## ⚙️ Complete Setup Steps

### 1. Initialize the Project
Navigate into your project folder. If you are starting fresh or cloning:
```bash
git clone <repository-url>
cd <project-directory-name>
```

### 2. Install Dependencies
Run the standard Node Package Manager command to install all standard and dev dependencies:
```bash
npm install
```

### 3. Configure the InsForge Backend
1. Log into your [InsForge Dashboard](https://insforge.dev).
2. Create a new InsForge project.
3. In the project settings, retrieve your **API Base URL** and **Anonymous Key**.
4. Initialize the required Database tables (for example: `ideas` and profiles).

### 4. Setup Environment Variables
Connect your local frontend project to the InsForge backend using environment variables.
1. Create a `.env` file at the root of your project (you can copy `.env.example` if it exists):
   ```bash
   cp env.example .env
   ```
2. Paste your InsForge credentials inside the `.env` file:
   ```env
   VITE_INSFORGE_BASE_URL=https://your-app.region.insforge.app
   VITE_INSFORGE_ANON_KEY=your_insforge_anon_key_here
   ```

### 5. Run the Local Development Server
To launch the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will be accessible locally at `http://localhost:5173`.

### 6. Build for Production
To bundle and optimize the AI project for production deployment:
```bash
npm run build
```
This generates a `dist` folder, which can be deployed to any static hosting service like Vercel, Netlify, or AWS S3.

## 📚 Tech Stack Reference
- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend as a Service & AI Tools**: InsForge
