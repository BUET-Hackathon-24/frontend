import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const Logout = () => {
  const navigate = useNavigate()
  useEffect(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('avatar')
    navigate('/')
    return () => {
      // cleanup
    }
  }, [])

  return <div>Logout</div>
}

export default Logout
