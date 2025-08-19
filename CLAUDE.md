# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SkipWise** is a fully implemented temptation resistance tracking app built with Next.js. The app helps users track spending temptations, log resistance/indulgence decisions, and visualize financial savings through a privacy-first, local-only approach.

### Core Concept
Users log spending temptations in real-time (amount + description) and mark whether they resisted or gave in. The app uses advanced AI categorization with semantic scoring to organize temptations across 19 built-in categories plus unlimited custom user-defined categories, providing insights on savings and resistance patterns.

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
- **Multi-currency support** with 30+ global currencies and improved formatting
- **Custom category system** with user-defined categories and AI integration
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
├── types.ts            # TypeScript interfaces and enums (19 built-in + custom categories, currencies)
├── storage.ts          # IndexedDB wrapper and database operations
├── calculations.ts     # Advanced analytics: patterns, trends, risks, recommendations, enhanced currency formatting
├── ai-categorization.ts # Advanced semantic scoring categorization with custom category support
├── settings.ts         # Global settings management (theme, currency, notifications, custom categories)
├── haptics.ts          # Haptic feedback system for mobile interactions
└── utils.ts           # cn() utility and helpers
```

## Implemented Features

### ✅ Core Functionality (All Working)
- **4 Main Screens**: Home/Resist, Insights, History, Settings
- **Advanced Temptation Logging**: Floating modal with intelligent form, real-time AI predictions
- **Resistance Tracking**: Toggle for resisted/gave-in with haptic feedback and visual responses
- **Enhanced AI Categorization**: Semantic scoring across 19 built-in categories plus unlimited custom categories
  - Built-in: Food & Dining, Coffee, Shopping, Clothes, Electronics, Entertainment
  - Books & Education, Beauty & Wellness, Home & Garden, Sports & Fitness
  - Travel, Transportation, Subscriptions, Gifts & Charity, Health & Medical
  - Hobbies & Crafts, Alcohol & Tobacco, Gaming, Other
  - Custom: User-defined categories with custom colors and AI integration
- **Multi-Currency Support**: 30+ global currencies with proper international formatting and symbol positioning
- **Progress Dashboard**: Total saved, success rate, current streak with animated progress rings
- **Recent Activity**: Last 4 temptations with enhanced category icons and colors

### ✅ Data Management
- **Offline Storage**: Full IndexedDB implementation with data persistence
- **Global Settings System**: Persistent theme, currency, notifications, and custom categories
- **Custom Category Management**: Add, edit, delete custom categories with color picker
- **Search & Filters**: History screen with text search, category, and status filters (supports custom categories)
- **Data Export**: JSON export functionality for user data including custom categories
- **Data Clearing**: Complete data reset with confirmation

### ✅ Advanced Analytics & Insights
- **Comprehensive Insights System**: 15+ meaningful insights vs basic category stats
- **Behavioral Pattern Analysis**: Peak temptation time/day identification, resistance rates by purchase amount
- **Trend Analysis**: Month-over-month comparisons with trend indicators, spending/savings trajectories
- **Smart Risk Assessment**: High-risk category identification, weekend spending pattern detection
- **Intelligent Recommendations**: Budget suggestions, time-based behavioral advice, category-specific strategies
- **Real-time Data Sync**: Auto-refresh insights with latest transaction data (5-second intervals + focus events)
- **Visual Analytics**: Color-coded priority system, gradient insight cards, mini progress visualizations
- **Actionable Intelligence**: Specific strategies like 24-hour rule, purchase approval systems, alternative suggestions

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
- **Predictive Analytics**: Machine learning-based spending predictions, goal achievement forecasts

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
4. AI categorization with `categorizeTemptation()` async function (supports custom categories)
5. Advanced analytics with utilities: `analyzeSpendingPatterns()`, `analyzeTrends()`, `assessRisks()`, `generateRecommendations()`
6. Real-time insights sync via focus/visibility events and periodic refresh (5-second intervals)
7. Custom category management through `SettingsManager` methods
8. Haptic feedback through `haptics.tap()`, `haptics.success()` etc.
9. Update UI state immediately for responsive UX

### Styling Conventions
- Mobile-first responsive design with Tailwind classes
- Use `cn()` utility for conditional styling
- Dark/light theme support through Tailwind's `dark:` prefix
- Custom animations defined in `globals.css`
- Consistent spacing with `space-y-*` and `gap-*` classes
- Semantic color usage (green for success, red for failure)
- Category-specific colors for visual organization (19 built-in + unlimited custom color schemes)

## Path Aliases

```typescript
"@/*": ["./*"]           # Root-relative imports
"@/components": "./components"
"@/lib": "./lib"
```

## Deployment & Production

### Build Status
- ✅ **Production Ready**: All TypeScript errors and ESLint warnings resolved
- ✅ **Type Safety**: Strict TypeScript enforcement with zero compilation errors
- ✅ **Code Quality**: Clean build with proper error handling and type definitions
- ✅ **PWA Compatible**: Service worker and manifest configured for app installation

### Deployment Platforms

#### Cloudflare Pages (Recommended)
- **Status**: ✅ Successfully deployed and tested
- **Requirements**: 
  - Add `nodejs_compat` compatibility flag in Dashboard → Pages → Settings → Functions → Compatibility Flags
  - Set compatibility date to `2024-09-23` or later
  - Must redeploy after adding the flag
- **Configuration**: Add to `wrangler.toml` if needed:
  ```toml
  compatibility_flags = ["nodejs_compat"]
  compatibility_date = "2024-09-23"
  ```

#### Other Platforms
- **Vercel**: ✅ Fully compatible, automatic PWA support
- **Netlify**: ✅ Compatible with PWA features
- **GitHub Pages**: ❌ Not recommended (static hosting limitations for PWA)

### Performance & Technical Notes

#### Performance Optimizations
- IndexedDB operations are async and properly handled
- Components use React.memo and optimization patterns where beneficial
- 10-second logging goal achieved through streamlined UX
- Real-time AI categorization with semantic caching
- Service worker caching for offline performance
- Lazy loading and code splitting where applicable

#### Privacy & Security
- All data processing happens client-side for complete privacy
- No data transmission to external servers
- Local storage with IndexedDB encryption-ready architecture
- Settings and preferences stored locally only

#### AI & Machine Learning
- TensorFlow.js integration ready for advanced models
- Semantic scoring with weighted pattern matching
- Custom category integration with keyword matching
- Brand recognition and contextual understanding
- Multi-language support architecture in place
- Fallback systems for AI categorization failures
- Prioritizes custom categories in categorization flow

#### Code Quality Maintenance
- **TypeScript**: Strict mode enabled with comprehensive type coverage
- **ESLint**: All warnings resolved, follows Next.js best practices
- **React Hooks**: Proper dependency management with useCallback optimization
- **Error Handling**: Comprehensive try-catch blocks with user-friendly fallbacks
- **Performance**: Optimized re-renders and efficient state management