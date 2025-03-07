import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = ({ role }) => {
  const authToken = localStorage.getItem('access_token')

  if (!authToken) {
    return <Navigate to={'/signin'} />
  }
  // if (role !== parseAuthToken().role) {
  //   alert('Are you lost son?')
  //   return <Navigate to={'/'} />
  // }
  return <Outlet />
}
