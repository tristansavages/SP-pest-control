import { createContext, useContext, useReducer, useEffect } from 'react'
import { login as apiLogin, verifyAuth } from '../utils/api'

const AuthContext = createContext(null)

const initialState = { user: null, token: null, isAuthenticated: false, isLoading: true }

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'AUTH_CHECKED':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('jb_admin_token')
      if (!token) {
        dispatch({ type: 'AUTH_CHECKED' })
        return
      }
      try {
        const res = await verifyAuth()
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: res.data.data.user, token } })
      } catch {
        localStorage.removeItem('jb_admin_token')
        dispatch({ type: 'AUTH_CHECKED' })
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const res = await apiLogin(email, password)
    const { token, user } = res.data.data
    localStorage.setItem('jb_admin_token', token)
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
    return { user, token }
  }

  const logout = () => {
    localStorage.removeItem('jb_admin_token')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
