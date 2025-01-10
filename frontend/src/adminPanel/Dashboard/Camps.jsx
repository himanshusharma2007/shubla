import { useState, useEffect } from 'react';
import campsService from "../../services/campsService";
import { Pencil } from 'lucide-react';
import CampForm from './CampComponents/CampForm';

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
    if (submitStatus.message) {
      const timer = setTimeout(() => {
        setSubmitStatus({ message: '', type: '' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  useEffect(() => {
    const fetchCampData = async () => {
      try {
        const response = await campsService.getCampsData();
        if (response.campData) {
          const camp = response.campData;
          setExistingCamp(response.campData);
          console.log('response.campData', response.campData)
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
          setShowCreateForm(false);
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
          setShowCreateForm(false);
        }
      }
    } catch (error) {
      setSubmitStatus({
        message: error.message || 'Failed to process camp data',
        type: 'error'
      });
    }
  };

  const StatusMessage = ({ message, type }) => (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out ${
        message ? 'translate-x-0' : 'translate-x-full'
      } ${
        type === 'success' 
          ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
          : 'bg-red-50 text-red-700 border-l-4 border-red-500'
      }`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );

  const renderViewMode = () => (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Camp Details</h2>
          <p className="text-gray-500 mt-1">View and manage your camp information</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Pencil size={18} /> Edit Camp
        </button>
      </div>

      <div className="grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Title</label>
                <p className="text-lg font-medium text-gray-800 mt-1">{formData.title}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Subtitle</label>
                <p className="text-lg font-medium text-gray-800 mt-1">{formData.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Capacity & Pricing</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacity</span>
                <span className="text-lg font-medium text-gray-800">{formData.capacity} people</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-lg font-medium text-green-600">${formData.price}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.facilities.map((facility, index) => (
              <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-gray-700">{facility}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{formData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Camps</h3>
            <p className="text-3xl font-bold text-blue-600">{formData.totalCamps}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Available Camps</h3>
            <p className="text-3xl font-bold text-green-600">{formData.availableCamps}</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Tent Type</h3>
            <p className="text-3xl font-bold text-purple-600 capitalize">{formData.tentType}</p>
          </div>
        </div>

        {/* <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Dimensions</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <span className="text-sm text-gray-600">Width</span>
              <p className="text-2xl font-bold text-gray-800 mt-1">{formData.dimension.width}m</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Length</span>
              <p className="text-2xl font-bold text-gray-800 mt-1">{formData.dimension.length}m</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <StatusMessage {...submitStatus} />

      <div className="bg-white rounded-lg shadow-lg">
        {showCreateForm && !existingCamp && (
          <CampForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
            handleFacilityChange={handleFacilityChange}
            addFacility={addFacility}
            removeFacility={removeFacility}
            isEditing={false}
          />
        )}
        {existingCamp && !isEditing && renderViewMode()}
        {existingCamp && isEditing && (
          <CampForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleSubmit={handleSubmit}
            handleFacilityChange={handleFacilityChange}
            addFacility={addFacility}
            removeFacility={removeFacility}
            isEditing={true}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>

  );
};

export default Camps;