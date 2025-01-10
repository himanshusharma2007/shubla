import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Link, Loader } from 'lucide-react';
import imageService from '../../services/imageService';

const ImageUploadAdmin = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadType, setUploadType] = useState('gallery');
  const [formData, setFormData] = useState({
    alt: '',
    link: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [galleryImages, setGalleryImages] = useState([]);
  const [instagramImages, setInstagramImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, [uploadType]);

  const fetchImages = async () => {
    try {
      if (uploadType === 'gallery') {
        const response = await imageService.getAllGalleryImages();
        setGalleryImages(response.data);
      } else {
        const response = await imageService.getAllInstagramImages();
        setInstagramImages(response.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching images' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage || !formData.alt) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (uploadType === 'instagram' && !formData.link) {
      setMessage({ type: 'error', text: 'Instagram link is required' });
      return;
    }

    setLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', selectedImage);
    uploadFormData.append('alt', formData.alt);
    if (uploadType === 'instagram') {
      uploadFormData.append('link', formData.link);
    }

    try {
      const uploadService = uploadType === 'gallery' 
        ? imageService.uploadGalleryImage 
        : imageService.uploadInstagramImage;
      
      await uploadService(uploadFormData);
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      setSelectedImage(null);
      setImagePreview(null);
      setFormData({ alt: '', link: '' });
      fetchImages();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading image' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Image Upload Dashboard</h1>
          
          {/* Upload Type Toggle */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUploadType('gallery')}
              className={`px-4 py-2 rounded-md transition-colors ${
                uploadType === 'gallery'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ImageIcon className="inline-block mr-2 h-5 w-5" />
              Gallery Upload
            </button>
            <button
              onClick={() => setUploadType('instagram')}
              className={`px-4 py-2 rounded-md transition-colors ${
                uploadType === 'instagram'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Link className="inline-block mr-2 h-5 w-5" />
              Instagram Upload
            </button>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <label className="block mt-2 cursor-pointer">
                    <span className="text-blue-500 hover:text-blue-600">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Alt Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alt Text *
              </label>
              <input
                type="text"
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter alt text for the image"
              />
            </div>

            {/* Instagram Link Input */}
            {uploadType === 'instagram' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instagram Link *
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://instagram.com/..."
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                'Upload Image'
              )}
            </button>
          </form>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mt-4 p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Image Gallery */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              {uploadType === 'gallery' ? 'Gallery Images' : 'Instagram Images'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(uploadType === 'gallery' ? galleryImages : instagramImages).map((img) => (
                <div key={img._id} className="relative group">
                  <img
                    src={img.image.url}
                    alt={img.alt}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-white text-center p-2">
                      <p className="font-medium">{img.alt}</p>
                      {img.link && (
                        <a
                          href={img.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-400 mt-2 block"
                        >
                          View on Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadAdmin;