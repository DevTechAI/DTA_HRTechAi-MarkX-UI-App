# MarkX - Internal HR Portal Guidance

## Project Overview
MarkX is an internal HR application for managing employee attendance, leave, expenses, and timesheets. It uses Next.js with App Router, TypeScript, Tailwind+ShadCN UI for styling, Zustand for state management, and MySQL with Microsoft OAuth.

## Architecture & Key Patterns

### Backend Integration
- Backend application uses Microsoft OAuth for authentication and authorization
- MySQL database hosted on Clever Cloud for data persistence
- Integration with frontend via API routes in Next.js
- Production environment uses real authentication while development uses mock auth

### Authentication Flow
- Mock authentication is used in development via `lib/mock-auth.ts`
- Zustand auth store (`store/auth.ts`) manages user state with localStorage persistence
- Microsoft OAuth is implemented for production authentication
- Protected routes are wrapped in the `(auth)` route group with its own layout
- User roles and permissions are derived from Microsoft OAuth claims

### Component Structure
- UI components are from ShadCN and extended in `components/ui/`
- Layout components in `components/layout/` handle the app shell:
  - `AppSidebar.tsx` - Navigation sidebar
  - `UserProfileMenu.tsx` - Profile dropdown menu
  - See `app/(auth)/layout.tsx` for how these are composed
- Theme management via `ThemeToggle` component with next-themes
- Utility components like `DateTimeDisplay` provide consistent UI elements across the app

### State Management
- Zustand stores in `store/` folder organized by feature
- Each store uses `create()` with optional persistence (see `auth.ts`)
- Avoid direct store imports in components; use hooks like `useSetupMockUser()`
- Always memoize functions that are used in useEffect dependency arrays with useCallback
- Be careful with state updates in useEffect cleanup functions to avoid infinite loops

### Routing Strategy
- Next.js App Router pattern with page.tsx files
- Authentication-required pages live in `app/(auth)/` route group
- Public pages (login) at root level in `app/`

## Important Developer Workflows

### Setup & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Linting and formatting
npm run lint
npm run format
```

### Authentication Testing
- For development, a mock user is automatically loaded in `(auth)` routes via useSetupMockUser hook
- Sign out via user profile menu redirects to home page automatically
- Mock user defined in `lib/mock-auth.ts` can be modified for testing different roles
- When signing out, avoid state updates after unmounting to prevent React errors

## Project-Specific Conventions

### Form Patterns
- Use React Hook Form with Zod validation
- Follow pattern in `components/forms/` for consistent form handling

### Component Naming
- Page components are named `page.tsx` (Next.js convention)
- Layout components use PascalCase with `Layout` suffix
- UI components use kebab-case filenames but PascalCase export names

### Error Handling
- Use toast notifications for user feedback (see `hooks/use-toast.ts`)
- Avoid React's setState in cleanup phases (causes infinite loop errors)
- Always wrap hook functions with useCallback when used in dependency arrays
- When handling navigation after auth state changes, use window.location.href to avoid React router conflicts
- For async operations with state updates, ensure the component is still mounted before updating state

## Common Pitfalls
- Hooks used outside of React components will cause runtime errors
- The sidebar navigation requires proper layout nesting
- Zustand store updates must follow immutability principles
