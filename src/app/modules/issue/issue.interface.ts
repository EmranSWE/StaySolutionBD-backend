/* eslint-disable @typescript-eslint/no-explicit-any */

export interface UpdateIssueResponse {
  success?: boolean
  data?: any
  error?: string
}

export type IIssueFilterRequest = {
  searchTerm?: string
  priorityLevel?: string
  issueStatus?: string
  [key: string]: any
}
