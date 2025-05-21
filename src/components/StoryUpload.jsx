// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const StoryUpload = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const getPresignedUrl = async (file) => {
    const res = await axios.get(`${BASE_URL}/get-presigned-url`, {
      params: { fileName: file.name, fileType: file.type },
    });
    return res.data;
  };

  const uploadToS3 = async (file, uploadUrl) => {
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    try {
      setIsUploading(true);
      const { uploadUrl, filePath } = await getPresignedUrl(file);
      await uploadToS3(file, uploadUrl);

      const mediaType = file.type.startsWith('image') ? 'image' : 'video';

      await axios.post(`${BASE_URL}/story`, {
        mediaUrl: filePath,
        mediaType,
        caption,
      }, { withCredentials: true });

      setFile(null);
      setCaption('');
      setPreviewUrl('');
      navigate("/post/feed");
    } catch (err) {
      console.error(err);
      alert('Upload failed!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-gray-500 shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Upload a Story</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 bg-gray-100 rounded border border-gray-300 cursor-pointer p-2"
        />

        {previewUrl && (
          <div className="mt-2">
            {file.type.startsWith('image') ? (
              <img src={previewUrl} alt="Preview" className="w-full rounded-md shadow-md" />
            ) : (
              <video src={previewUrl} controls className="w-full rounded-md shadow-md" />
            )}
          </div>
        )}

        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 text-white rounded ${isUploading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
        >
          {isUploading ? 'Uploading...' : 'Upload Story'}
        </button>
      </form>
    </div>
  );
};

export default StoryUpload;