import { Routes, Route, Navigate } from 'react-router-dom'
import HomeScreen from './home/HomeScreen'
import EditorScreen from './editor/EditorScreen'
import PreviewScreen from './preview/PreviewScreen'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/editor/new" element={<EditorScreen />} />
      <Route path="/editor/:id" element={<EditorScreen />} />
      <Route path="/preview/:id" element={<PreviewScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
