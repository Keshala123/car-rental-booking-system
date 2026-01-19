import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { 
  Users, Car, Calendar, MessageSquare, DollarSign, 
  TrendingUp, CheckCircle, Clock, XCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.overview?.totalUsers || 0}
            icon={<Users className="w-8 h-8" />}
            color="blue"
            link="/admin/users"
          />
          <StatCard
            title="Total Cars"
            value={stats?.overview?.totalCars || 0}
            icon={<Car className="w-8 h-8" />}
            color="green"
            link="/admin/cars"
          />
          <StatCard
            title="Total Bookings"
            value={stats?.overview?.totalBookings || 0}
            icon={<Calendar className="w-8 h-8" />}
            color="purple"
            link="/admin/bookings"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.overview?.totalRevenue?.toLocaleString() || 0}`}
            icon={<DollarSign className="w-8 h-8" />}
            color="yellow"
          />
        </div>

        {/* Booking Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MiniStatCard
            title="Pending"
            value={stats?.bookings?.pending || 0}
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
          <MiniStatCard
            title="Confirmed"
            value={stats?.bookings?.confirmed || 0}
            icon={<CheckCircle className="w-6 h-6" />}
            color="blue"
          />
          <MiniStatCard
            title="Completed"
            value={stats?.bookings?.completed || 0}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <MiniStatCard
            title="Cancelled"
            value={stats?.bookings?.cancelled || 0}
            icon={<XCircle className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              to="/admin/cars/new"
              label="Add New Car"
              icon="🚗"
              color="blue"
            />
            <QuickActionButton
              to="/admin/bookings"
              label="Manage Bookings"
              icon="📅"
              color="green"
            />
            <QuickActionButton
              to="/admin/users"
              label="Manage Users"
              icon="👥"
              color="purple"
            />
            <QuickActionButton
              to="/admin/contacts"
              label="View Messages"
              icon="💬"
              color="yellow"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            {stats?.recent?.bookings?.length > 0 ? (
              <div className="space-y-4">
                {stats.recent.bookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{booking.user?.firstName} {booking.user?.lastName}</p>
                      <p className="text-sm text-gray-600">{booking.car?.make} {booking.car?.model}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent bookings</p>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            {stats?.recent?.users?.length > 0 ? (
              <div className="space-y-4">
                {stats.recent.users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, link }) {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    yellow: 'bg-yellow-500 text-white',
  };

  return (
    <Link to={link} className={`rounded-lg shadow-md p-6 hover:shadow-lg transition ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </Link>
  );
}

function MiniStatCard({ title, value, icon, color }) {
  const colorClasses = {
    orange: 'border-orange-500 text-orange-700',
    blue: 'border-blue-500 text-blue-700',
    green: 'border-green-500 text-green-700',
    red: 'border-red-500 text-red-700',
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function QuickActionButton({ to, label, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
  };

  return (
    <Link
      to={to}
      className={`${colorClasses[color]} text-white p-4 rounded-lg transition text-center`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-semibold">{label}</div>
    </Link>
  );
}

function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
