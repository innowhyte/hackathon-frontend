## React + Vite

### Router

Using `react-router` for routing.

follow the declarative installation guide: https://reactrouter.com/start/declarative/installation

```tsx
import { BrowserRouter, Routes, Route } from 'react-router'
;<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>
```

## API Integration

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Topics

-
- Student Management

### Student Management

The student management feature is now integrated with the backend API using React Query:

- **Queries**: `src/queries/student-queries.ts` - Fetch students by grade
- **Mutations**: `src/mutations/student-mutations.ts` - Create, update, delete students
- **Context**: Students are now managed by React Query with server state as source of truth
- **UI**: Loading states, error handling, and success notifications are implemented

### API Endpoints

- `POST /api/students/` - Create a new student
- `PUT /api/students/{id}/` - Update a student
- `DELETE /api/students/{id}/` - Delete a student
- `GET /api/students/grade/{gradeId}` - Get students by grade
- `GET /api/students/` - Get all students

## Flow

### Grade Selection

need to save the selected grades.

- Special instructions per grade (Optional), Location, Language

