import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100">
        <div className="mb-8 flex gap-8">
          <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
            <img
              src={viteLogo}
              className="h-24 w-24 drop-shadow-lg transition-all duration-300 hover:drop-shadow-2xl"
              alt="Vite logo"
            />
          </a>
          <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
            <img
              src={reactLogo}
              className="h-24 w-24 drop-shadow-lg transition-all duration-300 hover:drop-shadow-2xl"
              alt="React logo"
            />
          </a>
        </div>
        <h1 className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-4xl font-extrabold text-transparent">
          Vite + React
        </h1>
        <div className="card mb-6 flex flex-col items-center gap-4 rounded-xl border border-purple-100 bg-white/80 p-8 shadow-xl">
          <button
            onClick={() => setCount(count => count + 1)}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          >
            count is {count}
          </button>
          <p className="text-gray-600">
            Edit <code className="rounded bg-gray-100 px-1 text-purple-600">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs mt-2 text-sm text-gray-500">Click on the Vite and React logos to learn more</p>
      </div>
    </>
  )
}

export default App
