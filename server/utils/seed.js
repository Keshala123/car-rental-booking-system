/**
 * Database Seeder
 * Populates the database with sample car data
 */

import Car from '../models/Car.js';
import User from '../models/User.js';

export const sampleCars = [
  {
    name: 'Toyota Camry 2024',
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    category: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    pricePerDay: 65,
    available: true,
    image: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Bluetooth', 'Backup Camera', 'Lane Assist', 'Apple CarPlay', 'Adaptive Cruise Control'],
    description: 'Reliable and fuel-efficient hybrid sedan perfect for business trips and family outings.',
    mileage: '52 MPG Combined',
    rating: 4.8,
  },
  {
    name: 'Honda CR-V 2024',
    brand: 'Honda',
    model: 'CR-V',
    year: 2024,
    category: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 75,
    available: true,
    image: 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Sunroof', 'All-Wheel Drive', 'Android Auto', 'Heated Seats', 'Power Liftgate'],
    description: 'Spacious SUV with excellent safety ratings and modern technology features.',
    mileage: '30 MPG Highway',
    rating: 4.7,
  },
  {
    name: 'BMW 3 Series 2024',
    brand: 'BMW',
    model: '3 Series',
    year: 2024,
    category: 'Luxury',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 120,
    available: true,
    image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Premium Sound', 'Leather Seats', 'Navigation', 'Sport Mode', 'Wireless Charging'],
    description: 'Luxury performance sedan with sophisticated design and cutting-edge technology.',
    mileage: '28 MPG Highway',
    rating: 4.9,
  },
  {
    name: 'Tesla Model 3 2024',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    category: 'Luxury',
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    pricePerDay: 95,
    available: true,
    image: 'https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Autopilot', 'Glass Roof', 'Premium Audio', 'Over-the-Air Updates', 'Supercharger Access'],
    description: 'All-electric luxury sedan with impressive range and innovative technology.',
    mileage: '358 Miles Range',
    rating: 4.9,
  },
  {
    name: 'Ford Mustang GT 2024',
    brand: 'Ford',
    model: 'Mustang GT',
    year: 2024,
    category: 'Sports',
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 4,
    pricePerDay: 150,
    available: true,
    image: 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Performance Package', 'Track Apps', 'Premium Sound', 'Launch Control', 'Sport Exhaust'],
    description: 'Iconic American muscle car with powerful V8 engine and thrilling performance.',
    mileage: '21 MPG Highway',
    rating: 4.8,
  },
  {
    name: 'Hyundai Elantra 2024',
    brand: 'Hyundai',
    model: 'Elantra',
    year: 2024,
    category: 'Compact',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 45,
    available: true,
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Bluetooth', 'Backup Camera', 'Lane Keep Assist', 'Smart Cruise Control'],
    description: 'Affordable and stylish compact sedan with great fuel economy and modern features.',
    mileage: '37 MPG Highway',
    rating: 4.5,
  },
  {
    name: 'Chevrolet Tahoe 2024',
    brand: 'Chevrolet',
    model: 'Tahoe',
    year: 2024,
    category: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 8,
    pricePerDay: 110,
    available: true,
    image: 'https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Third Row Seating', 'Towing Package', 'Rear Entertainment', '4WD', 'Power Running Boards'],
    description: 'Full-size SUV perfect for large families and long road trips with ample cargo space.',
    mileage: '23 MPG Highway',
    rating: 4.6,
  },
  {
    name: 'Mercedes-Benz E-Class 2024',
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2024,
    category: 'Luxury',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 140,
    available: true,
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Panoramic Roof', 'Premium Leather', 'Burmester Sound', 'Air Suspension', 'MBUX System'],
    description: 'Elegant luxury sedan combining comfort, performance, and advanced technology.',
    mileage: '29 MPG Highway',
    rating: 4.9,
  },
  {
    name: 'Kia Soul 2024',
    brand: 'Kia',
    model: 'Soul',
    year: 2024,
    category: 'Compact',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 50,
    available: true,
    image: 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Wireless CarPlay', 'LED Headlights', 'Blind Spot Monitor', 'Keyless Entry'],
    description: 'Unique and practical compact car with spacious interior and fun driving dynamics.',
    mileage: '31 MPG Highway',
    rating: 4.4,
  },
  {
    name: 'Dodge Charger R/T 2024',
    brand: 'Dodge',
    model: 'Charger R/T',
    year: 2024,
    category: 'Sports',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 130,
    available: true,
    image: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['HEMI V8', 'Performance Seats', 'Launch Assist', 'Harman Kardon Audio', 'Adaptive Suspension'],
    description: 'Powerful muscle sedan with V8 performance and modern comfort features.',
    mileage: '24 MPG Highway',
    rating: 4.7,
  },
  {
    name: 'Toyota Corolla 2024',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2024,
    category: 'Economy',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 40,
    available: true,
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Toyota Safety Sense', 'Apple CarPlay', 'Automatic Climate Control', 'LED Lights'],
    description: 'Most reliable economy car with excellent fuel efficiency and low maintenance costs.',
    mileage: '38 MPG Highway',
    rating: 4.6,
  },
  {
    name: 'Audi Q5 2024',
    brand: 'Audi',
    model: 'Q5',
    year: 2024,
    category: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 115,
    available: true,
    image: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen Sound', 'Panoramic Roof', 'Adaptive Air Suspension'],
    description: 'Premium compact SUV with refined luxury and exceptional handling.',
    mileage: '27 MPG Highway',
    rating: 4.8,
  },
];

/**
 * Seed database with sample cars
 */
export const seedDatabase = async () => {
  try {
    // Clear existing cars
    await Car.deleteMany({});
    console.log('🗑️  Cleared existing car data');

    // Insert sample cars
    const cars = await Car.insertMany(sampleCars);
    console.log(`✅ Seeded ${cars.length} cars successfully`);

    // Create demo user if doesn't exist
    const demoUserExists = await User.findOne({ email: 'demo@drivelux.com' });
    if (!demoUserExists) {
      await User.create({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@drivelux.com',
        password: 'demo123',
        phone: '+1234567890',
        role: 'user',
      });
      console.log('✅ Created demo user (email: demo@drivelux.com, password: demo123)');
    }

    return {
      message: 'Database seeded successfully',
      count: cars.length,
    };
  } catch (error) {
    console.error('❌ Seed Error:', error);
    throw error;
  }
};
