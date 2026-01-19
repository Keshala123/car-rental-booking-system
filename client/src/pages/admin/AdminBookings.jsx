import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const url = filter === 'all' ? '/admin/bookings' : `/admin/bookings?status=${filter}`;
      const { data } = await api.get(url);
      setBookings(data.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const { data } = await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(bookings.map(b => b._id === bookingId ? data.data : b));
      alert(data.message);
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update booking status');
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-5 h-5 text-yellow-600" />,
      confirmed: <CheckCircle className="w-5 h-5 text-blue-600" />,
      completed: <TrendingUp className="w-5 h-5 text-green-600" />,
      cancelled: <XCircle className="w-5 h-5 text-red-600" />,
    };
    return icons[status] || null;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600 mt-2">Total: {bookings.length} bookings</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              Pending
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Confirmed
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
            >
              <XCircle className="w-4 h-4" />
              Cancelled
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No bookings found
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Customer Info */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer</p>
                    <p className="font-semibold">{booking.user?.firstName} {booking.user?.lastName}</p>
                    <p className="text-sm text-gray-600">{booking.user?.email}</p>
                    <p className="text-sm text-gray-600">{booking.user?.phone}</p>
                  </div>

                  {/* Car Info */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Vehicle</p>
                    <p className="font-semibold">{booking.car?.make} {booking.car?.model}</p>
                    <p className="text-sm text-gray-600">{booking.car?.year} • {booking.car?.category}</p>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dates</p>
                    <p className="text-sm">
                      <span className="font-semibold">Pick up:</span> {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Return:</span> {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-semibold text-blue-600 mt-2">
                      Total: ${booking.totalPrice}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Status</p>
                    <div className="flex items-center gap-2 mb-4">
                      {getStatusIcon(booking.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    {/* Status Change Dropdown */}
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Booking ID: {booking._id} • Created: {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
