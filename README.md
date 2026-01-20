# Mosport V6

Welcome to the Mosport V6 engineering repository. This project is a modern React application built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build
Build the application for production:
```bash
npm run build
```
The output files will be in the `dist` directory.

## 🛠 Tech Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Heroicons (via SVG)

## 📦 Project Structure
```
src/
  ├── components/    # Reusable UI components (Navbar, DecisionCard, etc.)
  ├── services/      # Business logic (MoEngine)
  ├── constants.ts   # Mock data and configuration
  ├── types.ts       # TypeScript interfaces
  ├── App.tsx        # Main application layout and state
  └── main.tsx       # Entry point
```

## 🚢 Deployment
This repository is configured with GitHub Actions for automatic deployment to GitHub Pages.
- Pushes to `main` branch trigger a build and deploy.
- Ensure "Build and deployment" source is set to "GitHub Actions" in your repository Settings > Pages.

## 🛡️ Content Policy
This codebase includes filtering mechanisms to ensure safe and appropriate content delivery.
