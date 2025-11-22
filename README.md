# HiddenGems - Hidden Gem Discovery App

A modern React + Vite application for discovering hidden gems (cafes, restaurants, hotels, and more) in your area with interactive maps, favorites, and wishlist features.

## 🎯 Features

- **Authentication** - Signup/Login with profile management (client-side localStorage)
- **Interactive Maps** - Real-time map view with geolocation support using react-leaflet
- **Search & Filter** - Filter gems by category (cafes, hotels, restaurants, etc.)
- **Save & Wishlist** - Save favorite gems and create wishlists
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI** - Warm/earthy color palette with smooth animations

## 🚀 Quick Start

### Installation

\`\`\`bash
npm install
\`\`\`

### Setup

1. Create a `.env` file in the project root:
\`\`\`
VITE_GEOAPIFY_KEY=your_geoapify_api_key_here
\`\`\`

Get a free Geoapify API key at: https://www.geoapify.com/

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open your browser to `http://localhost:5173`

### Building for Production

\`\`\`bash
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/        # React components
│   ├── TopNav.jsx
│   ├── Sidebar.jsx
│   ├── MapBox.jsx
│   ├── GemMarker.jsx
│   ├── AuthForm.jsx
│   ├── ProfileMenu.jsx
│   ├── AnimatedButton.jsx
│   └── AddSpotForm.jsx
├── pages/            # Page components
│   ├── Landing.jsx
│   ├── Auth.jsx
│   ├── Main.jsx
│   └── Profile.jsx
├── data/             # Mock data
│   └── sampleGems.js
├── utils/            # Utility functions
│   ├── storage.js
│   ├── geolocation.js
│   └── validation.js
├── styles/           # CSS files
│   ├── variables.css
│   ├── main.css
│   ├── landing.css
│   ├── auth.css
│   ├── authform.css
│   ├── topnav.css
│   ├── sidebar.css
│   ├── mapbox.css
│   ├── gem-marker.css
│   ├── profile.css
│   ├── profile-menu.css
│   ├── animated-button.css
│   └── add-spot-form.css
├── App.jsx           # Main app component
└── index.jsx         # Entry point
\`\`\`

## 🔐 Authentication & Backend Integration

### Current Implementation
- Uses `localStorage` for mock authentication
- User data stored client-side only

### TODO: Real Backend Integration
Replace localStorage calls in these files:
1. `src/pages/Auth.jsx` - Replace with API calls to `/api/auth/signup` and `/api/auth/login`
2. `src/components/AuthForm.jsx` - Replace with real API calls (marked with TODO comments)
3. `src/pages/Main.jsx` - Add API calls for saving gems and wishlist operations
4. `src/utils/storage.js` - Replace with real API calls

Example backend integration point:
\`\`\`javascript
// Current (client-side)
localStorage.setItem('user', JSON.stringify(formData))

// TODO: Replace with
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
\`\`\`

## 🗺️ Map Integration

### Geoapify Setup
- Uses Geoapify for map tiles and geolocation
- API key goes in `.env` file: `VITE_GEOAPIFY_KEY`
- Free tier available at: https://www.geoapify.com/

### Features
- Automatic geolocation detection
- Map expand/collapse functionality
- Interactive markers with details
- Fallback location (San Francisco) if geolocation denied

## 🎨 Theme & Styling

### Color Palette
- **Background:** `#f7f4ef` (Warm sand)
- **Accent:** `#0f766e` (Deep teal)
- **Accent 2:** `#fb7185` (Coral)
- **Text:** `#1a1a1a` (Near black)
- **Muted:** `#6b7280` (Slate)

All colors defined in `src/styles/variables.css` using CSS custom properties.

### Animations
- Smooth transitions (150-300ms)
- Respects `prefers-reduced-motion` for accessibility
- Hover effects on interactive elements
- Fade-in/slide-up animations on load

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels and roles for interactive elements
- Keyboard navigation support
- Focus indicators on all interactive elements
- Color contrast ratios meet WCAG standards
- Screen reader support with aria-label and aria-describedby

## 📱 Responsive Design

- **Desktop (>1024px)** - Full sidebar, expanded map
- **Tablet (640-1024px)** - Collapsed sidebar, responsive grid
- **Mobile (<640px)** - Bottom drawer navigation, full-width map

## 🔄 Data Flow

### Authentication Flow
1. User fills signup/login form
2. Client-side validation
3. Data stored in localStorage (TODO: Replace with API call)
4. User redirected to main app

### Gem Discovery Flow
1. Main page loads gems from `sampleGems.js` (TODO: Replace with API call)
2. User can filter by category or search
3. Click gem to see details
4. Save to favorites or add to wishlist
5. Data persisted in localStorage (TODO: Replace with real backend)

## 🛠️ Technologies Used

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **React Leaflet** - Interactive map component
- **Leaflet** - Mapping library
- **Geoapify** - Map tiles and geolocation API
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS custom properties

## 📝 Notes

- All component code includes TODO comments where real backend integration is needed
- Mock geolocation fallback to San Francisco
- All data currently stored client-side with localStorage
- Add proper error handling and loading states when connecting to real backend

## 🎓 Development Tips

1. **Hot Module Replacement** - Changes auto-reload in development
2. **CSS Variables** - Modify colors in `src/styles/variables.css`
3. **Component Structure** - Each component in its own file for easy refactoring
4. **localStorage Helpers** - Use `src/utils/storage.js` for consistent data access

## 📄 License

MIT

## 🤝 Contributing

Feel free to fork and submit pull requests for improvements!
