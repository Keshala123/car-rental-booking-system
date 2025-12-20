/**
 * Gallery Page
 * Visual showcase of the car fleet and facilities
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCars } from '../services/api';

const Gallery = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await getCars({ available: true });
      setCars(response.data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Economy', 'Luxury', 'SUV', 'Sports', 'Van'];

  const filteredCars = selectedCategory === 'All'
    ? cars
    : cars.filter((car) => car.category === selectedCategory);

  const facilityImages = [
    {
      url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
      title: 'Modern Showroom',
      category: 'Facilities',
    },
    {
      url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
      title: 'Premium Service Center',
      category: 'Facilities',
    },
    {
      url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
      title: 'Customer Lounge',
      category: 'Facilities',
    },
    {
      url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      title: 'Vehicle Inspection',
      category: 'Facilities',
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Explore our stunning collection of premium vehicles and world-class facilities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Cars */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Fleet</h2>
            <p className="text-gray-600 text-lg">
              {selectedCategory === 'All'
                ? 'Browse our complete collection'
                : `${selectedCategory} vehicles`}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading gallery...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg mb-1">
                          {car.name}
                        </h3>
                        <div className="flex items-center text-white text-sm">
                          <span>{car.transmission}</span>
                          <span className="mx-2">•</span>
                          <span>{car.fuelType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {car.category}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Facilities
            </h2>
            <p className="text-gray-600 text-lg">
              State-of-the-art facilities designed for your comfort
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {facilityImages.map((facility, index) => (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300">
                  <img
                    src={facility.url}
                    alt={facility.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-2xl">
                        {facility.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Experience Luxury?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Book your dream car today and enjoy an unforgettable driving experience
            </p>
            <a
              href="/booking"
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
            >
              Book Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
