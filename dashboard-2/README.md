# 🏥 Swaasthya Saathi - Your Health Companion

<div align="center">
  <img src="public/favicon.svg" alt="Swaasthya Saathi Logo" width="80" height="80">
  
  **A comprehensive health dashboard for managing your medical records, finding nearby hospitals, and tracking vital signs.**
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-blue?logo=tailwindcss)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## ✨ Features

### 🏠 **Dashboard**
- **Health Overview**: Quick access to prescription count and recent vitals
- **Multilingual Support**: Available in English, Hindi, and Tamil
- **Responsive Design**: Optimized for desktop and mobile devices
- **Low Data Mode**: Efficient data usage for slower connections

### 📋 **Prescription Management**
- View and manage your prescription history
- Organized medication tracking
- Easy access to prescription details

### 🏥 **Hospital Finder**
- **Real-time Hospital Data**: Live data from OpenStreetMap
- **Interactive Map**: Leaflet-powered map with hospital markers
- **Detailed Hospital Information**: 
  - Contact details (phone, email, website)
  - Hospital specialties and services
  - Operating hours and emergency availability
  - Ratings and reviews
  - Google Maps integration for directions
- **Multilingual Hospital Names**: Hospital names and details in your preferred language
- **Distance Calculation**: Shows distance from your location

### 📊 **Vitals Tracking**
- Monitor your vital signs
- Track health metrics over time
- Visual representation of health data

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdullah-426/Swaasthya-Saathi-dashboard
   cd Swaasthya-Saathi-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Maps**: Leaflet.js with React Leaflet
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🌍 Internationalization

The application supports multiple languages:
- **English** (en)
- **Hindi** (hi)
- **Tamil** (ta)

All hospital names, addresses, and UI elements are translated based on user preference.

## 🏥 Hospital Data

### Real-time Data Sources
- **OpenStreetMap**: Live hospital data via Overpass API
- **Geolocation**: Automatic location detection
- **Fallback Data**: Mock data for demonstration

### Hospital Information Includes
- Contact details (phone, email, website)
- Medical specialties and services
- Operating hours and emergency availability
- User ratings and reviews
- Distance from your location
- Google Maps integration

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Adapted layout and navigation
- **Mobile**: Touch-friendly interface with mobile menu

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── MapClient.tsx   # Interactive map component
│   └── ...
├── contexts/           # React contexts
│   └── LanguageContext.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase configuration
│   ├── i18n.ts         # Internationalization
│   ├── queries.ts      # Data fetching
│   └── hospitalScraper.ts # Hospital data enhancement
├── pages/              # Page components
│   ├── Index.tsx       # Dashboard
│   ├── Hospitals.tsx   # Hospital finder
│   ├── Prescriptions.tsx
│   └── Vitals.tsx
└── assets/             # Static assets
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** for providing free hospital data
- **Leaflet** for the interactive mapping solution
- **shadcn/ui** for the beautiful UI components
- **React Community** for the amazing ecosystem

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at support@swaasthyasaathi.com

---

<div align="center">
  Made with ❤️ for better healthcare accessibility
  
  **Swaasthya Saathi** - Your Health Companion
</div>
