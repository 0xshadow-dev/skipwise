# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SkipWise** is a fully implemented temptation resistance tracking app built with Next.js. The app helps users track spending temptations, log resistance/indulgence decisions, and visualize financial savings through a privacy-first, local-only approach.

### Core Concept
Users log spending temptations in real-time (amount + description) and mark whether they resisted or gave in. The app uses keyword-based AI categorization to organize temptations and provides insights on savings and resistance patterns.

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
- Custom AI categorization using keyword matching
- Real-time progress calculations and statistics

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
├── category-icon.tsx   # Category-specific icons
├── progress-ring.tsx   # Circular progress component
└── new-temptation-modal.tsx  # Floating modal for logging

lib/
├── types.ts            # TypeScript interfaces and enums
├── storage.ts          # IndexedDB wrapper and database operations
├── calculations.ts     # Progress, streaks, and statistics utilities
├── ai-categorization.ts # Keyword-based categorization logic
└── utils.ts           # cn() utility and helpers
```

## Implemented Features

### ✅ Core Functionality (All Working)
- **4 Main Screens**: Home/Resist, Insights, History, Settings
- **Temptation Logging**: Floating action button with amount/description form
- **Resistance Tracking**: Toggle for resisted/gave-in with visual feedback
- **AI Categorization**: Automatic categorization into 7 categories (Food, Coffee, Shopping, etc.)
- **Progress Dashboard**: Total saved, success rate, current streak with animated progress rings
- **Recent Activity**: Last 4 temptations with category icons

### ✅ Data Management
- **Offline Storage**: Full IndexedDB implementation with data persistence
- **Search & Filters**: History screen with text search, category, and status filters
- **Data Export**: JSON export functionality for user data
- **Data Clearing**: Complete data reset with confirmation

### ✅ Analytics & Insights
- **Category Analysis**: Spending patterns by category with success rates
- **AI Insights**: Personalized challenges and success recommendations
- **Statistics**: Monthly spending/saving totals, streak calculations
- **Visual Progress**: Animated progress bars and circular progress rings

### ✅ User Experience
- **Mobile-First Design**: Optimized for one-handed smartphone usage
- **Bottom Navigation**: Tab-based navigation between 4 main screens
- **Responsive Layout**: Works on mobile and desktop
- **Custom Animations**: Smooth transitions and loading states
- **Error Handling**: Basic error states and loading indicators

## Remaining Enhancements

### Medium Priority
- **Theme System**: Dark/light mode toggle (UI exists, logic needed)
- **PWA Features**: Service worker, manifest, installability
- **Enhanced Mobile**: Haptic feedback, better touch interactions

### Low Priority
- **Notifications**: Reminder system (settings UI exists)
- **Advanced Charts**: Visual data representations beyond progress bars
- **Data Import**: JSON import to complement export feature

## Development Patterns

### Component Architecture
- Use `'use client'` for all interactive components
- Initialize IndexedDB on component mount with `useEffect`
- Manage state with `useState` and real-time updates
- Handle async operations with proper error boundaries

### Data Flow
1. Components call `initializeDB()` on mount
2. Use `db.getTemptations()`, `db.addTemptation()` etc. for CRUD operations
3. Calculate progress with utilities in `lib/calculations.ts`
4. Update UI state immediately for responsive UX

### Styling Conventions
- Mobile-first responsive design with Tailwind classes
- Use `cn()` utility for conditional styling
- Custom animations defined in `globals.css`
- Consistent spacing with `space-y-*` and `gap-*` classes
- Semantic color usage (green for success, red for failure)

## Path Aliases

```typescript
"@/*": ["./*"]           # Root-relative imports
"@/components": "./components"
"@/lib": "./lib"
```

## Performance Notes

- IndexedDB operations are async and properly handled
- Components use React.memo and optimization patterns where beneficial
- 10-second logging goal achieved through streamlined UX
- All data processing happens client-side for privacy