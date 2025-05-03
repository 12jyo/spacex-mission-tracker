# spacex-mission-tracker

# 🚀 SpaceX Mission Tracker

A React-based application that fetches and displays launch data from the [SpaceX API](https://github.com/r-spacex/SpaceX-API), featuring authentication, enriched detail views, and deep linking. Built with Mantine UI, React Query, Zustand, and React Router.

## ✨ Features

- 🔐 **Authentication**
  - Mock login with persistent client-side authentication (using `localStorage`).
  - Redirects unauthenticated users to the login page.

- 📋 **Launch List**
  - Displays a searchable list of SpaceX launches.
  - Data fetched with React Query for caching and loading state management.
  - Clean, responsive table layout using Mantine UI.

- 🔍 **Launch Details**
  - Detailed view of individual launch missions.
  - Includes rocket name and launch success.
  - Enriched with additional data via a second API call (rocket details).

- 🌐 **Deep Linking**
  - URL-based navigation for launch detail pages (e.g., `/launch/launch_id`).
  - Enables direct access to detail views.

## 🧰 Tech Stack

- React + TypeScript
- Mantine UI
- Zustand (for auth state)
- React Query (for fetching and caching)
- React Router

## 📁 Folder Structure

src/
├── components/
│ └── Landing.tsx
├── pages/
│ ├── LaunchDetail.tsx
│ └── LaunchList.tsx
├── store/
│ └── auth.tsx
├── styles/
│ ├── Landing.scss
│ ├── LaunchDetail.css
│ └── LaunchList.css
├── theme/
│ └── index.ts
├── App.tsx
├── main.tsx
├── style.scss
├── vite-env.d.ts


## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1. Clone the repo:
   git clone https://github.com/12jyo/spacex-mission-tracker.git
   cd spacex-mission-tracker

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev
