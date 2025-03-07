import axios from 'axios'

const api = axios.create({
  baseURL: 'http://172.28.31.70:3000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('access_token'),
  },
})

export default api
