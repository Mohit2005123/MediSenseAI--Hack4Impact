# Swaasthya-Saathi Dashboard

A mobile-first medical dashboard designed for rural healthcare in India. Built with Next.js, Tailwind CSS, NextUI, and Aceternity UI components.

## 🏥 Features

### 📱 Mobile-First Design
- Optimized for phone screens with responsive design up to desktop
- Large touch targets and clear spacing
- High contrast colors for accessibility
- Minimal text with visual icons and emojis

### 💊 Prescription Management
- **Past Prescriptions Carousel**: Browse through prescription history
- **Visual Summary Modal**: Detailed view with medicine icons, dosage, and timing
- **Download PDF**: Export prescriptions as PDF
- **Share via WhatsApp**: Quick sharing functionality
- **Set Reminders**: Medication reminder system

### 🗺️ Nearby Medical Stores
- **Interactive Map**: OpenStreetMap integration with react-leaflet
- **Store Markers**: Clustered markers with real-time status
- **Distance & Rating**: Show store distance and ratings
- **Open/Closed Status**: Real-time store availability
- **Directions**: Get directions to selected stores

### 📊 Health Snapshot
- **Today's Medicines**: Count of medications to take
- **Next Refill**: Days until next prescription refill
- **Last Consultation**: Recent doctor visit information
- **Alerts**: Important health notifications

### ⚡ Quick Actions
- **New Query**: Ask health-related questions
- **Scan Prescription**: Upload and analyze prescriptions
- **Call Help**: Emergency support contact
- **Health Records**: View medical history
- **Book Appointment**: Schedule doctor visits
- **Help & Support**: Get assistance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swasthya-saathi-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **JavaScript** - No TypeScript (as requested)

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **NextUI** - Modern React UI library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Maps & Visualization
- **React Leaflet** - Map components
- **OpenStreetMap** - Free map tiles
- **Leaflet** - Interactive maps

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
swasthya-saathi-dashboard/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout
│   └── page.js              # Main dashboard page
├── components/
│   ├── DashboardHeader.js   # Header with logo and actions
│   ├── HealthSnapshotCards.js # Health overview cards
│   ├── PrescriptionsCarousel.js # Prescription carousel
│   ├── PrescriptionModal.js # Prescription detail modal
│   ├── NearbyStoresMap.js   # Map with medical stores
│   └── QuickActions.js      # Quick action buttons
├── lib/
│   ├── samplePrescriptions.js # Mock prescription data
│   ├── sampleStores.js      # Mock medical store data
│   └── utils.js             # Utility functions
├── public/                  # Static assets
├── package.json
├── tailwind.config.js       # Tailwind configuration
├── next.config.js          # Next.js configuration
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#0ea5e9) - Trust and healthcare
- **Success**: Green (#22c55e) - Health and positive actions
- **Warning**: Orange (#f59e0b) - Caution and refills
- **Danger**: Red (#ef4444) - Alerts and emergencies
- **Secondary**: Gray (#64748b) - Neutral elements

### Typography
- **Font**: Inter (Google Fonts)
- **Hero**: 2xl, bold - Main headings
- **Section**: lg, semibold - Section titles
- **Body**: base, normal - Regular text
- **Small**: sm, normal - Secondary text

### Spacing & Layout
- **Mobile-first**: 4px base unit
- **Touch targets**: Minimum 44px
- **Card padding**: 16px (p-4)
- **Section spacing**: 24px (space-y-6)

## 📱 Mobile Optimization

### Touch-Friendly Design
- Large buttons (minimum 44px)
- Generous spacing between interactive elements
- Swipe gestures for carousel navigation
- Bottom sheet modals for mobile UX

### Performance
- Dynamic imports for map components
- Optimized images and icons
- Minimal JavaScript bundle
- Fast loading with Next.js optimizations

### Accessibility
- High contrast colors
- Large, readable fonts
- Clear visual hierarchy
- Screen reader friendly
- Keyboard navigation support

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
# Optional: Google Maps API key (if switching from OpenStreetMap)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Customization

#### Adding New Prescription Fields
Edit `lib/samplePrescriptions.js` to add new fields:

```javascript
{
  id: 'new-id',
  // ... existing fields
  newField: 'new value'
}
```

#### Modifying Store Data
Edit `lib/sampleStores.js` to update store information:

```javascript
{
  id: 'new-store',
  name: 'New Store Name',
  // ... other fields
}
```

#### Styling Customization
Modify `tailwind.config.js` for theme changes:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `out` folder
- **AWS Amplify**: Connect GitHub repository
- **Railway**: Deploy with `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real API integration
- [ ] User authentication
- [ ] Offline support with PWA
- [ ] Push notifications
- [ ] Multi-language support (Hindi/English)
- [ ] Voice commands
- [ ] AI-powered health insights
- [ ] Telemedicine integration

---

**Built with ❤️ for rural healthcare in India**
