import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage
    const storedToken = localStorage.getItem('lv_token')
    const storedUser = localStorage.getItem('lv_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('lv_token', jwtToken)
    localStorage.setItem('lv_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('lv_token')
    localStorage.removeItem('lv_user')
  }

  const isAuthenticated = !!token
  const isAuthority = user?.role === 'AUTHORITY'
  const isCitizen = user?.role === 'CITIZEN'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated, isAuthority, isCitizen }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext
