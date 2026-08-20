import client from './client'

export const uploadImage = async (file: File): Promise<string> => {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post<{ url: string }>('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.url
}
