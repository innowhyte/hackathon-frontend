# Sahayak - AI-Powered Teaching Assistant from Team Innowhyter

![Sahayak Logo](https://img.shields.io/badge/Sahayak-Teaching%20Assistant-blue?style=for-the-badge&logo=graduation-cap)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0.6-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)

**Revolutionizing Education with AI-Powered Teaching Tools**

## Technology Stack

### Frontend

- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.0.6** - Lightning-fast build tool
- **React Router 7.7.1** - Modern routing solution
- **TanStack Query 5.83.0** - Powerful data fetching and caching

### UI/UX

- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### AI Integration

- **Microsoft Fetch Event Source** - Real-time AI streaming
- **Marked + React Markdown** - Rich content rendering
- **KaTeX** - Mathematical expression rendering

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Fast, disk space efficient package manager

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/innowhyte/hackathon-frontend.git
   cd hackathon-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format code with Prettier
```

---

## App Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── modals/         # Dialog components
│   └── ...             # Feature-specific components
├── pages/              # Route components
│   ├── grade-selection.tsx
│   ├── topics.tsx
│   ├── weekly-plan.tsx
│   ├── day-lesson.tsx
│   ├── student-management.tsx
│   ├── assessments.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── queries/            # React Query hooks
├── mutations/          # Data mutation hooks
├── context/            # React context providers
└── lib/                # Utility functions
```

## UI/UX Highlights

- **Mobile-First Design**: Optimized for tablet and mobile use in classrooms
- **Accessibility**: WCAG compliant with screen reader support
- **Dark/Light Mode**: Adaptive theming system
- **Responsive Layout**: Works seamlessly across all devices
- **Intuitive Navigation**: Bottom navigation for easy access
- **Real-time Feedback**: Toast notifications and loading states

## Development Guidelines

- **TypeScript**: Strict typing throughout the application
- **ESLint**: Enforced code quality standards
- **Prettier**: Consistent code formatting
- **Component Structure**: Organized imports and clear separation of concerns

### Best Practices

- **React Query**: Efficient data fetching and caching
- **Custom Hooks**: Reusable logic encapsulation
- **Error Boundaries**: Graceful error handling
- **Performance**: Optimized rendering and bundle size

## Firebase Deployment

1. Clone the repository in Firebase studio.
2. Install dependencies.
3. Set up environment variables.
4. Initialize Firebase Hosting.
5. Select or create a new project.
6. Deploy to production.
7. You should be able to see the app at the public url provided by Firebase.
