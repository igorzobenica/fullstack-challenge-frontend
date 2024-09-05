const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getProfile = async (token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/profile`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const errorResponse = await response.json()
    throw new Error(errorResponse.message || 'Failed to fetch profile')
  }

  return response.json()
}

export const saveProfile = async (
  token: string,
  name: string,
  email: string,
  phoneNumber: string,
) => {
  const response = await fetch(
    `${API_BASE_URL}/profile`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, phoneNumber }),
    },
  )

  if (!response.ok) {
    const errorResponse = await response.json()
    throw new Error(errorResponse.message || 'Failed to save profile')
  }

  return response.json()
}
