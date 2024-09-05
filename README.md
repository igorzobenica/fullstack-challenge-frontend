# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# Course Finder Frontend

This project is a frontend application for the Course Finder, built with React, TypeScript, and Vite. It provides a user interface to explore, filter, and view details of courses.

## Features

- **Course List** - Browse and filter courses based on various criteria.
- **Course Details** - View detailed information about a specific course.
- **Filters** - Filter courses by location, category, delivery method, and more.

## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Navigate to the frontend directory:

   ```bash
   cd your-repo-name/frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root of the frontend directory with the following content:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

### Testing

Run tests with:

```bash
npm test
```

# Fullstack Challenge Frontend (React + Vite)

This is the frontend for the Fullstack Challenge project, built using React and Vite. The app uses Firebase Authentication for user login and interacts with Firebase Cloud Functions for managing user profiles.

## Features

- Firebase Authentication (Phone Authentication)
- Profile management (save and fetch user profiles)
- Responsive UI using custom UI components
- Environment variables for Firebase configuration
- Deployed on Netlify

## Deployed App

You can access the deployed app at the following URL:

**[Deployed App on Netlify](https://main--charming-frangollo-fa6fb4.netlify.app/)**

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v18 or above)
- A Firebase Project with Authentication enabled
- A deployed instance of Firebase Cloud Functions (for API requests)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/fullstack-challenge-frontend.git
cd fullstack-challenge-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

Create a .env file in the root of the project and add the following Firebase configuration (these values should match your Firebase project settings):

```makefile
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_API_ENDPOINT=https://us-central1-your_project_id.cloudfunctions.net/app
```

Ensure that the VITE_FIREBASE_API_ENDPOINT points to your deployed Firebase Cloud Functions URL.

### 4. Local Development

To start the development server, run:

```bash
npm run dev
```

The app will be available at http://localhost:5173.

### 5. Environment Variables on Netlify

Make sure to add the same environment variables in your Netlify project settings:

1. Go to your Netlify dashboard.
2. Navigate to Site Settings -> Build & Deploy -> Environment Variables.
3. Add your Firebase configuration variables (VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.).

### 6. Production Build

To build the app for production, run:

```bash
npm run build
```

The output will be in the dist directory, which can be deployed to any static hosting service like Netlify.

### 7. Deployment to Netlify

1. Connect your GitHub repository to Netlify.

2. Set the Build Command to:

```bash
npm run build
```

3. Set the Publish Directory to:

```bash
dist
```

4. Add the following redirect rule to handle SPA routing:

```bash
/* /index.html 200
```

This rule should be added to a file named \_redirects in the public folder of your project.
