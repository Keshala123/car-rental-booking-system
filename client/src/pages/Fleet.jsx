/**
 * Fleet Page
 * Display all available cars with filtering options
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Car as CarIcon } from 'lucide-react';
import { getCars } from '../services/api';
import { formatCurrency } from '../utils/helpers';

const Fleet = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    transmission: '',
    fuelType: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    applyFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, cars]);

  const fetchCars = async () => {
    try {
      const response = await getCars({ available: true });
      setCars(response.data);
      setFilteredCars(response.data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...cars];

    if (filters.category) {
      result = result.filter((car) => car.category === filters.category);
    }
    if (filters.transmission) {
      result = result.filter((car) => car.transmission === filters.transmission);
    }
    if (filters.fuelType) {
      result = result.filter((car) => car.fuelType === filters.fuelType);
    }
    if (filters.minPrice) {
      result = result.filter((car) => car.pricePerDay >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((car) => car.pricePerDay <= Number(filters.maxPrice));
    }

    setFilteredCars(result);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      transmission: '',
      fuelType: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const categories = ['Economy', 'Luxury', 'SUV', 'Sports', 'Van'];
  const transmissions = ['Automatic', 'Manual'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4">Our Fleet</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Choose from our extensive collection of premium vehicles
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field px-4"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transmission Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transmission
                  </label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="input-field px-4"
                  >
                    <option value="">All Types</option>
                    {transmissions.map((trans) => (
                      <option key={trans} value={trans}>
                        {trans}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="input-field px-4"
                  >
                    <option value="">All Fuels</option>
                    {fuelTypes.map((fuel) => (
                      <option key={fuel} value={fuel}>
                        {fuel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range (per day)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="input-field px-4"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="input-field px-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredCars.length}
                </span>{' '}
                vehicles available
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading fleet...</p>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-20">
                <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No vehicles match your criteria
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-primary mt-4"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCars.map((car, index) => (
                  <motion.div
                    key={car._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="card group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {car.category}
                      </div>
                      {car.available && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Available
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {car.name}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <span className="font-medium">Transmission:</span>
                          <span className="ml-2">{car.transmission}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Fuel:</span>
                          <span className="ml-2">{car.fuelType}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Seats:</span>
                          <span className="ml-2">{car.seats}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Mileage:</span>
                          <span className="ml-2">{car.mileage}</span>
                        </div>
                      </div>

                      {car.features && car.features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {car.features.slice(0, 3).map((feature) => (
                              <span
                                key={feature}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-3xl font-bold text-primary-600">
                            {formatCurrency(car.pricePerDay)}
                          </span>
                          <span className="text-gray-600">/day</span>
                        </div>
                        <Link
                          to="/booking"
                          state={{ selectedCar: car }}
                          className="btn-primary"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fleet;
