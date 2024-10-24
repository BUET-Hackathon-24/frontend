import { setAuthToken } from '@/lib/API'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const Logout = () => {
  const navigate = useNavigate()
  useEffect(() => {
    setAuthToken('')
    navigate('/')
    return () => {
      // cleanup
    }
  }, [])

  return <div>Logout</div>
}

export default Logout
