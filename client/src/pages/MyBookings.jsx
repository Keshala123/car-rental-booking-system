/**
 * My Bookings Page
 * View all user bookings with filtering
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Car, DollarSign, Filter, Search } from 'lucide-react';
import { getUserBookings } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = [...bookings];
    const now = new Date();

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter((b) => new Date(b.returnDate) > now);
    } else if (filter === 'completed') {
      filtered = filtered.filter((b) => new Date(b.returnDate) <= now);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.car?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.dropoffLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [filter, searchTerm, bookings]);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your car rentals</p>
        </div>

        {/* Filters and Search */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by car, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Car className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : "You haven't made any bookings yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Car Image */}
                  <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={booking.car?.image || '/placeholder-car.jpg'}
                      alt={booking.car?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = '/placeholder-car.jpg')}
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.car?.name || 'Car Details'}
                        </h3>
                        <p className="text-gray-600">
                          {booking.car?.brand} • {booking.car?.category}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          new Date(booking.returnDate) > new Date()
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {new Date(booking.returnDate) > new Date() ? 'Active' : 'Completed'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Pickup</p>
                          <p className="font-medium text-gray-900">
                            {new Date(booking.pickupDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Return</p>
                          <p className="font-medium text-gray-900">
                            {new Date(booking.returnDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{booking.pickupLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Total Price</p>
                          <p className="font-bold text-primary-600 text-lg">
                            ${booking.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
