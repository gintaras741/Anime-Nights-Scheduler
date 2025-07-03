# Anime Nights Scheduler

A full-stack web application for managing cosplay events and competitions at anime conventions. This system provides real-time scheduling and administrative tools for organizing cosplay contests and prejudge sessions. Made for the [Anime Nights](https://www.facebook.com/AnimeNights/) event.

## 🌟 Features

- **Real-time Schedule Management**: Live updates using WebSocket connections for instant schedule changes
- **Dual Event Types**: Separate management for main cosplay competitions and prejudge sessions
- **Administrative Controls**: 
  - Toggle visual highlights (glow effects) for current/next participants
  - Mark completed performances with crossed-out styling
  - Independent controls for cosplay and prejudge events
- **User Authentication**: Secure profile management system
- **Responsive Design**: Mobile-friendly interface optimized for convention floor use
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Sequelize ORM** with **SQLite** database
- **Socket.IO** for real-time updates

### Frontend
- **React 19** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** with **shadcn/ui** components
- **React Hook Form** with **Zod** validation
- **TanStack Query** for data fetching
- **Socket.IO Client** for real-time updates
- **React Router** for navigation

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gintaras741/Anime-Nights-Scheduler/
   cd anime-nights-scheduler
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   PORT=3000
   ```

5. **Start the development servers**
   
   **Backend** (from `/server` directory):
   ```bash
   npm run dev
   ```
   
   **Frontend** (from `/client` directory):
   ```bash
   npm run dev
   ```

## 🎯 Real-time Features

The application uses **Socket.IO** to provide instant updates when:
- New cosplayers register for events
- Existing registrations are modified
- Administrative controls are used (glow/crossed-out toggles)
- Schedule changes are made

## 👥 User Roles

### Participants
- View current schedules
- View their own profile information

### Administrators
- View all registrations with control options
- Toggle visual highlights for current/next performers
- Mark completed performances
- Real-time schedule management

## 🎨 UI Components

Built with modern design patterns using:
- **shadcn/ui** for consistent component library
- **Tailwind CSS** for utility-first styling
- **Lucide React** for icons
- **Dark/Light mode** support with theme switching
- **Responsive design** for mobile and desktop

## 📱 Mobile Optimization

Designed specifically for convention environments:
- Touch-friendly interface
- Responsive layout for various screen sizes
- Optimized for quick updates on mobile devices
