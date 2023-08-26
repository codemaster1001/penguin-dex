import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"

interface ErrorDetails {
  message: string
  code: number
}

const api = axios.create()

api.interceptors.response.use((response) => response.data)

function useApi() {
  const get = async (url: string) => await api.get(url)
  const post = async (url: string, data: any) => await api.post(url, data)

  const call = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios(config)

      return response.data
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorDetails>
      const errorResponse = axiosError.response

      if (errorResponse) {
        const errorDetails: ErrorDetails = errorResponse.data

        throw new Error(`API Error: ${errorDetails.message} (Code: ${errorDetails.code})`)
      } else {
        throw new Error("An unknown error occurred while calling the API.")
      }
    }
  }

  return { get, post, call }
}

export default useApi
