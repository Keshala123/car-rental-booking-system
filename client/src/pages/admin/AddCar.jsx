import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function AddCar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Economy',
    pricePerDay: '',
    seats: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    mileage: '',
    image: '',
    features: '',
    description: '',
    available: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert features from comma-separated string to array
      const features = formData.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('brand', formData.brand);
      submitData.append('category', formData.category);
      submitData.append('pricePerDay', Number(formData.pricePerDay));
      submitData.append('seats', Number(formData.seats));
      submitData.append('transmission', formData.transmission);
      submitData.append('fuelType', formData.fuelType);
      submitData.append('mileage', formData.mileage);
      submitData.append('description', formData.description);
      submitData.append('available', formData.available);
      
      // Add features array
      features.forEach(feature => {
        submitData.append('features[]', feature);
      });

      // Add image file if selected, otherwise use URL
      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.image) {
        submitData.append('image', formData.image);
      }

      await api.post('/admin/cars', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Car added successfully!');
      navigate('/admin/cars');
    } catch (error) {
      console.error('Add car error:', error);
      alert(error.response?.data?.message || 'Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/cars')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cars
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to add a new car</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Car Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Toyota Camry"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Toyota"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Economy">Economy</option>
                <option value="Luxury">Luxury</option>
                <option value="SUV">SUV</option>
                <option value="Sports">Sports</option>
                <option value="Van">Van</option>
              </select>
            </div>

            {/* Price Per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Day ($) *
              </label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50"
              />
            </div>

            {/* Seats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seats *
              </label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
                min="1"
                max="15"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
              />
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mileage
              </label>
              <input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 25 MPG"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Image *
              </label>
              
              {/* File Upload */}
              <div className="mb-3">
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* OR separator */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* URL Input */}
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                disabled={!!imageFile}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="https://example.com/car-image.jpg"
              />

              {/* Image Preview */}
              {(imagePreview || formData.image) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={imagePreview || formData.image}
                    alt="Car preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Features */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (comma-separated)
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="GPS, Bluetooth, Backup Camera, Leather Seats"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the car..."
              />
            </div>

            {/* Available */}
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Available for booking
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Add Car
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/cars')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
