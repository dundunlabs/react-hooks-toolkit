import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createSharedState, useSharedState } from 'react-hooks-toolkit'

const sharedCount = createSharedState(0)

function App() {
  const [count] = useSharedState(sharedCount)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p>count is {count || 0}</p>
      <Counter />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

function Counter() {
  const [count, setCount] = useSharedState(sharedCount)

  return (
    <div className="card">
      <button onClick={() => setCount((count || 0) + 1)}>
        increase count
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  )
}
export default App
