# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SkipWise** is a fully implemented temptation resistance tracking app built with Next.js. The app helps users track spending temptations, log resistance/indulgence decisions, and visualize financial savings through a privacy-first, local-only approach.

### Core Concept
Users log spending temptations in real-time (amount + description) and mark whether they resisted or gave in. The app uses advanced AI categorization with semantic scoring to organize temptations across 19 detailed categories and provides insights on savings and resistance patterns.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Technology Stack & Architecture

### Framework & Core
- **Next.js 15** with App Router (`app/` directory structure)
- **TypeScript** with strict mode enabled
- **React 19** with modern patterns and hooks
- **Tailwind CSS 4** for styling with custom animations

### Data & Storage
- **IndexedDB** for offline-first local data persistence
- **Custom storage layer** (`lib/storage.ts`) with full CRUD operations
- **Type-safe data models** for temptations, categories, and user progress

### UI Components
- **shadcn/ui** component library (Button, Card, Input, Textarea, Switch, Progress, Badge)
- **Radix UI** primitives for accessibility (@radix-ui/react-progress, @radix-ui/react-switch)
- **Lucide React** for icons with semantic category icons
- **CVA (Class Variance Authority)** for component variants

### Key Dependencies
- `clsx` + `tailwind-merge` for conditional styling (via `cn()` utility)
- **TensorFlow.js** for client-side AI categorization with semantic scoring
- Advanced AI categorization with weighted patterns, brand recognition, and contextual hints
- Real-time progress calculations and statistics
- **Multi-currency support** with 30+ global currencies
- **Haptic feedback system** for enhanced mobile interactions

## Project Structure

```
app/
├── layout.tsx          # Root layout with PWA metadata
├── page.tsx            # Home screen (Resist) - main dashboard
├── insights/page.tsx   # Insights screen with AI analysis
├── history/page.tsx    # History screen with search/filters
├── settings/page.tsx   # Settings screen with data management
└── globals.css         # Global styles with custom animations

components/
├── ui/                 # shadcn/ui components
│   ├── button.tsx      # Button with variants
│   ├── card.tsx        # Card layouts
│   ├── input.tsx       # Form inputs
│   ├── textarea.tsx    # Multi-line inputs
│   ├── switch.tsx      # Toggle switches
│   ├── progress.tsx    # Progress bars
│   └── badge.tsx       # Labels and tags
├── bottom-nav.tsx      # Bottom tab navigation
├── category-icon.tsx   # Category-specific icons (supports 19 categories)
├── progress-ring.tsx   # Circular progress component
├── new-temptation-modal.tsx  # Floating modal with AI categorization & manual override
├── theme-provider.tsx  # Global theme management and dark/light mode
└── service-worker.tsx  # PWA service worker registration

lib/
├── types.ts            # TypeScript interfaces and enums (19 categories, currencies)
├── storage.ts          # IndexedDB wrapper and database operations
├── calculations.ts     # Progress, streaks, statistics utilities, currency formatting
├── ai-categorization.ts # Advanced semantic scoring categorization with TensorFlow.js
├── settings.ts         # Global settings management (theme, currency, notifications)
├── haptics.ts          # Haptic feedback system for mobile interactions
└── utils.ts           # cn() utility and helpers
```

## Implemented Features

### ✅ Core Functionality (All Working)
- **4 Main Screens**: Home/Resist, Insights, History, Settings
- **Advanced Temptation Logging**: Floating modal with intelligent form, real-time AI predictions
- **Resistance Tracking**: Toggle for resisted/gave-in with haptic feedback and visual responses
- **Enhanced AI Categorization**: Semantic scoring across 19 comprehensive categories with manual override
  - Food & Dining, Coffee, Shopping, Clothes, Electronics, Entertainment
  - Books & Education, Beauty & Wellness, Home & Garden, Sports & Fitness
  - Travel, Transportation, Subscriptions, Gifts & Charity, Health & Medical
  - Hobbies & Crafts, Alcohol & Tobacco, Gaming, Other
- **Multi-Currency Support**: 30+ global currencies with symbol and code display
- **Progress Dashboard**: Total saved, success rate, current streak with animated progress rings
- **Recent Activity**: Last 4 temptations with enhanced category icons and colors

### ✅ Data Management
- **Offline Storage**: Full IndexedDB implementation with data persistence
- **Global Settings System**: Persistent theme, currency, and notification preferences
- **Search & Filters**: History screen with text search, category, and status filters
- **Data Export**: JSON export functionality for user data
- **Data Clearing**: Complete data reset with confirmation

### ✅ Analytics & Insights
- **Category Analysis**: Spending patterns by category with success rates
- **AI Insights**: Personalized challenges and success recommendations
- **Statistics**: Monthly spending/saving totals, streak calculations
- **Visual Progress**: Animated progress bars and circular progress rings

### ✅ User Experience & Accessibility
- **Mobile-First Design**: Optimized for one-handed smartphone usage
- **Dark/Light/Auto Theme System**: Full theming support with system preference detection
- **Haptic Feedback**: Rich tactile feedback for mobile interactions (success, warning, error patterns)
- **PWA Features**: Service worker, manifest, offline functionality, app installation
- **Bottom Navigation**: Tab-based navigation between 4 main screens
- **Responsive Layout**: Works seamlessly on mobile and desktop
- **Custom Animations**: Smooth transitions and loading states
- **Enhanced Accessibility**: Screen reader support, keyboard navigation, high contrast theming

## Future Enhancement Opportunities

### Low Priority
- **Push Notifications**: Browser-based reminder system (settings UI ready)
- **Advanced Charts**: Interactive visualizations (D3.js, Chart.js integration)
- **Data Import**: JSON import functionality to complement export
- **Advanced AI**: Custom TensorFlow.js models for personalized categorization
- **Social Features**: Anonymous community challenges and leaderboards
- **Advanced Analytics**: Spending pattern predictions, trend analysis

## Development Patterns

### Component Architecture
- Use `'use client'` for all interactive components
- Initialize IndexedDB on component mount with `useEffect`
- Manage state with `useState` and real-time updates
- Handle async operations with proper error boundaries

### Data Flow
1. Components call `initializeDB()` on mount
2. Use `db.getTemptations()`, `db.addTemptation()` etc. for CRUD operations
3. Settings managed through global `SettingsManager` singleton
4. AI categorization with `categorizeTemptation()` async function
5. Calculate progress with utilities in `lib/calculations.ts`
6. Haptic feedback through `haptics.tap()`, `haptics.success()` etc.
7. Update UI state immediately for responsive UX

### Styling Conventions
- Mobile-first responsive design with Tailwind classes
- Use `cn()` utility for conditional styling
- Dark/light theme support through Tailwind's `dark:` prefix
- Custom animations defined in `globals.css`
- Consistent spacing with `space-y-*` and `gap-*` classes
- Semantic color usage (green for success, red for failure)
- Category-specific colors for visual organization (19 unique color schemes)

## Path Aliases

```typescript
"@/*": ["./*"]           # Root-relative imports
"@/components": "./components"
"@/lib": "./lib"
```

## Performance & Technical Notes

### Performance Optimizations
- IndexedDB operations are async and properly handled
- Components use React.memo and optimization patterns where beneficial
- 10-second logging goal achieved through streamlined UX
- Real-time AI categorization with semantic caching
- Service worker caching for offline performance
- Lazy loading and code splitting where applicable

### Privacy & Security
- All data processing happens client-side for complete privacy
- No data transmission to external servers
- Local storage with IndexedDB encryption-ready architecture
- Settings and preferences stored locally only

### AI & Machine Learning
- TensorFlow.js integration ready for advanced models
- Semantic scoring with weighted pattern matching
- Brand recognition and contextual understanding
- Multi-language support architecture in place
- Fallback systems for AI categorization failures