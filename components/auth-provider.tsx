'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPocketBase } from '@/lib/pocketbase'
import type { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const pb = getPocketBase()

    const model = pb.authStore.model
    if (model && pb.authStore.isValid) {
      setUser({ id: model.id, email: model.email, name: model.name ?? '', avatar: model.avatar ?? '' })
    }
    setLoading(false)

    const unsub = pb.authStore.onChange((token, model) => {
      if (model && token) {
        setUser({ id: model.id, email: model.email, name: model.name ?? '', avatar: model.avatar ?? '' })
      } else {
        setUser(null)
      }
    })

    return () => unsub()
  }, [])

  function logout() {
    const pb = getPocketBase()
    pb.authStore.clear()
    // Supprimer le cookie d'auth
    document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
