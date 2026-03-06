# AI Content Planner

A production-ready AI Content Planner SaaS built with React, Vite, TailwindCSS, and InsForge.

## 🚀 Features

- **User Authentication**: Secure login and signup flows via InsForge Auth.
- **AI Content Generation**: Turn simple topics into full-fledged content ideas.
- **Real-time Database**: Save, update, and manage your content ideas instantly.
- **Modern UI**: Beautiful design built with TailwindCSS and Lucide React icons.

## 🛠️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **InsForge Account**: Sign up at [InsForge Dashboard](https://insforge.dev) to obtain your backend credentials.

## ⚙️ Complete Setup Steps

### 1. Clone the Project
Open your terminal and clone the repository (or navigate into the project directory if already cloned):
```bash
git clone <repository-url>
cd ai-content-planner
```

### 2. Install Dependencies
Install all required Node modules using npm:
```bash
npm install
```

### 3. Setup InsForge Backend
1. Go to the [InsForge Dashboard](https://insforge.dev).
2. Create a new project or select an existing one.
3. In your project settings, locate your **API Base URL** and **Anonymous Key**.
4. Set up any necessary database tables (e.g., `ideas`, `users`) as required by the application via the InsForge database panel.

### 4. Configure Environment Variables
The application uses environment variables to connect to InsForge.
1. Copy the example environment file to create your own configuration:
   ```bash
   cp env.example .env
   ```
2. Open the `.env` file and replace the placeholder values with your actual InsForge credentials:
   ```env
   VITE_INSFORGE_BASE_URL=https://your-app.region.insforge.app
   VITE_INSFORGE_ANON_KEY=your_insforge_anon_key_here
   ```

### 5. Start the Development Server
Run the project locally to start developing:
```bash
npm run dev
```
The app will automatically open in your browser, typically at `http://localhost:5173`.

### 6. Build for Production
When you are ready to deploy your application, create a production build:
```bash
npm run build
```
The optimized files will be generated in the `dist` directory, ready to be hosted on platforms like Vercel, Netlify, or any static file host.

## 📚 Technologies Used

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Backend/Platform**: [InsForge SDK](https://insforge.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

- The Project is Deployed in: https://pvns8pz7.insforge.site
