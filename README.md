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
