import { useState } from 'react';
import axios from 'axios';
import api from '../utils/api';

export default function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Get the signature and params from our backend
      const sigResponse = await api.post('/uploads/signature');
      const { timestamp, signature, cloud_name, api_key, folder } = sigResponse.data.data;

      // 2. Prepare FormData for Cloudinary API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      // 3. Upload directly to Cloudinary
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          },
        }
      );

      setIsUploading(false);
      
      return {
        url: cloudinaryResponse.data.secure_url,
        public_id: cloudinaryResponse.data.public_id,
        bytes: cloudinaryResponse.data.bytes,
        format: cloudinaryResponse.data.format,
        original_filename: cloudinaryResponse.data.original_filename,
        resource_type: cloudinaryResponse.data.resource_type
      };
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload file');
      setIsUploading(false);
      throw err;
    }
  };

  return { uploadFile, isUploading, progress, error };
}
