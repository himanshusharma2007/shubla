`import { useState, useEffect } from 'react';
import campsService from "../../services/campsService"
import { Pencil } from 'lucide-react';

const Camps = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    facilities: [''],
    description: '',
    totalCamps: '',
    availableCamps: '',
    tentType: 'bedouin',
    capacity: '',
    dimension: {
      width: '',
      length: ''
    },
    price: ''
  });

  const [existingCamp, setExistingCamp] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(true);

  useEffect(() => {
    const fetchCampData = async () => {
      try {
        const response = await campsService.getCampsData();
        console.log("response", response)
        if (response.campData) {
         const camp = response.campData;
          setExistingCamp(response.campData);
        console.log("camp", camp)

          setFormData({
            title: camp.title || '',
            subtitle: camp.subtitle || '',
            facilities: camp.facilities.length ? camp.facilities : [''],
            description: camp.description || '',
            totalCamps: camp.totalCamps || '',
            availableCamps: camp.availableCamps || '',
            tentType: camp.tentType || 'bedouin',
            capacity: camp.capacity || '',
            dimension: {
              width: camp.dimension?.width || '',
              length: camp.dimension?.length || ''
            },
            price: camp.pricing || ''
          });
          setShowCreateForm(false); // Hide create form if camp exists
        }
        setIsLoading(false);
      } catch (error) {
        setSubmitStatus({ message: 'Failed to fetch camp data', type: 'error' });
        setIsLoading(false);
      }
    };

    fetchCampData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required';
    } else if (formData.subtitle.length > 200) {
      newErrors.subtitle = 'Subtitle cannot exceed 200 characters';
    }

    if (!formData.facilities[0]) {
      newErrors.facilities = 'At least one facility is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.totalCamps || formData.totalCamps < 1) {
      newErrors.totalCamps = 'Total camps must be at least 1';
    }

    if (!formData.availableCamps) {
      newErrors.availableCamps = 'Available camps is required';
    }

    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (formData.capacity > 16) {
      newErrors.capacity = 'Capacity cannot exceed 16 people';
    }

    if (!formData.dimension.width || !formData.dimension.length) {
      newErrors.dimension = 'Both width and length are required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    }

    return newErrors;
  };

  const handleFacilityChange = (index, value) => {
    const updatedFacilities = [...formData.facilities];
    updatedFacilities[index] = value;
    setFormData({ ...formData, facilities: updatedFacilities });
  };

  const addFacility = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, '']
    });
  };

  const removeFacility = (index) => {
    const updatedFacilities = formData.facilities.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      facilities: updatedFacilities
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus({ message: 'Please fix the errors before submitting', type: 'error' });
      return;
    }

    try {
      let data;
      if (existingCamp) {
        data = await campsService.updateCampData(existingCamp._id, formData);
        if (data.success) {
          setSubmitStatus({ message: 'Camp updated successfully!', type: 'success' });
          setExistingCamp({ ...existingCamp, ...formData });
          setIsEditing(false);
        }
      } else {
        data = await campsService.createCampData(formData);
        if (data.success) {
          setSubmitStatus({ message: 'Camp created successfully!', type: 'success' });
          setExistingCamp({ ...data.camp });
          setShowCreateForm(false); // Hide create form after successful creation
        }
      }
    } catch (error) {
      setSubmitStatus({
        message: error.message || 'Failed to process camp data',
        type: 'error'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  const renderViewMode = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Camp Details</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Pencil size={16} /> Edit Camp
        </button>
      </div>

      <div className="grid gap-4">
        <div>
          <h3 className="font-semibold">Title</h3>
          <p>{formData.title}</p>
        </div>
        <div>
          <h3 className="font-semibold">Subtitle</h3>
          <p>{formData.subtitle}</p>
        </div>
        <div>
          <h3 className="font-semibold">Facilities</h3>
          <ul className="list-disc pl-5">
            {formData.facilities.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Description</h3>
          <p>{formData.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Total Camps</h3>
            <p>{formData.totalCamps}</p>
          </div>
          <div>
            <h3 className="font-semibold">Available Camps</h3>
            <p>{formData.availableCamps}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Tent Type</h3>
          <p>{formData.tentType}</p>
        </div>
        <div>
          <h3 className="font-semibold">Capacity</h3>
          <p>{formData.capacity} people</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Price</h3>
          <p>${formData.price}</p>
        </div>
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <>
      <h2 className="text-2xl font-bold mb-6">Create New Camp</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form fields remain the same */}
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
        </div>

        <div>
          <label className="block mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className={`w-full p-2 border rounded ${errors.subtitle ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.subtitle && <span className="text-red-500 text-sm">{errors.subtitle}</span>}
        </div>

        <div>
          <label className="block mb-2">Facilities</label>
          {formData.facilities.map((facility, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={facility}
                onChange={(e) => handleFacilityChange(index, e.target.value)}
                className={`flex-1 p-2 border rounded ${errors.facilities ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formData.facilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFacility(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFacility}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Facility
          </button>
          {errors.facilities && <span className="text-red-500 text-sm block mt-1">{errors.facilities}</span>}
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            rows="4"
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Total Camps</label>
            <input
              type="number"
              value={formData.totalCamps}
              onChange={(e) => setFormData({ ...formData, totalCamps: e.target.value })}
              className={`w-full p-2 border rounded ${errors.totalCamps ? 'border-red-500' : 'border-gray-300'}`}
              min="1"
            />
            {errors.totalCamps && <span className="text-red-500 text-sm">{errors.totalCamps}</span>}
          </div>

          <div>
            <label className="block mb-2">Available Camps</label>
            <input
              type="number"
              value={formData.availableCamps}
              onChange={(e) => setFormData({ ...formData, availableCamps: e.target.value })}
              className={`w-full p-2 border rounded ${errors.availableCamps ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
            {errors.availableCamps && <span className="text-red-500 text-sm">{errors.availableCamps}</span>}
          </div>
        </div>

        <div>
          <label className="block mb-2">Tent Type</label>
          <select
            value={formData.tentType}
            onChange={(e) => setFormData({ ...formData, tentType: e.target.value })}
            className="w-full p-2 border rounded border-gray-300"
            disabled
          >
            <option value="bedouin">Bedouin</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Capacity</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className={`w-full p-2 border rounded ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
            max="16"
          />
          {errors.capacity && <span className="text-red-500 text-sm">{errors.capacity}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Width (m)</label>
            <input
              type="number"
              value={formData.dimension.width}
              onChange={(e) => setFormData({
                ...formData,
                dimension: { ...formData.dimension, width: e.target.value }
              })}
              className={`w-full p-2 border rounded ${errors.dimension ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block mb-2">Length (m)</label>
            <input
              type="number"
              value={formData.dimension.length}
              onChange={(e) => setFormData({
                ...formData,
                dimension: { ...formData.dimension, length: e.target.value }
              })}
              className={`w-full p-2 border rounded ${errors.dimension ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.dimension && <span className="text-red-500 text-sm col-span-2">{errors.dimension}</span>}
        </div>

        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            min="0"
          />
          {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Create Camp
          </button>
        </div>
      </form>
    </>
  );

  const renderEditForm = () => (
    <>
      <h2 className="text-2xl font-bold mb-6">Edit Camp</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
        </div>

        <div>
          <label className="block mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className={`w-full p-2 border rounded ${errors.subtitle ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.subtitle && <span className="text-red-500 text-sm">{errors.subtitle}</span>}
        </div>

        <div>
          <label className="block mb-2">Facilities</label>
          {formData.facilities.map((facility, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={facility}
                onChange={(e) => handleFacilityChange(index, e.target.value)}
                className={`flex-1 p-2 border rounded ${errors.facilities ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formData.facilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFacility(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFacility}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Facility
          </button>
          {errors.facilities && <span className="text-red-500 text-sm block mt-1">{errors.facilities}</span>}
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            rows="4"
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Total Camps</label>
            <input
              type="number"
              value={formData.totalCamps}
              onChange={(e) => setFormData({ ...formData, totalCamps: e.target.value })}
              className={`w-full p-2 border rounded ${errors.totalCamps ? 'border-red-500' : 'border-gray-300'}`}
              min="1"
            />
            {errors.totalCamps && <span className="text-red-500 text-sm">{errors.totalCamps}</span>}
          </div>

          <div>
            <label className="block mb-2">Available Camps</label>
            <input
              type="number"
              value={formData.availableCamps}
              onChange={(e) => setFormData({ ...formData, availableCamps: e.target.value })}
              className={`w-full p-2 border rounded ${errors.availableCamps ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
            {errors.availableCamps && <span className="text-red-500 text-sm">{errors.availableCamps}</span>}
          </div>
        </div>

        <div>
          <label className="block mb-2">Tent Type</label>
          <select
            value={formData.tentType}
            onChange={(e) => setFormData({ ...formData, tentType: e.target.value })}
            className="w-full p-2 border rounded border-gray-300"
            disabled
          >
            <option value="bedouin">Bedouin</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Capacity</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className={`w-full p-2 border rounded ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
            max="16"
          />
          {errors.capacity && <span className="text-red-500 text-sm">{errors.capacity}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Width (m)</label>
            <input
              type="number"
              value={formData.dimension.width}
              onChange={(e) => setFormData({
                ...formData,
                dimension: { ...formData.dimension, width: e.target.value }
              })}
              className={`w-full p-2 border rounded ${errors.dimension ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block mb-2">Length (m)</label>
            <input
              type="number"
              value={formData.dimension.length}
              onChange={(e) => setFormData({
                ...formData,
                dimension: { ...formData.dimension, length: e.target.value }
              })}
              className={`w-full p-2 border rounded ${errors.dimension ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.dimension && <span className="text-red-500 text-sm col-span-2">{errors.dimension}</span>}
        </div>

        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            min="0"
          />
          {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Update Camp
          </button>
        </div>
      </form>
    </>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {submitStatus.message && (
        <div className={`p-4 mb-4 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitStatus.message}
        </div>
      )}

      {showCreateForm && !existingCamp && renderCreateForm()}
      {existingCamp && !isEditing && renderViewMode()}
      {existingCamp && isEditing && renderEditForm()}
    </div>
  );
};

export default Camps;`