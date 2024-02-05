interface ApiType {
  url: string
  data?: object
}

const BASE_API_GET = async ({ url }: ApiType, option = {}): Promise<object> => {
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

const BASE_API_POST = async ({ url, data }: ApiType) => {
  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbwtop2A2rfR3laXSv3lLJ5ZRVk7PabfAS5Qqs2mBJlY6lT97jTp6YEku7NnZ_-z4BPPyg/exec?method=${url}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(data)
    }
  )
  const result = await response.json()
  console.log(result)
  return result
}
export { BASE_API_GET, BASE_API_POST }
