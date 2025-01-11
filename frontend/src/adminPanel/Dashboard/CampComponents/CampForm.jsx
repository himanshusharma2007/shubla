import React from 'react';
import { X, Plus, Save, ArrowLeft } from 'lucide-react';

const CampForm = ({ 
  formData, 
  setFormData, 
  errors, 
  handleSubmit, 
  handleFacilityChange, 
  addFacility, 
  removeFacility, 
  isEditing, 
  setIsEditing 
}) => {
  const InputField = ({ label, name, value, onChange, error, type = 'text', ...props }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-2.5 rounded-lg border transition-all duration-200
          focus:ring-2 focus:ring-offset-2 focus:outline-none
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          }
          ${props.disabled ? 'bg-gray-100' : 'bg-white'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠</span> {error}
        </p>
      )}
    </div>
  );

  const TextArea = ({ label, value, onChange, error, ...props }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-2.5 rounded-lg border transition-all duration-200
          focus:ring-2 focus:ring-offset-2 focus:outline-none resize-vertical min-h-[100px]
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          }
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠</span> {error}
        </p>
      )}
      <div className="absolute bottom-2 right-2 text-sm text-gray-500">
        {value.length}/500 characters
      </div>
    </div>
  );

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };

  const handleDimensionChange = (type, value) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({
        ...formData,
        dimension: { ...formData.dimension, [type]: value }
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Camp' : 'Create New Camp'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing 
              ? 'Update your camp information below' 
              : 'Fill in the details to create a new camp'
            }
          </p>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to View
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            maxLength={100}
            placeholder="Enter camp title"
          />

          <InputField
            label="Subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            error={errors.subtitle}
            maxLength={200}
            placeholder="Enter camp subtitle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facilities
            <span className="text-sm text-gray-500 ml-2">
              ({formData.facilities.length}/10)
            </span>
          </label>
          <div className="space-y-3">
            {formData.facilities.map((facility, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => handleFacilityChange(index, e.target.value)}
                  className={`
                    flex-1 px-4 py-2.5 rounded-lg border transition-all duration-200
                    focus:ring-2 focus:ring-offset-2 focus:outline-none
                    ${errors.facilities ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder={`Facility ${index + 1}`}
                />
                {formData.facilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFacility(index)}
                    className="p-2.5 text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove facility"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {formData.facilities.length < 10 && (
              <button
                type="button"
                onClick={addFacility}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Facility
              </button>
            )}
          </div>
          {errors.facilities && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠</span> {errors.facilities}
            </p>
          )}
        </div>

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          maxLength={500}
          placeholder="Describe your camp..."
          rows="4"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Total Camps"
            type="number"
            value={formData.totalCamps}
            onChange={(e) => setFormData({ ...formData, totalCamps: e.target.value })}
            error={errors.totalCamps}
            min="1"
            max="100"
          />

          <InputField
            label="Available Camps"
            type="number"
            value={formData.availableCamps}
            onChange={(e) => setFormData({ ...formData, availableCamps: e.target.value })}
            error={errors.availableCamps}
            min="0"
            max={formData.totalCamps}
          />

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tent Type</label>
            <input
              type="text"
              value="Bedouin"
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Capacity (persons)"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            error={errors.capacity}
            min="1"
            max="16"
          />

          <InputField
            label="Price (USD)"
            type="text"
            value={formData.price}
            onChange={handlePriceChange}
            error={errors.price}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Width (m)"
              type="text"
              value={formData.dimension.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              error={errors.dimension}
              placeholder="0.00"
            />

            <InputField
              label="Length (m)"
              type="text"
              value={formData.dimension.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              error={errors.dimension}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Update Camp' : 'Create Camp'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampForm;