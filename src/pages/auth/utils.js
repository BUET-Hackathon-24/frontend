export function updateAuthAtStorage(response) {
  const { access_token, refresh_token } = response

  localStorage.setItem('access_token', access_token)
  localStorage.setItem('refresh_token', refresh_token)
}
