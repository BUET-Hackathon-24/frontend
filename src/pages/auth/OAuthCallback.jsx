import api from '@/lib/axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { updateAuthAtStorage } from './utils'

function getParams(url) {
  const params = {}
  const parser = new URL(url)
  const queryString = parser.hash.substring(1) // Remove the '#' at the beginning
  const queryParts = queryString.split('&')

  queryParts.forEach((part) => {
    const [key, value] = part.split('=')
    params[key] = decodeURIComponent(value)
  })

  return params
}

export default function OAuthCallback() {
  const navigate = useNavigate()

  async function exchangeToken() {
    const data = getParams(window.location.href)
    // setAuthToken(data.access_token)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    // const user = decodeJwt(data.access_token)
    // console.log(user)
    const res = await api.post('auth/exchange-token', {
      access_token: data.access_token,
    })
    updateAuthAtStorage(res?.data)
    console.log(res)
    navigate('/user/profile')
  }
  useEffect(() => {
    exchangeToken()
    return () => {
      // cleanup
    }
  }, [])

  return (
    <div>
      <h1>Redirecting ...</h1>
    </div>
  )
}
