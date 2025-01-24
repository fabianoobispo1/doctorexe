import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://minhaapi.fabianoobispo.com.br',
  headers: {
    'Content-Type': 'application/json',
  },
})
