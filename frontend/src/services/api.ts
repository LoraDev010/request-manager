import axios from 'axios'
import { ApiResponse, Request, Status } from '../types'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

export async function fetchRequests(): Promise<Request[]> {
  const { data } = await http.get<ApiResponse<Request[]>>('/requests')
  return data.data ?? []
}

export async function createRequest(title: string): Promise<Request> {
  const { data } = await http.post<ApiResponse<Request>>('/requests', { title })
  return data.data!
}

export async function updateRequestStatus(id: string, status: Status): Promise<Request> {
  const { data } = await http.patch<ApiResponse<Request>>(`/requests/${id}`, { status })
  return data.data!
}
