import { getApiResponse, setAuthToken } from '@/lib/API'
import { decodeJwt } from 'jose'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

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
    setAuthToken(data.access_token)
    const user = decodeJwt(data.access_token)
    console.log(user)
    await getApiResponse('exchangeToken', data)
    navigate('/user/chat')
    console.log(data)
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
