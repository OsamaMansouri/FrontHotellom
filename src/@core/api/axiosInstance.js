import axios from 'axios'
//http://127.0.0.1:8000  000
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/'
})

export default axiosInstance
