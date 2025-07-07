// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  },

  isTokenValid: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },
}

const API_BASE_URL = "https://autointern-backend-webservice.onrender.com/api"


interface AuthResponse {
  user_id: number
  email: string
  token: string
}

interface Internship {
  id: number
  title: string
  company: string
  location: string
  description: string
  url: string
  created_at: string
}

interface Application {
  id: number
  user_id: number
  internship_id: number
  status: string
  applied_date: string
  internship?: Internship
}

export const auth = {
  signup: async (email: string, password: string ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || errorData.message || "Signup failed")
    }
    return response.json()
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || errorData.message || "Login failed")
    }
    return response.json()
  },

  googleLogin: async (id_token: string, email: string): Promise<AuthResponse> => {
    // For demo purposes, simulate a successful Google login
    if (id_token.startsWith("demo_google_token_")) {
      return {
        user_id: 1,
        email: email || "demo@google.com",
        token: id_token,
      }
    }

    // Real Google login implementation
    const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ google_id: id_token, email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Google login failed")
    }
    return response.json()
  },

  me: async (token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch user data")
    }
    return response.json()
  },

  logout: async (): Promise<void> => {
    const token = tokenManager.getToken()
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Logout request failed:", error)
      } finally {
        tokenManager.removeToken()
      }
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const token = tokenManager.getToken()
    if (!token) {
      throw new Error("No token available for refresh")
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Token refresh failed")
    }

    return response.json()
  },
}

export const internships = {
  getAll: async (token: string, query?: string, location?: string): Promise<Internship[]> => {
    let url = `${API_BASE_URL}/internships`
    const params = new URLSearchParams()
    if (query) params.append("query", query)
    if (location) params.append("location", location)
    if (params.toString()) url += `?${params.toString()}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch internships")
    }
    return response.json()
  },

  apply: async (token: string, internship_id: number): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/internships/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ internship_id }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to apply for internship")
    }
    return response.json()
  },
}

export const applications = {
  getAll: async (token: string): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch applications")
    }
    return response.json()
  },

  updateStatus: async (token: string, application_id: number, status: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${application_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update application status")
    }
    return response.json()
  },
}

// API request wrapper with automatic token handling
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = tokenManager.getToken()

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    if (!tokenManager.isTokenValid(token)) {
      try {
        const refreshResponse = await auth.refreshToken()
        tokenManager.setToken(refreshResponse.token)
        headers["Authorization"] = `Bearer ${refreshResponse.token}`
      } catch (error) {
        tokenManager.removeToken()
        throw new Error("Session expired. Please login again.")
      }
    } else {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    tokenManager.removeToken()
    throw new Error("Authentication failed. Please login again.")
  }

  return response
}
