/**
 * Terms & Conditions Page
 * Legal terms and rental policies
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Shield, CreditCard, Car } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Rental Agreement',
      content: [
        'By booking a vehicle with DriveLux, you agree to these terms and conditions.',
        'The renter must be at least 21 years old with a valid driver\'s license held for a minimum of 1 year.',
        'All rentals require a valid credit or debit card for security deposit purposes.',
        'The rental agreement begins when you pick up the vehicle and ends when you return it.',
      ],
    },
    {
      icon: CreditCard,
      title: 'Payment & Deposits',
      content: [
        'Full payment is required at the time of booking or vehicle pickup.',
        'A refundable security deposit is required and will be held on your credit card.',
        'Security deposits range from $200-$1000 depending on vehicle category.',
        'The deposit is released within 5-7 business days after vehicle return and inspection.',
        'Additional charges may apply for late returns, fuel, tolls, and damages.',
      ],
    },
    {
      icon: Shield,
      title: 'Insurance & Coverage',
      content: [
        'All vehicles come with basic liability insurance coverage.',
        'Additional insurance options are available at the time of booking.',
        'Collision Damage Waiver (CDW) and Loss Damage Waiver (LDW) are strongly recommended.',
        'Personal insurance may cover rental vehicles - check with your provider.',
        'You are responsible for any damage to the vehicle during the rental period.',
      ],
    },
    {
      icon: Car,
      title: 'Vehicle Usage',
      content: [
        'Vehicles must be used in accordance with local traffic laws and regulations.',
        'Smoking is strictly prohibited in all vehicles.',
        'Pets are not allowed unless pre-approved and pet fee is paid.',
        'Off-road driving is prohibited for all vehicle categories.',
        'Vehicles may not be used for racing, towing, or commercial purposes.',
        'Maximum occupancy must not be exceeded.',
      ],
    },
    {
      icon: AlertCircle,
      title: 'Cancellations & Modifications',
      content: [
        'Free cancellation up to 48 hours before scheduled pickup time.',
        'Cancellations within 48 hours incur a 50% cancellation fee.',
        'No-shows are charged the full rental amount.',
        'Modifications to bookings are subject to availability and may incur fees.',
        'Refunds are processed within 7-10 business days.',
      ],
    },
  ];

  const additionalTerms = [
    {
      title: 'Fuel Policy',
      text: 'Vehicles are provided with a full tank of fuel and must be returned full. A refueling service charge will apply if returned with less fuel.',
    },
    {
      title: 'Mileage',
      text: 'Most rentals include unlimited mileage. Special rate rentals may have mileage restrictions as specified in your agreement.',
    },
    {
      title: 'Late Returns',
      text: 'A grace period of 30 minutes is provided. After that, late fees apply at an hourly rate up to the daily rate.',
    },
    {
      title: 'Roadside Assistance',
      text: '24/7 roadside assistance is included with all rentals. Contact our emergency hotline in case of breakdown or accident.',
    },
    {
      title: 'Additional Drivers',
      text: 'Additional drivers can be added for a daily fee. All drivers must meet age and license requirements and be present at pickup.',
    },
    {
      title: 'Cross-Border Travel',
      text: 'Cross-border travel requires prior approval and additional insurance. Not all vehicles are eligible for cross-border rentals.',
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
            <h1 className="text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Please read these terms carefully before making a reservation. By booking with DriveLux, you agree to these terms and conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Terms Sections */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md p-8"
                >
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-3 rounded-lg mr-4 flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {section.title}
                      </h2>
                      <ul className="space-y-3">
                        {section.content.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary-600 mr-3 mt-1">•</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Terms */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Additional Policies
              </h2>
              <p className="text-gray-600 text-lg">
                Important information about our rental policies
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {additionalTerms.map((term, index) => (
                <motion.div
                  key={term.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {term.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{term.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <div className="flex items-start">
                <AlertCircle className="w-8 h-8 text-primary-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Important Notice
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      These terms and conditions are subject to change without notice. It is your responsibility to review them before each rental.
                    </p>
                    <p>
                      DriveLux reserves the right to refuse service to anyone who does not meet our rental requirements or who has violated our terms in the past.
                    </p>
                    <p>
                      By proceeding with a booking, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
                    </p>
                    <p className="font-semibold">
                      Last updated: December 2025
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Have Questions About Our Terms?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Our customer service team is here to help clarify any questions you may have.
            </p>
            <a
              href="/contact"
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
