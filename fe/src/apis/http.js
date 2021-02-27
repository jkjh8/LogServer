import axios from 'axios'

export const instance = function () {
  const instance = axios.create({
    baseURL: `http://${window.location.hostname}:3000`,
  })
  return instance
}