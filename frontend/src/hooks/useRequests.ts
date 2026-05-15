import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRequests, createRequest, updateRequestStatus } from '../services/api'
import type { Status } from '../types'

const QUERY_KEY = ['requests']

export function useRequests() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchRequests })
}

export function useCreateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (title: string) => createRequest(title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      updateRequestStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
