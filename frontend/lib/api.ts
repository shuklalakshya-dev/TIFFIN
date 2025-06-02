"use client"

/**
 * Helper function for making API requests that automatically falls back to the backend API
 * if the Next.js API fails.
 */
export async function apiRequest<T = any>({
  url,
  backendUrl = url.startsWith('/') ? `http://localhost:5000${url}` : url,
  method = "GET",
  token,
  body,
  headers = {},
}: {
  url: string
  backendUrl?: string
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  token?: string | null
  body?: any
  headers?: Record<string, string>
}): Promise<T> {
  const requestHeaders: Record<string, string> = {
    ...headers,
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  if (body && typeof body !== "string") {
    requestHeaders["Content-Type"] = "application/json"
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    requestOptions.body = typeof body === "string" ? body : JSON.stringify(body)
  }

  try {
    // Try Next.js API first
    try {
      const res = await fetch(url, requestOptions)
        if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `Next.js API failed with status: ${res.status}`)
      }
      
      return await res.json()
    } catch (error) {
      console.log(`Falling back to backend API: ${backendUrl}`)
      // Fall back to backend API
      const backendRes = await fetch(backendUrl, requestOptions)
        if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `Backend API request failed with status: ${backendRes.status}`)
      }
      
      return await backendRes.json()
    }
  } catch (error) {
    console.error("API Request Error:", error)
    throw error
  }
}
