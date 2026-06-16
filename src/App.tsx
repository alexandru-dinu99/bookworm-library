import { HashRouter as BrowserRouter } from 'react-router-dom'
import AppRouter from './ui/router'

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
