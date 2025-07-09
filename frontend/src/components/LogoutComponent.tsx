import { useContext } from 'react'
import AuthContext from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'

const LogoutComponent = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        auth?.logout()
        navigate("/login")
    }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}

export default LogoutComponent