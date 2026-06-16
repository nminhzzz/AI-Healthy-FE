import apiClient from './apiClient';

export interface UploadResponse {
  url: string;
}

export const uploadService = {
  /**
   * Upload an image file to the server, which uploads it to Cloudinary.
   * @param file The image file to upload
   * @returns A promise resolving to the Cloudinary image URL
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  },
};
