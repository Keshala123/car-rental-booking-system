import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data } = await api.get('/cars');
      setCars(data.data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      await api.delete(`/admin/cars/${id}`);
      setCars(cars.filter(car => car._id !== id));
      alert('Car deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete car');
    }
  };

  const handleToggleAvailability = async (car) => {
    try {
      const { data } = await api.patch(`/admin/cars/${car._id}/availability`);
      setCars(cars.map(c => c._id === car._id ? data.data : c));
      alert(data.message);
    } catch (error) {
      console.error('Toggle availability error:', error);
      alert('Failed to update availability');
    }
  };

  const filteredCars = filter === 'all' 
    ? cars 
    : cars.filter(car => filter === 'available' ? car.available : !car.available);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Cars</h1>
            <p className="text-gray-600 mt-2">Total: {cars.length} cars</p>
          </div>
          <Link
            to="/admin/cars/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Car
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All ({cars.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded ${filter === 'available' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Available ({cars.filter(c => c.available).length})
            </button>
            <button
              onClick={() => setFilter('unavailable')}
              className={`px-4 py-2 rounded ${filter === 'unavailable' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            >
              Unavailable ({cars.filter(c => !c.available).length})
            </button>
          </div>
        </div>

        {/* Cars Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transmission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCars.map((car) => (
                <tr key={car._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src={car.image} 
                        alt={`${car.make} ${car.model}`}
                        className="w-20 h-14 object-cover rounded"
                      />
                      <div className="ml-4">
                        <p className="font-semibold">{car.make} {car.model}</p>
                        <p className="text-sm text-gray-500">{car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {car.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">${car.pricePerDay}</td>
                  <td className="px-6 py-4">{car.transmission}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {car.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/cars/edit/${car._id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleToggleAvailability(car)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title={car.available ? 'Deactivate' : 'Activate'}
                      >
                        {car.available ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
