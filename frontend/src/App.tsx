
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useAuth } from './hooks/useAuthContext'
import { Register } from './pages/Register'
import Login from './pages/Login'
import Board from './pages/Board'
import ActivityLog from './pages/Activitylogs'


function App() {
  const {user} = useAuth()
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={ <Board /> } />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="*" element={<Navigate to={user ? "/board" : "/login"} />} />
      </Routes>
    </>
  )
}

export default App
