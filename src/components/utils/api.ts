const BASE_API_GET = async ({ url }, option = {}) => {
  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbxBOmAFIqTDEIOtop-UdGZ8wDOTy5ocJkUYGp-pJhYGF8J0_iv6u96tomb6DAufhHoiSg/exec?method=${url}`,
    {
      method: 'GET',
      ...option
    }
  )
  const result = await response.json()
  return result
}

const BASE_API_POST = async ({ url, data }, option = {}) => {
  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbwxGbRTz99tiBQAoJUjY-zuoy7rtO_dR2-7cYDr725ILbZXVlK-hMfvReJKxYp0s2tY/exec?method=${url}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(data),
      ...option
    }
  )
  const result = await response.json()
  return result
}
export { BASE_API_GET, BASE_API_POST }
