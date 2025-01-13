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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
            Image Upload Dashboard
          </h1>
          
          {/* Upload Type Toggle */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-8">
            <button
              onClick={() => setUploadType('gallery')}
              className={`flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                uploadType === 'gallery'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              Gallery Upload
            </button>
            <button
              onClick={() => setUploadType('instagram')}
              className={`flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                uploadType === 'instagram'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Link className="h-5 w-5 mr-2" />
              Instagram Upload
            </button>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-8 text-center transition-all duration-200 hover:border-blue-400">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-72 mx-auto rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="mx-auto h-16 w-16 text-blue-400" />
                  <label className="block mt-4 cursor-pointer">
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
                      Choose Image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="text-gray-500 mt-2">or drag and drop your image here</p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              {/* Alt Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Describe your image"
                />
              </div>

              {/* Instagram Link Input */}
              {uploadType === 'instagram' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:bg-blue-300 disabled:transform-none"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  'Upload Image'
                )}
              </button>
            </div>
          </form>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mt-6 p-4 rounded-xl ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Image Gallery */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {uploadType === 'gallery' ? 'Gallery Images' : 'Instagram Images'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(uploadType === 'gallery' ? galleryImages : instagramImages).map((img) => (
                <div key={img._id} className="group relative transform transition-all duration-200 hover:scale-105">
                  <img
                    src={img.image.url}
                    alt={img.alt}
                    className="w-full h-56 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl flex items-end">
                    <div className="text-white p-4 w-full">
                      <p className="font-medium text-lg">{img.alt}</p>
                      {img.link && (
                        <a
                          href={img.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-300 hover:text-blue-400 mt-2"
                        >
                          <Link className="h-4 w-4 mr-1" />
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